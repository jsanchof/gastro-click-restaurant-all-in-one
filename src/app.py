"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, user_role, Dishes, dish_type, Drinks, drink_type
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import create_access_token, JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt


ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "da_secre_qi"
jwt = JWTManager(app)
CORS(app)
bcrypt = Bcrypt(app)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/register', methods=['POST'])
def handle_register():
    try:
        data = request.get_json(silent=True)

        name = data.get("name")
        last_name = data.get("last_name")
        phone_number = data.get("phone_number")
        email = data.get("email")
        password = data.get("password")
        role_str = (data.get("role") or "").upper()

        if not all([name, last_name, phone_number, email, password, role_str]):
            return jsonify({"msg": "Todos los campos son requeridos"}), 400

        existing_user = db.session.scalar(
            db.select(User).where(User.email == email))

        if existing_user:
            return jsonify({"msg": "El usuario ya existe"}), 409

        if not name or not last_name or not phone_number or not role_str:
            return jsonify({"msg": "Todos los campos son requeridos"}), 400

        valid_roles = [r.value for r in user_role]
        if role_str not in valid_roles:
            return jsonify({
                "msg": "Rol inválido",
                "valid_roles": valid_roles
            }), 400

        role = user_role(role_str)
        print(role)
        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(name=name, last_name=last_name, phone_number=phone_number,
                        email=email, password=password_hash, role=role, is_active=True)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"ok": True, "msg": "Register was successfull..."}), 201
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


@app.route('/login', methods=['POST'])
def handle_login():
    try:
        data = request.get_json(silent=True)
        print("Data del body", data)

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"msg": "Correo y contraseña requeridos"}), 400

        user = db.session.scalar(db.select(User).where(User.email == email))
        if not user:
            return jsonify({"msg": "El usuario no existe"}), 404

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"msg": "El correo o la contraseña son incorrectos"}), 401

        # after confirminh the details are valid, generate the token
        claims = {"role": "admin", "more details": "the details"}
        access_token = create_access_token(
            identity=str(email), additional_claims=claims)

        return jsonify({"ok": True, "msg": "Login was successfull...", "access_token": access_token}), 200
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


