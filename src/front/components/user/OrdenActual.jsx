import React from "react"

function OrdenActual({ items, paraLlevar, setParaLlevar, cambiarCantidad, eliminarProducto, crearOrden }) {
  const subtotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  const iva = subtotal * 0.15 // 15% de IVA
  const total = subtotal + iva

  return (
    <div className="card shadow-sm sticky-top" style={{ top: "1rem" }}>
      <div className="card-header bg-info-subtle">
        <h5 className="card-title mb-0">Orden</h5>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <p className="text-center text-muted">No hay productos en la orden</p>
        ) : (
          <ul className="list-group list-group-flush mb-3">
            {items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div className="d-flex align-items-center">
                  <button className="btn btn-sm btn-outline-danger me-2" onClick={() => eliminarProducto(item.id)}>
                  <i className="fa-solid fa-trash"></i>
                  </button>
                  <div>
                    <div className="fw-bold">{item.nombre}</div>
                    <div className="text-muted small">${item.precio.toFixed(2)}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="paraLlevar"
            checked={paraLlevar}
            onChange={(e) => setParaLlevar(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="paraLlevar">
            ¿Para llevar?
          </label>
        </div>

        <div className="border-top pt-3">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>IVA (15%)</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-success w-100" disabled={items.length === 0} onClick={crearOrden}>
          Crear Orden
        </button>
      </div>
    </div>
  )
}

export default OrdenActual