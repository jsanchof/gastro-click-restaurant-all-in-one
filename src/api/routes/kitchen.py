from flask import request, jsonify
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from api.models import db, Order, OrderDetail, order_status
from . import api

@api.route('/cocina/ordenes', methods=['GET'])
def get_ordenes_para_cocina():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        status_filter = request.args.get("status", "").upper().strip()

        stmt = select(Order).options(
            joinedload(Order.user),
            joinedload(Order.details).joinedload(OrderDetail.dish),
            joinedload(Order.details).joinedload(OrderDetail.drink)
        )

        # Por defecto, mostrar órdenes pendientes y en proceso
        if not status_filter:
            stmt = stmt.where(Order.status.in_([order_status.PENDIENTE, order_status.EN_PROCESO]))
        elif status_filter in order_status.__members__:
            stmt = stmt.where(Order.status == order_status[status_filter])
        else:
            return jsonify({
                "error": f"Estado inválido. Usa uno de: {[s.name for s in order_status]}"
            }), 400

        total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))

        stmt = stmt.order_by(Order.created_at.asc()).offset((page - 1) * per_page).limit(per_page)
        orders = db.session.scalars(stmt).unique().all()

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": [order.serialize() for order in orders]
        }), 200

    except Exception as e:
        print("Error en GET /cocina/ordenes:", e)
        return jsonify({"error": str(e)}), 500

@api.route('/cocina/ordenes/<int:id>', methods=['PUT'])
def actualizar_estado_orden(id):
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