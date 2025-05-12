"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Reservation, Table, reservation_status, table_status, Order, order_status, OrderDetail, Dishes, dish_type, Drinks, drink_type
from api.utils import generate_sitemap, APIException
from api.models import db, User, Reservation, Table, reservation_status
from api.utils import generate_sitemap, APIException, send_email_reservation
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, or_, func
from sqlalchemy.orm import joinedload

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/reservations', methods=['POST', 'GET'])
def create_reservation():
    if request.method == 'POST':
        data = request.get_json()
        try:
            # Validar status de la reserva
            status_str = data.get("status", "PENDIENTE").upper()
            if status_str not in reservation_status.__members__:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[s.name for s in reservation_status]}"
                }), 400
            status_enum = reservation_status[status_str]

            # Crear la reserva
            new_reservation = Reservation(
                user_id=data.get("user_id"),
                guest_name=data["guest_name"],
                guest_phone=data["guest_phone"],
                email=data["email"],
                quantity=data["quantity"],
                table_id=data.get("table_id"),
                status=status_enum,
                start_date_time=datetime.strptime(data["start_date_time"], "%Y-%m-%d %H:%M:%S"),
                additional_details=data.get("additional_details")
            )

            db.session.add(new_reservation)

            # Actualizar el estado de la mesa si corresponde
            if data.get("table_id") and status_enum in [reservation_status.PENDIENTE, reservation_status.CONFIRMADA]:
                table = db.session.get(Table, data["table_id"])
                if table:
                    table.status = table_status.RESERVADA

            db.session.commit()
            send_email_reservation(data)

            return jsonify({
                "msg": "Reservación creada exitosamente",
                "reservation_id": new_reservation.id
            }), 201

        except Exception as e:
            db.session.rollback()
            print("Error al crear reservación:", e)
            return jsonify({"error": str(e)}), 500


    if request.method == 'GET':
        try:
            page = int(request.args.get("page", 1))
            per_page = int(request.args.get("per_page", 10))
            search = request.args.get("search", "").strip()
            status_filter = request.args.get("status", "").upper().strip()
            date_filter = request.args.get("date", "").strip()  # formato YYYY-MM-DD

            stmt = select(Reservation)

            # Filtro por nombre o correo
            if search:
                stmt = stmt.where(
                    or_(
                        Reservation.guest_name.ilike(f"%{search}%"),
                        Reservation.email.ilike(f"%{search}%")
                    )
                )

            # Filtro por estado
            if status_filter:
                if status_filter in reservation_status.__members__:
                    stmt = stmt.where(Reservation.status == reservation_status[status_filter])
                else:
                    return jsonify({
                        "error": f"Estado inválido. Usa uno de: {[s.name for s in reservation_status]}"
                    }), 400

            # Filtro por fecha
            if date_filter:
                try:
                    date_obj = datetime.strptime(date_filter, "%Y-%m-%d").date()
                    stmt = stmt.where(cast(Reservation.start_date_time, Date) == date_obj)
                except ValueError:
                    return jsonify({"error": "Formato de fecha inválido. Usa YYYY-MM-DD"}), 400

            # Total con filtros
            total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))

            # Paginación
            stmt = stmt.order_by(Reservation.start_date_time.desc()).offset((page - 1) * per_page).limit(per_page)

            reservations = db.session.scalars(stmt).all()

            return jsonify({
                "total": total,
                "page": page,
                "per_page": per_page,
                "pages": (total + per_page - 1) // per_page,
                "items": [res.serialize() for res in reservations]
            }), 200

        except Exception as e:
            print("Error en GET /reservations:", e)
            return jsonify({"error": str(e)}), 500

# Actualiza una reserva existente


