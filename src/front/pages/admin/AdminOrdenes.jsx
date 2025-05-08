import { useState, useEffect } from "react"
import { Search, Eye, Trash2, CheckCircle, XCircle } from "lucide-react"

function AdminOrdenes() {
    const [ordenes, setOrdenes] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [ordenDetalle, setOrdenDetalle] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        // Simulación de datos de órdenes
        const ordenesData = [
            {
                id: 1,
                ordenId: "456",
                fecha: "2023-05-01",
                cliente: "Juan Pérez",
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
                cliente: "María López",
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
                cliente: "Carlos Ruiz",
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
                cliente: "Ana Martínez",
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
                cliente: "Roberto Gómez",
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

    const handleVerDetalle = (orden) => {
        setOrdenDetalle(orden)
    }

    const handleDeleteConfirm = (ordenId) => {
        setConfirmDelete(ordenId)
    }

    const handleDeleteOrden = () => {
        if (confirmDelete) {
            setOrdenes(ordenes.filter((orden) => orden.id !== confirmDelete))
            setConfirmDelete(null)
        }
    }

    const handleCambiarEstado = (id, nuevoEstado) => {
        setOrdenes(ordenes.map((orden) => (orden.id === id ? { ...orden, estado: nuevoEstado } : orden)))
    }

    const filteredOrdenes = ordenes.filter(
        (orden) =>
            (filtroEstado === "todos" || orden.estado === filtroEstado) &&
            (orden.ordenId.includes(searchTerm) || orden.cliente.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="card-title mb-0">Gestión de Órdenes</h4>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <Search size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por ID o cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="btn-group w-100">
                                <button
                                    className={`btn ${filtroEstado === "todos" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => setFiltroEstado("todos")}
                                >
                                    Todos
                                </button>
                                <button
                                    className={`btn ${filtroEstado === "En proceso" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => setFiltroEstado("En proceso")}
                                >
                                    En proceso
                                </button>
                                <button
                                    className={`btn ${filtroEstado === "Completada" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => setFiltroEstado("Completada")}
                                >
                                    Completada
                                </button>
                                <button
                                    className={`btn ${filtroEstado === "Cancelada" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => setFiltroEstado("Cancelada")}
                                >
                                    Cancelada
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>#ID</th>
                                    <th>Orden ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrdenes.map((orden) => (
                                    <tr key={orden.id}>
                                        <td>{orden.id}</td>
                                        <td>{orden.ordenId}</td>
                                        <td>{orden.fecha}</td>
                                        <td>{orden.cliente}</td>
                                        <td>${orden.total.toFixed(2)}</td>
                                        <td>
                                            <span
                                                className={`badge ${orden.estado === "Completada"
                                                        ? "bg-success px-3"
                                                        : orden.estado === "En proceso"
                                                            ? "bg-warning px-3"
                                                            : "bg-danger px-3"
                                                    } rounded-pill`}
                                            >
                                                {orden.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleVerDetalle(orden)}
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {orden.estado === "En proceso" && (
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => handleCambiarEstado(orden.id, "Completada")}
                                                        title="Marcar como completada"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {orden.estado === "En proceso" && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCambiarEstado(orden.id, "Cancelada")}
                                                        title="Cancelar orden"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteConfirm(orden.id)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredOrdenes.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-3">
                                            No se encontraron órdenes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
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

            {ordenDetalle && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Detalles de la Orden #{ordenDetalle.ordenId}</h5>
                                <button type="button" className="btn-close" onClick={() => setOrdenDetalle(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Cliente:</strong> {ordenDetalle.cliente}
                                        </p>
                                        <p>
                                            <strong>Fecha:</strong> {ordenDetalle.fecha}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Estado:</strong>{" "}
                                            <span
                                                className={`badge ${ordenDetalle.estado === "Completada"
                                                        ? "bg-success"
                                                        : ordenDetalle.estado === "En proceso"
                                                            ? "bg-warning"
                                                            : "bg-danger"
                                                    }`}
                                            >
                                                {ordenDetalle.estado}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Total:</strong> ${ordenDetalle.total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <h6 className="mb-3">Productos:</h6>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordenDetalle.detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.producto}</td>
                                                <td>{detalle.cantidad}</td>
                                                <td>${detalle.precio.toFixed(2)}</td>
                                                <td>${(detalle.cantidad * detalle.precio).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="text-end">
                                                <strong>Subtotal:</strong>
                                            </td>
                                            <td>
                                                ${ordenDetalle.detalles.reduce((sum, item) => sum + item.cantidad * item.precio, 0).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end">
                                                <strong>IVA (15%):</strong>
                                            </td>
                                            <td>
                                                $
                                                {(
                                                    ordenDetalle.detalles.reduce((sum, item) => sum + item.cantidad * item.precio, 0) * 0.15
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end">
                                                <strong>Total:</strong>
                                            </td>
                                            <td>${ordenDetalle.total.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setOrdenDetalle(null)}>
                                    Cerrar
                                </button>
                                {ordenDetalle.estado === "En proceso" && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => {
                                                handleCambiarEstado(ordenDetalle.id, "Completada")
                                                setOrdenDetalle(null)
                                            }}
                                        >
                                            Marcar como Completada
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                handleCambiarEstado(ordenDetalle.id, "Cancelada")
                                                setOrdenDetalle(null)
                                            }}
                                        >
                                            Cancelar Orden
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar esta orden?</p>
                                <p className="text-danger">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteOrden}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminOrdenes
