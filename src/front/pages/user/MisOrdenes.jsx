import { useState, useEffect } from "react"

function MisOrdenes() {
    const [ordenes, setOrdenes] = useState([])
    const [busqueda, setBusqueda] = useState("")

    useEffect(() => {
        // Simulación de datos de órdenes
        const ordenesData = [
            {
                id: 1,
                ordenId: "456",
                fecha: "2023-05-01",
                total: 15.75,
                estado: "Completada",
                detalles: [
                    { producto: "Cerveza", cantidad: 2, precio: 1.5 },
                    { producto: "Hamburguesa", cantidad: 1, precio: 4.0 },
                    { producto: "Papas Fritas", cantidad: 1, precio: 2.0 },
                ],
            },
            {
                id: 2,
                ordenId: "457",
                fecha: "2023-05-02",
                total: 22.5,
                estado: "En proceso",
                detalles: [
                    { producto: "Pizza", cantidad: 1, precio: 5.5 },
                    { producto: "Refresco", cantidad: 2, precio: 1.25 },
                    { producto: "Helado", cantidad: 1, precio: 2.75 },
                ],
            },
            {
                id: 3,
                ordenId: "458",
                fecha: "2023-05-03",
                total: 18.25,
                estado: "Completada",
                detalles: [
                    { producto: "Ensalada", cantidad: 1, precio: 3.5 },
                    { producto: "Snack", cantidad: 2, precio: 2.5 },
                    { producto: "Agua", cantidad: 1, precio: 1.0 },
                ],
            },
            {
                id: 4,
                ordenId: "459",
                fecha: "2023-05-04",
                total: 12.75,
                estado: "Cancelada",
                detalles: [
                    { producto: "Café", cantidad: 2, precio: 1.75 },
                    { producto: "Snack", cantidad: 1, precio: 2.5 },
                ],
            },
            {
                id: 5,
                ordenId: "460",
                fecha: "2023-05-05",
                total: 28.5,
                estado: "Completada",
                detalles: [
                    { producto: "Hamburguesa", cantidad: 2, precio: 4.0 },
                    { producto: "Refresco", cantidad: 2, precio: 1.25 },
                    { producto: "Papas Fritas", cantidad: 2, precio: 2.0 },
                ],
            },
        ]

        setOrdenes(ordenesData)
    }, [])

    const verDetalles = (id) => {
        alert(`Ver detalles de la orden ${id}`)
    }

    const ordenesFiltered = ordenes.filter(
        (orden) => orden.ordenId.includes(busqueda) || orden.estado.toLowerCase().includes(busqueda.toLowerCase()),
    )

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-8">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por ID o estado..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-info w-100">Filtrar</button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-info">
                                <tr>
                                    <th>#ID</th>
                                    <th>Orden ID</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenesFiltered.map((orden) => (
                                    <tr key={orden.id}>
                                        <td>{orden.id}</td>
                                        <td>{orden.ordenId}</td>
                                        <td>{orden.fecha}</td>
                                        <td>${orden.total.toFixed(2)}</td>
                                        <td>
                                            <span
                                                className={`badge ${orden.estado === "Completada"
                                                        ? "bg-success"
                                                        : orden.estado === "En proceso"
                                                            ? "bg-warning"
                                                            : "bg-danger"
                                                    }`}
                                            >
                                                {orden.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-warning" onClick={() => verDetalles(orden.ordenId)}>
                                                Ver detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {ordenesFiltered.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-muted">No se encontraron órdenes</p>
                        </div>
                    )}

                    <div className="d-flex justify-content-center mt-3">
                        <nav>
                            <ul className="pagination">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" tabIndex="-1">
                                        Anterior
                                    </a>
                                </li>
                                <li className="page-item active">
                                    <a className="page-link" href="#">
                                        1
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        2
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        3
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        Siguiente
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MisOrdenes