@api.route('/reservations/<int:id>', methods=['PUT'])
def update_reservation(id):
    try:
        data = request.get_json()
        reserva = Reservation.query.get(id)

        if not reserva:
            return jsonify({"error": "Reserva no encontrada"}), 404

        reserva.guest_name = data.get('guest_name', reserva.guest_name)
        reserva.email = data.get('email', reserva.email)
        reserva.guest_phone = data.get('guest_phone', reserva.guest_phone)
        reserva.quantity = data.get('quantity', reserva.quantity)
        reserva.additional_details = data.get('additional_details', reserva.additional_details)

        # Validar y actualizar status de la reserva
        new_status = data.get('status', reserva.status)
        if new_status and isinstance(new_status, str):
            new_status_upper = new_status.upper()
            if new_status_upper not in reservation_status.__members__:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[s.name for s in reservation_status]}"
                }), 400
            reserva.status = reservation_status[new_status_upper]

        # Actualizar fecha si se provee
        if data.get('start_date_time'):
            try:
                reserva.start_date_time = datetime.strptime(data['start_date_time'], "%Y-%m-%d %H:%M:%S")
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido. Usa YYYY-MM-DD HH:MM:SS"}), 400

        # Actualizar estado de la mesa según el nuevo estado de la reserva
        if reserva.table_id:
            table = db.session.get(Table, reserva.table_id)
            if table:
                if reserva.status == reservation_status.CONFIRMADA:
                    table.status = table_status.RESERVADA
                elif reserva.status == reservation_status.COMPLETADA:
                    table.status = table_status.OCUPADA
                elif reserva.status == reservation_status.CANCELADA:
                    table.status = table_status.LIBRE

        db.session.commit()
        return jsonify({"message": "Reserva actualizada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar la reserva:", e)
        return jsonify({"error": "Ocurrió un error al actualizar la reserva"}), 500


@api.route('/reservations/<int:id>', methods=['DELETE'])
def delete_reservation(id):
    try:
        reserva = Reservation.query.get(id)

        if not reserva:
            return jsonify({"error": "Reserva no encontrada"}), 404

        db.session.delete(reserva)
        db.session.commit()

        return jsonify({"msg": f"Reserva con ID {id} eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al eliminar la reserva:", e)
        return jsonify({"error": "Ocurrió un error al eliminar la reserva"}), 500

@api.route('/tables', methods=['POST', 'GET'])
def handle_table():
    if request.method == 'POST':
        data = request.get_json()

        if not data.get("chairs") or not data.get("number"):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        try:
            new_table = Table(
                number=data["number"],
                chairs=data["chairs"],
                status=table_status.LIBRE
            )

            db.session.add(new_table)
            db.session.commit()

            return jsonify({"msg": "Mesa creada exitosamente", "table_id": new_table.id}), 201

        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({"error": "Error al crear mesa"}), 500

    if request.method == 'GET':
        try:
            tables = Table.query.all()
            result = list(map(lambda x: x.serialize(), tables))
            return jsonify(result), 200

        except Exception as e:
            print(e)
            return jsonify({"error": "Error al obtener las mesas"}), 500

@api.route('/tables/<int:id>', methods=['PUT'])
def update_table(id):
    try:
        data = request.get_json()
        table = Table.query.get(id)

        if not table:
            return jsonify({"error": "Mesa no encontrada"}), 404

        # Campos opcionales
        table.number = data.get("number", table.number)
        table.chairs = data.get("chairs", table.chairs)

        if "status" in data:
            try:
                table.status = table_status[data["status"].upper()]
            except KeyError:
                return jsonify({"error": f"Estado inválido. Usa uno de: {[s.name for s in table_status]}"}), 400

        db.session.commit()
        return jsonify({"msg": "Mesa actualizada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar mesa:", e)
        return jsonify({"error": "Error al actualizar la mesa"}), 500

@api.route('/tables/<int:id>', methods=['DELETE'])
def delete_table(id):
    try:
        table = Table.query.get(id)

        if not table:
            return jsonify({"error": "Mesa no encontrada"}), 404

        db.session.delete(table)
        db.session.commit()
        return jsonify({"msg": f"Mesa con ID {id} eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al eliminar mesa:", e)
        return jsonify({"error": "Error al eliminar la mesa"}), 500


@api.route('/orders', methods=['GET'])
def get_orders():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        search = request.args.get("search", "").strip()

        stmt = select(Order).join(Order.user, isouter=True)

        if search:
            stmt = stmt.where(
                or_(
                    Order.order_code.ilike(f"%{search}%"),
                    User.name.ilike(f"%{search}%"),
                    User.last_name.ilike(f"%{search}%")
                )
            )

        total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))

        stmt = (
            stmt.order_by(Order.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )

        orders = db.session.scalars(stmt).all()

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": [order.serialize() for order in orders]
        }), 200

    except Exception as e:
        print("Error al obtener las órdenes:", e)
        return jsonify({"error": "Error al obtener las órdenes"}), 500


@api.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    user_email = get_jwt_identity()

    stmt_user = select(User).where(User.email == user_email)
    user = db.session.scalars(stmt_user).first()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    required_fields = ['order_code', 'items', 'total']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan datos obligatorios: order_code, items, total"}), 400

    if not isinstance(data['items'], list) or len(data['items']) == 0:
        return jsonify({"error": "Debe proporcionar una lista de items (detalles de orden)"}), 400

    try:
        # Validar que no se repita el código
        if Order.query.filter_by(order_code=data['order_code']).first():
            return jsonify({"error": "Ya existe una orden con ese código"}), 409

        order = Order(
            order_code=data['order_code'],
            user_id=user.id or None,  # puede ser None
            status=order_status.EN_PROCESO,
            total=data['total']
        )
        db.session.add(order)
        db.session.flush()  # obtenemos el ID antes de commit

        # Agregar detalles
        for item in data['items']:
            if not all(k in item for k in ['producto', 'cantidad', 'precio']):
                return jsonify({"error": "Cada item debe tener producto, cantidad y precio"}), 400

            detail = OrderDetail(
                order_id=order.id,
                product_name=item['producto'],
                quantity=item['cantidad'],
                unit_price=item['precio']
            )
            db.session.add(detail)

        db.session.commit()
        return jsonify({"msg": "Orden creada exitosamente", "order_id": order.id}), 201

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Error al crear la orden"}), 500


@api.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404

        db.session.delete(order)  # cascada con los detalles
        db.session.commit()
        return jsonify({"msg": "Orden eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Error al eliminar la orden"}), 500


@api.route('/orders/<int:id>', methods=['PUT'])
def update_order_status(id):
    data = request.get_json()

    if "status" not in data:
        return jsonify({"error": "Debe especificar el nuevo estado"}), 400

    if data["status"] not in [e.value for e in order_status]:
        return jsonify({"error": "Estado inválido"}), 400

    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Orden no encontrada"}), 404

        order.status = order_status(data["status"])
        db.session.commit()
        return jsonify({"msg": "Estado actualizado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error": "Error al actualizar el estado"}), 500


@api.route('/productos', methods=['GET'])
def get_productos():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        tipo = request.args.get("tipo", "").upper()  # "COMIDA", "BEBIDA" o ""

        productos = []

        if tipo in ["", "COMIDA"]:
            stmt_dishes = select(Dishes).where(Dishes.is_active == True)
            dishes = db.session.scalars(stmt_dishes).all()
            for dish in dishes:
                data = dish.serialize()
                data["id"] = f"dish-{data['id']}"
                data["tipo"] = "COMIDA"
                productos.append(data)

        if tipo in ["", "BEBIDA"]:
            stmt_drinks = select(Drinks).where(Drinks.is_active == True)
            drinks = db.session.scalars(stmt_drinks).all()
            for drink in drinks:
                data = drink.serialize()
                data["id"] = f"drink-{data['id']}"
                data["tipo"] = "BEBIDA"
                productos.append(data)

        # Total y paginación
        total = len(productos)
        pages = (total + per_page - 1) // per_page
        start = (page - 1) * per_page
        end = start + per_page
        paginated = productos[start:end]

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": pages,
            "items": paginated
        }), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Error al obtener los productos"}), 500