@app.route('/edit_user/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    try:
        data = request.get_json(silent=True)

        name = data.get("name")
        last_name = data.get("last_name")
        phone_number = data.get("phone_number")
        password = data.get("password")
        role_str = (data.get("role") or "").upper()

        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        if "email" in data:
            return jsonify({"msg": "No puedes actualizar el email"}), 400
        if name:
            user.name = name
        if last_name:
            user.last_name = last_name
        if phone_number:
            user.phone_number = phone_number
        if password:
            user.password = bcrypt.generate_password_hash(
                password).decode("utf-8")
        if role_str:
            valid_roles = [r.value for r in user_role]
            if role_str not in valid_roles:
                return jsonify({
                    "msg": "Rol inválido",
                    "valid_roles": valid_roles
                }), 400
            user.role = user_role(role_str)

        db.session.commit()

        return jsonify({"ok": True, "msg": "Usuario actualizado correctamente"}), 200

    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


@app.route('/delete/user', methods=['DELETE'])
def delete_user():
    try:
        data = request.get_json(silent=True)
        email = data.get("email")

        if not email:
            return jsonify({"msg": "El campo 'email' es requerido"}), 400

        user = db.session.scalar(db.select(User).where(User.email == email))

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"ok": True, "msg": f"Usuario con email {email} eliminado correctamente"}), 200

    except Exception as e:
        print("Error al eliminar usuario:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500

# Dishes endpoints


@app.route('/dishes', methods=['POST'])
def handle_add_dish():
    try:
        data = request.get_json(silent=True)

        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        type_str = (data.get("type") or "").upper()

        if not all([name, description, price, type_str]):
            return jsonify({"msg": "Todos los campos son requeridos"}), 400

        existing_dish = db.session.scalar(
            db.select(Dishes).where(Dishes.name == name))

        if existing_dish:
            return jsonify({"msg": "El platillo ya existe"}), 409

        valid_types = [r.value for r in dish_type]
        if type_str not in valid_types:
            return jsonify({
                "msg": "Tipo inválido",
                "valid_types": valid_types
            }), 400

        type = dish_type(type_str)

        new_dish = Dishes(name=name, description=description,
                          price=price, type=type, is_active=True)

        db.session.add(new_dish)
        db.session.commit()

        return jsonify({"ok": True, "msg": "Register dish was successfull..."}), 201
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


@app.route('/dishes', methods=['GET'])
def get_all_dishes():
    try:
        dishes = Dishes.query.all()
        dish_list = [dish.serialize() for dish in dishes]

        return jsonify(dish_list), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@app.route('/dishes/<int:dish_id>', methods=['GET'])
def get_dish_by_id(dish_id):
    try:
        dish = Dishes.query.get(dish_id)
        if dish is None:
            return jsonify({"error": "No se encontró el platillo"}), 404

        return jsonify(dish.serialize()), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@app.route('/dishes/<int:dish_id>', methods=['PUT'])
def update_dish(dish_id):
    try:
        dish = Dishes.query.get(dish_id)
        if not dish:
            return jsonify({"error": "No se encontró el platillo"}), 404

        data = request.get_json()

        if "name" in data:
            dish.name = data["name"]
        if "description" in data:
            dish.description = data["description"]
        if "price" in data:
            dish.price = data["price"]
        if "type" in data:
            dish.type = data["type"]

        db.session.commit()

        return jsonify(dish.serialize()), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500
    
@app.route('/dishes/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    try:
        dish = Dishes.query.get(dish_id)
        if not dish:
            return jsonify({"msg": "El platillo no fue encontrado"}), 404

        db.session.delete(dish)
        db.session.commit()

        return jsonify({"ok": True, "msg": "Platillo eliminado exitosamente"}), 200

    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


# Drinks endpoints
@app.route('/drinks', methods=['POST'])
def handle_add_drink():
    try:
        data = request.get_json(silent=True)

        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        type_str = (data.get("type") or "").upper()

        if not all([name, description, price, type_str]):
            return jsonify({"msg": "Todos los campos son requeridos"}), 400

        existing_drink = db.session.scalar(
            db.select(Drinks).where(Drinks.name == name))

        if existing_drink:
            return jsonify({"msg": "La bebida ya existe"}), 409

        valid_types = [t.value for t in drink_type]
        if type_str not in valid_types:
            return jsonify({
                "msg": "Tipo inválido",
                "valid_types": valid_types
            }), 400

        type = drink_type(type_str)

        new_drink = Drinks(name=name, description=description,
                           price=price, type=type, is_active=True)

        db.session.add(new_drink)
        db.session.commit()

        return jsonify({"ok": True, "msg": "Register drink was successfull..."}), 201
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


@app.route('/drinks', methods=['GET'])
def get_all_drinks():
    try:
        drinks = Drinks.query.all()
        drink_list = [drink.serialize() for drink in drinks]

        return jsonify(drink_list), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@app.route('/drinks/<int:drink_id>', methods=['GET'])
def get_drink_by_id(drink_id):
    try:
        drink = Drinks.query.get(drink_id)
        if drink is None:
            return jsonify({"error": "No se encontró la bebida"}), 404

        return jsonify(drink.serialize()), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


@app.route('/drinks/<int:dish_id>', methods=['PUT'])
def update_drink(drink_id):
    try:
        drink = Drinks.query.get(drink_id)
        if not drink:
            return jsonify({"error": "No se encontró la bebida."}), 404

        data = request.get_json()

        if "name" in data:
            drink.name = data["name"]
        if "description" in data:
            drink.description = data["description"]
        if "price" in data:
            drink.price = data["price"]
        if "type" in data:
            drink.type = data["type"]

        db.session.commit()

        return jsonify(drink.serialize()), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500
    
@app.route('/drinks/<int:drink_id>', methods=['DELETE'])
def delete_drink(drink_id):
    try:
        drink = Drinks.query.get(drink_id)
        if not drink:
            return jsonify({"error": "No se encontró la bebida"}), 404

        db.session.delete(drink)
        db.session.commit()

        return jsonify({"ok": True, "msg": "Bebida eliminada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
