import React from "react"

function ProductCard({ producto, onAgregar }) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={producto.imagen || "https://picsum.photos/200/300"}
        className="card-img-top p-2"
        alt={producto.nombre}
        style={{ height: "150px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text text-primary fw-bold">${producto.precio.toFixed(2)}</p>
      </div>
      <div className="card-footer bg-white border-top-0">
        <button className="btn btn-outline-primary w-100" onClick={onAgregar}>
          <i className="bi bi-plus-circle me-2"></i>
          Agregar
        </button>
      </div>
    </div>
  )
}

export default ProductCard