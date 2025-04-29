import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Menu = () => {
  return (
    <div className="container py-3">
      <div className="row">
        <div 
          className="col-12 d-flex align-items-center" 
          style={{ background: "#d12525", height: "60px", borderRadius: "10px", color: "white", padding: "0 20px" }}
        >
          <h1 className="me-5" style={{ fontSize: "24px", margin: 0 }}>Menú</h1>
          <ul className="d-flex list-unstyled mb-0" style={{ gap: "30px" }}>
            <li><a href="#entradas" style={{ color: "white", textDecoration: "none" }}>Entradas</a></li>
            <li><a href="#principales" style={{ color: "white", textDecoration: "none" }}>Platillos principales</a></li>
            <li><a href="#postres" style={{ color: "white", textDecoration: "none" }}>Postres</a></li>
          </ul>
        </div>

        <div id="entradas" className="Entradas col-12 p-3">
          <h3>Entradas</h3>
        </div>
        <div id="principales" className="Principales col-12 p-3">
          <h3>Platillos principales</h3>
        </div>
        <div id="postres" className="Postres col-12 p-3">
          <h3>Postres</h3>
        </div>
      </div>
    </div>
  );
};