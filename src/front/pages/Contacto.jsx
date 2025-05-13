// Import necessary components from react-router-dom and other parts of the application.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleMapLocation } from "../components/GoogleMapLocation";
import { showError, showSuccess } from "../utils/toastUtils";

export function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/contacto', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        setErrorMessage(dataResponse.msg || "Error al enviar mensaje");
        return;
      }

      showSuccess("Mensaje enviado correctamente");
      setForm({ name: "", email: "", message: "" });
      setErrorMessage("");
    
    } catch (error) {
      console.error("Error en el envío:", error);
      setErrorMessage("Ocurrió un error al enviar el mensaje.");
      showError(errorMessage)
    }
  }


  return (
    <>
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-md-6">
            {/* Datos de Contacto del Restaurante */}
            <h2 className="d-flex mb-4 text-secondary-emphasis">CONTÁCTANOS</h2>
            <div className="col-md-10 mb-4">
              <p>Often merit stuff first oh up hills as he. Servants contempt as although addition dashwood is procured. Interest in yourself an do of numerous feelings cheerful confined.</p>
            </div>
            <div className="row">
              <div className="col">
                <div className="row pb-3">
                  <i className="fa-solid fa-map-location-dot text-danger fa-2x"></i>
                </div>
                <div className="row">
                  <p>570 8th Ave, New York, NY<br /> 10018 United States</p>
                </div>
                <div className="row pb-3 pt-4">
                  <i className="fa-solid fa-envelope-open text-danger fa-2x"></i>
                </div>
                <div className="row">
                  <p>info@yourdomain.com<br />admin@yourdomain.com</p>
                </div>
              </div>
              <div className="col">
                <div className="row pb-3">
                  <i className="fa-solid fa-clock text-danger fa-2x"></i>
                </div>
                <div className="row">
                  <p>Lunes a Domingo<br /> 8:00 am - 10:30 pm</p>
                </div>
                <div className="row pb-3 pt-4">
                  <i className="fa-solid fa-phone text-danger fa-2x"></i>
                </div>
                <div className="row">
                  <p>+123 456 7890<br />+123 456 9078</p>
                </div>
              </div>
            </div>
          </div>
          {/* Formulario de Contacto */}
          <div className="col-md-6">
            <h2 className="mb-5 text-secondary-emphasis">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Tu Nombre"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Tu Correo Electrónico"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <textarea
                  className="form-control"
                  name="message"
                  placeholder="Escribe Tu Mensaje Aquí"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-danger w-100">
                ENVIAR MENSAJE
              </button>
            </form>
          </div>



        </div>
      </div>

      {/* Google Maps */}
      <div className="full-width-map mt-5">
        <GoogleMapLocation/>
      </div>
    </>
  );
};

export default Contacto;
