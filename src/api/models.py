from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum as PyEnum
from sqlalchemy.sql import func

db = SQLAlchemy()

class user_role(PyEnum):
  ADMIN = "ADMIN"
  CLIENTE = "CLIENTE"
  MESERO = "MESERO"
  COCINA = "COCINA"

class User(db.Model):
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
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(120), nullable=False) 
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
            "price": self.price,
            "type": self.type.value,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.created_at.isoformat() if self.created_at else None
        }