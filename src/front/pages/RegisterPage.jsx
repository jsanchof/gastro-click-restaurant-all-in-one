import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const RegisterPage = () => {
  


  return (
    <form className="row justify-content-center p-4">
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
                style={{"borderRadius":"0"}}
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
                style={{"borderRadius":"0"}}
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
            style={{"borderRadius":"0"}}
          />
        </div>

        <div className="mb-5">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            id="inputEmail"
            style={{"borderRadius":"0"}}
          />
        </div>

        <div className="mb-5">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            id="inputPassword"
            style={{"borderRadius":"0"}}
          />
        </div>

        <div className="text-center">
          <button 
          type="submit" 
          className="btn btn-primary w-50">
            Crear cuenta
          </button>
        </div>
      </div>
    </form>
  );
};