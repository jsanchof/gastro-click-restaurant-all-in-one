import { useState, useEffect } from "react"
import { Search, Eye, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react'

function AdminOrdenes() {
    const [ordenes, setOrdenes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("")
    const [ordenDetalle, setOrdenDetalle] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    // Estados para paginación desde el backend
    const [paginaActual, setPaginaActual] = useState(1)
    const [elementosPorPagina, setElementosPorPagina] = useState(10)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [totalElementos, setTotalElementos] = useState(0)

    const fetchOrdenes = async (pagina = 1, porPagina = 10, buscar = "", estado = "") => {
        try {
            setLoading(true)
            const token = sessionStorage.getItem('access_token')
            
            // Construir URL con parámetros de paginación y filtros
            let url = `${import.meta.env.VITE_BACKEND_URL}/api/orders?page=${pagina}&per_page=${porPagina}`
            
            // Añadir búsqueda si existe
            if (buscar.trim() !== "") {
                url += `&search=${encodeURIComponent(buscar)}`
            }
            
            // Añadir filtro de estado si existe
            if (estado !== "") {
                url += `&status=${estado}`
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Error al cargar las órdenes')
            }

            const data = await response.json()
            
            // Actualizar estados con la respuesta del backend
            setOrdenes(data.items || [])
            setPaginaActual(data.page || 1)
            setTotalPaginas(data.pages || 1)
            setElementosPorPagina(data.per_page || 10)
            setTotalElementos(data.total || 0)
            setError(null)
        } catch (err) {
            setError(err.message)
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrdenes(paginaActual, elementosPorPagina, searchTerm, filtroEstado)
    }, [])

    const handleVerDetalle = (orden) => {
        // Asegurarse de que la orden tenga la propiedad detalles
        if (!orden.detalles) {
            // Si no tiene detalles, crear un array vacío para evitar errores
            setOrdenDetalle({...orden, detalles: []})
        } else {
            setOrdenDetalle(orden)
        }
    }

    const handleDeleteConfirm = (ordenId) => {
        setConfirmDelete(ordenId)
    }

    const handleDeleteOrden = async () => {
        if (confirmDelete) {
            try {
                setLoading(true)
                const token = sessionStorage.getItem('access_token')
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${confirmDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    throw new Error('Error al eliminar la orden')
                }

                // Mostrar mensaje de éxito
                setSuccessMessage("Orden eliminada correctamente")
                setTimeout(() => setSuccessMessage(null), 3000)
                
                // Recargar las órdenes
                await fetchOrdenes(paginaActual, elementosPorPagina, searchTerm, filtroEstado)
                setConfirmDelete(null)
            } catch (err) {
                setError(err.message)
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            setLoading(true)
            const token = sessionStorage.getItem('access_token')
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: nuevoEstado })
            })

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la orden')
            }

            // Mostrar mensaje de éxito
            setSuccessMessage(`Estado actualizado a ${nuevoEstado}`)
            setTimeout(() => setSuccessMessage(null), 3000)
            
            // Recargar las órdenes
            await fetchOrdenes(paginaActual, elementosPorPagina, searchTerm, filtroEstado)
            
            // Si estamos viendo los detalles de esta orden, actualizar el estado en el modal
            if (ordenDetalle && ordenDetalle.id === id) {
                setOrdenDetalle({...ordenDetalle, estado: nuevoEstado})
            }
        } catch (err) {
            setError(err.message)
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Funciones para la paginación
    const irAPagina = (numeroPagina) => {
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            fetchOrdenes(numeroPagina, elementosPorPagina, searchTerm, filtroEstado)
        }
    }

    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            fetchOrdenes(paginaActual - 1, elementosPorPagina, searchTerm, filtroEstado)
        }
    }

    const irAPaginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            fetchOrdenes(paginaActual + 1, elementosPorPagina, searchTerm, filtroEstado)
        }
    }

    const cambiarElementosPorPagina = (nuevaCantidad) => {
        setElementosPorPagina(nuevaCantidad)
        fetchOrdenes(1, nuevaCantidad, searchTerm, filtroEstado)
    }

    // Generar números de página para mostrar
    const generarNumerosPagina = () => {
        const paginas = []
        const maxPaginasMostradas = 5

        let paginaInicial = Math.max(1, paginaActual - Math.floor(maxPaginasMostradas / 2))
        const paginaFinal = Math.min(totalPaginas, paginaInicial + maxPaginasMostradas - 1)

        // Ajustar si estamos cerca del final
        if (paginaFinal - paginaInicial + 1 < maxPaginasMostradas) {
            paginaInicial = Math.max(1, paginaFinal - maxPaginasMostradas + 1)
        }

        for (let i = paginaInicial; i <= paginaFinal; i++) {
            paginas.push(i)
        }

        return paginas
    }

    // Calcular índices para mostrar información de paginación
    const indiceInicial = (paginaActual - 1) * elementosPorPagina + 1
    const indiceFinal = Math.min(indiceInicial + elementosPorPagina - 1, totalElementos)

    // Buscar órdenes
    const buscarOrdenes = () => {
        fetchOrdenes(1, elementosPorPagina, searchTerm, filtroEstado)
    }

    // Aplicar filtro de estado
    const aplicarFiltroEstado = (estado) => {
        setFiltroEstado(estado)
        fetchOrdenes(1, elementosPorPagina, searchTerm, estado)
    }

    // Calcular el total con IVA para el modal de detalles
    const calcularTotalConIVA = (detalles) => {
        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return 0
        }
        const subtotal = detalles.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
        const iva = subtotal * 0.15
        return subtotal + iva
    }

    // Calcular subtotal para el modal de detalles
    const calcularSubtotal = (detalles) => {
        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            return 0
        }
        return detalles.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
    }

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="card-title mb-0">Gestión de Órdenes</h4>
                    </div>

                    {/* Mensajes de éxito */}
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {successMessage}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSuccessMessage(null)}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}

                    {/* Mensajes de error */}
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                        </div>
                    )}

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
                                    onKeyPress={(e) => e.key === "Enter" && buscarOrdenes()}
                                />
                                <button className="btn btn-outline-secondary" type="button" onClick={buscarOrdenes}>
                                    Buscar
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex gap-2 justify-content-end">
                                {/* Selector de elementos por página más compacto */}
                                <div style={{ width: "120px" }}>
                                    <select
                                        className="form-select form-select-sm"
                                        value={elementosPorPagina}
                                        onChange={(e) => cambiarElementosPorPagina(Number(e.target.value))}
                                        aria-label="Elementos por página"
                                    >
                                        <option value="5">5 por página</option>
                                        <option value="10">10 por página</option>
                                        <option value="25">25 por página</option>
                                        <option value="50">50 por página</option>
                                    </select>
                                </div>
                                <button
                                    className="btn btn-outline-primary"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFilters"
                                    aria-expanded="false"
                                    aria-controls="collapseFilters"
                                >
                                    <Filter size={18} className="me-1" />
                                    Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filtros colapsables */}
                    <div className="collapse mb-4" id="collapseFilters">
                        <div className="card card-body">
                            <div className="row">
                                <div className="col-12">
                                    <label className="form-label">Filtrar por estado</label>
                                    <div className="btn-group w-100">
                                        <button
                                            className={`btn ${filtroEstado === "" ? "btn-danger" : "btn-outline-danger"}`}
                                            onClick={() => aplicarFiltroEstado("")}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            className={`btn ${filtroEstado === "En proceso" ? "btn-danger" : "btn-outline-danger"}`}
                                            onClick={() => aplicarFiltroEstado("En proceso")}
                                        >
                                            En proceso
                                        </button>
                                        <button
                                            className={`btn ${filtroEstado === "Completada" ? "btn-danger" : "btn-outline-danger"}`}
                                            onClick={() => aplicarFiltroEstado("Completada")}
                                        >
                                            Completada
                                        </button>
                                        <button
                                            className={`btn ${filtroEstado === "Cancelada" ? "btn-danger" : "btn-outline-danger"}`}
                                            onClick={() => aplicarFiltroEstado("Cancelada")}
                                        >
                                            Cancelada
                                        </button>
                                    </div>
                                </div>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Cargando...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    ordenes.map((orden) => (
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
                                    ))
                                )}

                                {!loading && ordenes.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-3">
                                            No se encontraron órdenes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {!loading && totalElementos > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <span className="text-muted">
                                    Mostrando {indiceInicial} a {indiceFinal} de {totalElementos} órdenes
                                </span>
                            </div>
                            <nav>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={irAPaginaAnterior} disabled={paginaActual === 1}>
                                            Anterior
                                        </button>
                                    </li>

                                    {generarNumerosPagina().map((numeroPagina) => (
                                        <li key={numeroPagina} className={`page-item ${paginaActual === numeroPagina ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => irAPagina(numeroPagina)}>
                                                {numeroPagina}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={irAPaginaSiguiente} disabled={paginaActual === totalPaginas}>
                                            Siguiente
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
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
                                        {/* Verificar que detalles existe y es un array antes de usar map */}
                                        {ordenDetalle.detalles && Array.isArray(ordenDetalle.detalles) && ordenDetalle.detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.producto}</td>
                                                <td>{detalle.cantidad}</td>
                                                <td>${detalle.precio.toFixed(2)}</td>
                                                <td>${(detalle.cantidad * detalle.precio).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        
                                        {/* Mostrar mensaje si no hay detalles */}
                                        {(!ordenDetalle.detalles || !Array.isArray(ordenDetalle.detalles) || ordenDetalle.detalles.length === 0) && (
                                            <tr>
                                                <td colSpan="4" className="text-center">
                                                    No hay detalles disponibles para esta orden
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="text-end">
                                                <strong>Subtotal:</strong>
                                            </td>
                                            <td>
                                                ${calcularSubtotal(ordenDetalle.detalles).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end">
                                                <strong>IVA (15%):</strong>
                                            </td>
                                            <td>
                                                ${(calcularSubtotal(ordenDetalle.detalles) * 0.15).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end">
                                                <strong>Total:</strong>
                                            </td>
                                            <td>${calcularTotalConIVA(ordenDetalle.detalles).toFixed(2)}</td>
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
