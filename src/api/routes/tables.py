from flask import request, jsonify
from api.models import db, Table, table_status
from . import api

@api.route('/tables', methods=['POST', 'GET'])
def handle_table():
    if request.method == 'POST':
        data = request.get_json()
        try:
            # Validar status
            status_str = data.get("status", "LIBRE").upper()
            if status_str not in table_status.__members__:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[s.name for s in table_status]}"
                }), 400
            status_enum = table_status[status_str]

            # Crear mesa
            new_table = Table(
                number=data["number"],
                capacity=data["capacity"],
                status=status_enum
            )

            db.session.add(new_table)
            db.session.commit()

            return jsonify({
                "msg": "Mesa creada exitosamente",
                "table": new_table.serialize()
            }), 201

        except Exception as e:
            db.session.rollback()
            print("Error al crear mesa:", e)
            return jsonify({"error": str(e)}), 500

    if request.method == 'GET':
        try:
            tables = Table.query.all()
            return jsonify([table.serialize() for table in tables]), 200
        except Exception as e:
            print("Error al obtener mesas:", e)
            return jsonify({"error": str(e)}), 500

@api.route('/tables/<int:id>', methods=['PUT'])
def update_table(id):
    try:
        data = request.get_json()
        table = Table.query.get(id)

        if not table:
            return jsonify({"error": "Mesa no encontrada"}), 404

        if "number" in data:
            table.number = data["number"]
        if "capacity" in data:
            table.capacity = data["capacity"]
        if "status" in data:
            status_str = data["status"].upper()
            if status_str not in table_status.__members__:
                return jsonify({
                    "error": f"Estado inválido. Usa uno de: {[s.name for s in table_status]}"
                }), 400
            table.status = table_status[status_str]

        db.session.commit()
        return jsonify({"message": "Mesa actualizada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al actualizar la mesa:", e)
        return jsonify({"error": "Ocurrió un error al actualizar la mesa"}), 500

@api.route('/tables/<int:id>', methods=['DELETE'])
def delete_table(id):
    try:
        table = Table.query.get(id)

        if not table:
            return jsonify({"error": "Mesa no encontrada"}), 404

        db.session.delete(table)
        db.session.commit()

        return jsonify({"message": "Mesa eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error al eliminar la mesa:", e)
        return jsonify({"error": "Ocurrió un error al eliminar la mesa"}), 500 