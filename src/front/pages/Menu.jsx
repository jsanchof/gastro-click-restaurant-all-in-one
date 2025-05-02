import React, { useEffect, useState } from "react";
import images from "../assets/images";

export const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);

  const GetDishes = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/dishes");

      if (!response.ok) {
        throw new Error("Ha ocurrido un error al obtener el menú");
      }

      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    GetDishes();
  }, []);

  const entradas = dishes.filter(dish => dish.type === "ENTRADA");
  const principales = dishes.filter(dish => dish.type === "PRINCIPAL");
  const postres = dishes.filter(dish => dish.type === "POSTRE");

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
          <div className="row">
            {entradas.map(dish => (
              <div key={dish.name} className="col-md-6 mb-4 d-flex" style={{ gap: "20px" }}>
                <img
                  src={images[dish.name] || "https://via.placeholder.com/200"} 
                  alt={dish.name}
                  style={{ height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div>
                  <h5 style={{ margin: 0 }}>{dish.name}</h5>
                  <p className="mb-1">{dish.description}</p>
                  <p className="text-muted">${dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="principales" className="Principales col-12 p-3">
          <h3>Platillos principales</h3>
          <div className="row">
            {principales.map(dish => (
              <div key={dish.name} className="col-md-6 mb-4 d-flex" style={{ gap: "20px" }}>
                <img
                  src={images[dish.name] || "https://via.placeholder.com/200"} 
                  alt={dish.name}
                  style={{ height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div>
                  <h5 style={{ margin: 0 }}>{dish.name}</h5>
                  <p className="mb-1">{dish.description}</p>
                  <p className="text-muted">${dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="postres" className="Postres col-12 p-3">
          <h3>Postres</h3>
          <div className="row">
            {postres.map(dish => (
              <div key={dish.id} className="col-md-6 mb-4 d-flex" style={{ gap: "20px" }}>
                <img
                  src={images[dish.name] || "https://via.placeholder.com/200"}
                  alt={dish.name}
                  style={{ height: "200px", width: "200px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div>
                  <h5 style={{ margin: 0 }}>{dish.name}</h5>
                  <p className="mb-1">{dish.description}</p>
                  <p className="text-muted">${dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};