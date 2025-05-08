from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, DateTime, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum
from sqlalchemy.sql import func
from datetime import datetime

db = SQLAlchemy()

class user_role(PyEnum):
  ADMIN = "ADMIN"
  CLIENTE = "CLIENTE"
  MESERO = "MESERO"
  COCINA = "COCINA"

class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False) 
    phone_number: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[user_role] = mapped_column(Enum(user_role, name="user_role_enum",native_enum=False), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "phone_number":self.phone_number,
            "email": self.email,
            # do not serialize the password, its a security breach
            "role": self.role.value,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.created_at.isoformat() if self.created_at else None
        }
    
#dishes enum and model
class dish_type(PyEnum):
  ENTRADA = "ENTRADA"
  PRINCIPAL = "PRINCIPAL"
  POSTRE = "POSTRE"

class Dishes(db.Model):
    __tablename__ = "dishes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(120), nullable=False) 
    url_img: Mapped[str] = mapped_column(String(200), nullable=False) 
    price: Mapped[float] = mapped_column(nullable=False)
    type: Mapped[dish_type] = mapped_column(Enum(dish_type, name="dish_type_enum",native_enum=False), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url_img": self.url_img,
            "price": self.price,
            "type": self.type.value,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.created_at.isoformat() if self.created_at else None
        }
    
#Drinks enum and model
class drink_type(PyEnum):
  GASEOSA = "GASEOSA"
  NATURAL = "NATURAL"
  CERVEZA = "CERVEZA"
  DESTILADOS = "DESTILADOS"

class Drinks(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(120), nullable=False)
    url_img: Mapped[str] = mapped_column(String(200), nullable=False)  
    price: Mapped[float] = mapped_column(nullable=False)
    type: Mapped[drink_type] = mapped_column(Enum(drink_type, name="drink_type_enum",native_enum=False), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url_img": self.url_img,
            "price": self.price,
            "type": self.type.value,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.created_at.isoformat() if self.created_at else None
        }




# Reservation status
class reservation_status(PyEnum):
    PENDIENTE = "PENDIENTE"
    CONFIRMADA = "CONFIRMADA"
    CANCELADA = "CANCELADA"
    COMPLETADA = "COMPLETADA"

class Reservation(db.Model):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    guest_name: Mapped[str] = mapped_column(String(120), nullable=False)
    guest_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    table_id: Mapped[int] = mapped_column(ForeignKey("tables.id"), nullable=True)
    status: Mapped[reservation_status] = mapped_column(Enum(reservation_status), default=reservation_status.PENDIENTE)
    start_date_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    additional_details: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(), default=func.now(), server_default=func.now(), nullable=False)

    # Relaciones opcionales
    # user = relationship("User", backref="reservations")
    # table = relationship("Table", backref="reservations")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "guest_name": self.guest_name,
            "guest_phone": self.guest_phone,
            "quantity": self.quantity,
            "table_id": self.table_id,
            "status": self.status.value,
            "start_date_time": self.start_date_time.isoformat(),
            "additional_details": self.additional_details,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
    
class Table(db.Model):
    __tablename__ = "tables"

    id: Mapped[int] = mapped_column(primary_key=True)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    chairs: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[reservation_status] = mapped_column(Enum(reservation_status), default=reservation_status.PENDIENTE)

    def serialize(self):
        return {
            "id": self.id,
            "number": self.number,
            "chairs": self.chairs,
            "status": self.status.value,
        }