from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from api.models import db, Order, OrderDetail, order_status, User
from . import api

@api.route('/orders', methods=['GET'])
def get_orders():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        search = request.args.get("search", "").strip()
        status_filter = request.args.get("status", "").upper().strip()

        stmt = select(Order).options(
            joinedload(Order.user),
            joinedload(Order.details).joinedload(OrderDetail.dish),
            joinedload(Order.details).joinedload(OrderDetail.drink)
        )

        if search:
            stmt = stmt.join(Order.user).where(
                User.email.ilike(f"%{search}%")
            )

        if status_filter:
            if status_filter in order_status.__members__:
                stmt = stmt.where(Order.status == order_status[status_filter])
            else:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[s.name for s in order_status]}"
                }), 400

        total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))

        stmt = stmt.order_by(Order.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
        orders = db.session.scalars(stmt).unique().all()

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": [order.serialize() for order in orders]
        }), 200

    except Exception as e:
        print("Error en GET /orders:", e)
        return jsonify({"error": str(e)}), 500

@api.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        new_order = Order(
            user_id=current_user_id,
            table_id=data.get("table_id"),
            status=order_status.PENDIENTE,
            total=0
        )

        db.session.add(new_order)
        db.session.flush()  # Get the order ID

        total = 0
        details = []

        # Process dishes
        for dish_item in data.get("dishes", []):
            detail = OrderDetail(
                order_id=new_order.id,
                dish_id=dish_item["id"],
                quantity=dish_item["quantity"],
                price=dish_item["price"]
            )
            total += detail.price * detail.quantity
            details.append(detail)

        # Process drinks
        for drink_item in data.get("drinks", []):
            detail = OrderDetail(
                order_id=new_order.id,
                drink_id=drink_item["id"],
                quantity=drink_item["quantity"],
                price=drink_item["price"]
            )
            total += detail.price * detail.quantity
            details.append(detail)

        new_order.total = total
        db.session.add_all(details)
        db.session.commit()

        return jsonify({
            "message": "Orden creada exitosamente",
            "order": new_order.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Error al crear orden:", e)
        return jsonify({"error": str(e)}), 500

@api.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404

        db.session.delete(order)
        db.session.commit()

        return jsonify({"message": "Orden eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al eliminar orden:", e)
        return jsonify({"error": str(e)}), 500

@api.route('/orders/<int:id>', methods=['PUT'])
def update_order_status(id):
    try:
        data = request.get_json()
        order = Order.query.get(id)

        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404

        status_str = data.get("status", "").upper()
        if status_str not in order_status.__members__:
            return jsonify({
                "error": f"Estado inválido. Usa uno de: {[s.name for s in order_status]}"
            }), 400

        order.status = order_status[status_str]
        db.session.commit()

        return jsonify({
            "message": "Estado de la orden actualizado correctamente",
            "order": order.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar estado de la orden:", e)
        return jsonify({"error": str(e)}), 500

@api.route('/mis-ordenes', methods=['GET'])
@jwt_required()
def mis_ordenes():
    try:
        current_user_id = get_jwt_identity()
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        status_filter = request.args.get("status", "").upper().strip()

        stmt = select(Order).options(
            joinedload(Order.details).joinedload(OrderDetail.dish),
            joinedload(Order.details).joinedload(OrderDetail.drink)
        ).where(Order.user_id == current_user_id)

        if status_filter:
            if status_filter in order_status.__members__:
                stmt = stmt.where(Order.status == order_status[status_filter])
            else:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[s.name for s in order_status]}"
                }), 400

        total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))

        stmt = stmt.order_by(Order.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
        orders = db.session.scalars(stmt).unique().all()

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": [order.serialize() for order in orders]
        }), 200

    except Exception as e:
        print("Error en GET /mis-ordenes:", e)
        return jsonify({"error": str(e)}), 500 