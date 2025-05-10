"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Reservation, Table, reservation_status, table_status
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

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
            new_reservation = Reservation(
                user_id=data.get("user_id"),
                guest_name=data["guest_name"],
                guest_phone=data["guest_phone"],
                email=data["email"],
                quantity=data["quantity"],
                table_id=data.get("table_id"),
                start_date_time=datetime.strptime(
                    data["start_date_time"], "%Y-%m-%d %H:%M:%S"),
                additional_details=data.get("additional_details")
            )

            db.session.add(new_reservation)
            db.session.commit()

            return jsonify({"msg": "Reservación creada exitosamente", "reservation_id": new_reservation.id}), 201

        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({"error": str(e)}), 500

    if request.method == 'GET':
        try:
            reservations = Reservation.query.all()
            result = list(map(lambda x: x.serialize(), reservations))
            return jsonify(result), 200

        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500

# Actualiza una reserva existente


@api.route('/reservations/<int:id>', methods=['PUT'])
def update_reservation(id):
    data = request.get_json()

    reserva = Reservation.query.get(id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    reserva.guest_name = data.get('guest_name')
    reserva.email = data.get('email')
    reserva.guest_phone = data.get('guest_phone')
    reserva.quantity = data.get('quantity')

    if data.get('start_date_time'):
        reserva.start_date_time = datetime.strptime(
            data.get('start_date_time'), "%Y-%m-%d %H:%M:%S")

    reserva.additional_details = data.get('additional_details')

    db.session.commit()

    return jsonify({"message": "Reserva actualizada correctamente"})


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