@api.route('/productos', methods=['POST'])
def crear_producto():
    try:
        data = request.get_json()

        tipo = data.get("tipo")
        if tipo not in ["COMIDA", "BEBIDA"]:
            return jsonify({"error": "El campo 'tipo' debe ser 'COMIDA' o 'BEBIDA'"}), 400

        if tipo == "COMIDA":
            nuevo = Dishes(
                name=data["name"],
                description=data["description"],
                url_img=data.get("url_img", ""),
                price=data["price"],
                type=dish_type[data["type"]],
                is_active=data.get("is_active", True)
            )
        else:
            nuevo = Drinks(
                name=data["name"],
                description=data["description"],
                url_img=data.get("url_img", ""),
                price=data["price"],
                type=drink_type[data["type"]],
                is_active=data.get("is_active", True)
            )

        db.session.add(nuevo)
        db.session.commit()
        return jsonify({"msg": f"{tipo} creada correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        print("Error al crear producto:", e)
        return jsonify({"error": "Error al crear el producto"}), 500
    
@api.route('/productos/<string:tipo>/<int:id>', methods=['PUT'])
def actualizar_producto(tipo, id):
    try:
        data = request.get_json()
        tipo = tipo.upper()

        if tipo == "COMIDA":
            producto = db.session.get(Dishes, id)
            enum_type = dish_type
        elif tipo == "BEBIDA":
            producto = db.session.get(Drinks, id)
            enum_type = drink_type
        else:
            return jsonify({"error": "Tipo inválido"}), 400

        if not producto:
            return jsonify({"error": f"{tipo} no encontrada"}), 404

        producto.name = data.get("name", producto.name)
        producto.description = data.get("description", producto.description)
        producto.url_img = data.get("url_img", producto.url_img)
        producto.price = data.get("price", producto.price)
        producto.type = enum_type[data["type"]] if "type" in data else producto.type
        producto.is_active = data.get("is_active", producto.is_active)

        db.session.commit()
        return jsonify({"msg": f"{tipo} actualizada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar producto:", e)
        return jsonify({"error": "Error al actualizar el producto"}), 500

@api.route('/productos/<string:tipo>/<int:id>', methods=['DELETE'])
def eliminar_producto(tipo, id):
    try:
        tipo = tipo.upper()
        if tipo == "COMIDA":
            producto = db.session.get(Dishes, id)
        elif tipo == "BEBIDA":
            producto = db.session.get(Drinks, id)
        else:
            return jsonify({"error": "Tipo inválido"}), 400

        if not producto:
            return jsonify({"error": f"{tipo} no encontrada"}), 404

        db.session.delete(producto)
        db.session.commit()
        return jsonify({"msg": f"{tipo} eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al eliminar producto:", e)
        return jsonify({"error": "Error al eliminar el producto"}), 500


@api.route('/mis-ordenes', methods=['GET'])
@jwt_required()
def mis_ordenes():
    try:
        user_email = get_jwt_identity()
        stmt_user = select(User).where(User.email == user_email)
        user = db.session.scalars(stmt_user).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Obtener parámetros de paginación
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        # Total de órdenes para ese usuario
        total_stmt = select(func.count()).select_from(Order).where(Order.user_id == user.id)
        total = db.session.scalar(total_stmt)

        # Paginación con offset y limit
        stmt_orders = (
            select(Order)
            .options(joinedload(Order.details))
            .where(Order.user_id == user.id)
            .order_by(Order.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )

        orders = db.session.execute(stmt_orders).unique().scalars().all()

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": [order.serialize() for order in orders]
        }), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Error al obtener las órdenes del usuario"}), 500

# Cocina
@api.route('/cocina/ordenes', methods=['GET'])
def get_ordenes_para_cocina():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))
        search = request.args.get("search", "").strip()
        status_filter = request.args.get("status", "").strip().upper()

        stmt = select(Order)

        # Filtro por estado (opcional)
        if status_filter:
            if status_filter in order_status.__members__:
                stmt = stmt.where(Order.status == order_status[status_filter])
            else:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[e.name for e in order_status]}"
                }), 400
        else:
            # Por defecto solo muestra las que están "En proceso"
            stmt = stmt.where(Order.status == order_status.EN_PROCESO)

        # Filtro por búsqueda de código de orden
        if search:
            stmt = stmt.where(Order.order_code.ilike(f"%{search}%"))

        # Total con filtros
        total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))

        # Paginación
        stmt = stmt.order_by(Order.created_at.asc()).offset((page - 1) * per_page).limit(per_page)

        ordenes = db.session.scalars(stmt).all()

        return jsonify({
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": (total + per_page - 1) // per_page,
            "items": [orden.serialize() for orden in ordenes]
        }), 200

    except Exception as e:
        print("Error al obtener órdenes para cocina:", e)
        return jsonify({"error": "Error al obtener las órdenes"}), 500
    
# Cambia estado de una orden (rol cocinero)
@api.route('/cocina/ordenes/<int:id>', methods=['PUT'])
def actualizar_estado_orden(id):
    try:
        data = request.get_json()
        nuevo_estado = data.get("status")

        if not nuevo_estado:
            return jsonify({"error": "Debe especificar un estado"}), 400

        estado_normalizado = nuevo_estado.upper()
        if estado_normalizado not in order_status.__members__:
            return jsonify({
                "error": f"Estado inválido. Usa uno de: {[e.name for e in order_status]}"
            }), 400

        orden = db.session.get(Order, id)
        if not orden:
            return jsonify({"error": "Orden no encontrada"}), 404

        orden.status = order_status[estado_normalizado]
        db.session.commit()
        return jsonify({"msg": "Estado de la orden actualizado correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar estado de orden:", e)
        return jsonify({"error": "Error al actualizar estado"}), 500
