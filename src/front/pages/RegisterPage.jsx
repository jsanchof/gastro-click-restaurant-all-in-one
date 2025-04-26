import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL_BASE = "https://miniature-waffle-4jwxv49676rjcw9w-3001.app.github.dev";

  const RegistrarCuenta = async (e) => {
    e.preventDefault(); 

    try {
      if (!name || !last_name || !phone_number || !email || !password) {
        alert("¡Todos los campos deben ser llenados!");
        return;
      }

      const cuenta = {
        name,
        last_name,
        phone_number,
        email,
        password,
        role: "CLIENTE",
      };

      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuenta),
      });

      if (response.ok) {
        alert("¡Cuenta registrada con éxito!");
      } else {
        alert("Error al registrar la cuenta.");
      }
    } catch (error) {
      console.log(error);
      alert("Hubo un error al procesar la solicitud.");
    }
  };

  return (
    <form className="row justify-content-center p-4" onSubmit={RegistrarCuenta}>
      <div className="col-md-6">
        <h1 className="text-center mb-5">Creación de cuenta</h1>

        <div className="row">
          <div className="col-6">
            <div className="mb-5">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                id="inputName"
                style={{ borderRadius: "0" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="mb-5">
              <input
                type="text"
                className="form-control"
                placeholder="Apellido"
                id="inputLastName"
                style={{ borderRadius: "0" }}
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <input
            type="text"
            className="form-control"
            placeholder="Número de Teléfono"
            id="inputPhone"
            style={{ borderRadius: "0" }}
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            id="inputEmail"
            style={{ borderRadius: "0" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            id="inputPassword"
            style={{ borderRadius: "0" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary w-50">
            Crear cuenta
          </button>
        </div>
      </div>
    </form>
  );
};