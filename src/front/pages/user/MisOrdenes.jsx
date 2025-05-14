import { useState, useEffect } from "react"
import { Search, Eye, Filter } from 'lucide-react'

function MisOrdenes() {
    // Estado para almacenar las órdenes
    const [ordenes, setOrdenes] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [ordenDetalle, setOrdenDetalle] = useState(null)
    
    // Estados para filtros
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    
    // Estados para paginación desde el backend
    const [paginaActual, setPaginaActual] = useState(1)
    const [elementosPorPagina, setElementosPorPagina] = useState(10)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [totalElementos, setTotalElementos] = useState(0)

    // Función para cargar órdenes desde el backend
    const fetchOrdenes = async (pagina = 1, porPagina = 10, estado = "todos", buscar = "") => {
        try {
            setLoading(true)
            setError(null)
            
            // Obtener el token de autenticación
            const token = sessionStorage.getItem("access_token")
            
            if (!token) {
                throw new Error("No se encontró token de autenticación")
            }
            
            // Construir URL con parámetros de paginación y filtros
            let url = `${import.meta.env.VITE_BACKEND_URL}/api/mis-ordenes?page=${pagina}&per_page=${porPagina}`
            
            // Añadir filtro de estado si no es "todos"
            if (estado !== "todos") {
                url += `&estado=${estado}`
            }
            
            // Añadir búsqueda si existe
            if (buscar.trim() !== "") {
                url += `&search=${encodeURIComponent(buscar)}`
            }
            
            // Realizar la petición al endpoint
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`Error al cargar órdenes: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Actualizar estados con la respuesta del backend
            setOrdenes(data.items || [])
            setPaginaActual(data.page)
            setTotalPaginas(data.pages)
            setElementosPorPagina(data.per_page)
            setTotalElementos(data.total)
            
        } catch (err) {
            console.error("Error al cargar órdenes:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Cargar órdenes al montar el componente
    useEffect(() => {
        fetchOrdenes(paginaActual, elementosPorPagina, filtroEstado, busqueda)
    }, [])

    const verDetalles = (orden) => {
        setOrdenDetalle(orden)
    }

    const cerrarDetalles = () => {
        setOrdenDetalle(null)
    }
    
    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros)
    }
    
    const aplicarFiltros = () => {
        // Resetear a la primera página cuando se aplican filtros
        fetchOrdenes(1, elementosPorPagina, filtroEstado, busqueda)
    }
    
    const limpiarFiltros = () => {
        setBusqueda("")
        setFiltroEstado("todos")
        // Cargar la primera página sin filtros
        fetchOrdenes(1, elementosPorPagina, "todos", "")
    }
    
    // Funciones para la paginación
    const irAPagina = (numeroPagina) => {
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            fetchOrdenes(numeroPagina, elementosPorPagina, filtroEstado, busqueda)
        }
    }
    
    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            fetchOrdenes(paginaActual - 1, elementosPorPagina, filtroEstado, busqueda)
        }
    }
    
    const irAPaginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            fetchOrdenes(paginaActual + 1, elementosPorPagina, filtroEstado, busqueda)
        }
    }
    
    // Manejar cambio en elementos por página
    const cambiarElementosPorPagina = (nuevaCantidad) => {
        setElementosPorPagina(nuevaCantidad)
        fetchOrdenes(1, nuevaCantidad, filtroEstado, busqueda)
    }
    
    // Generar números de página para mostrar
    const generarNumerosPagina = () => {
        const paginas = []
        const maxPaginasMostradas = 5
        
        let paginaInicial = Math.max(1, paginaActual - Math.floor(maxPaginasMostradas / 2))
        let paginaFinal = Math.min(totalPaginas, paginaInicial + maxPaginasMostradas - 1)
        
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

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h4 className="card-title mb-4">Mis Órdenes</h4>
                    
                    <div className="row mb-3">
                        <div className="col-md-8">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <Search size={18} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por ID, estado o cliente..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button 
                                className="btn w-100" 
                                style={{ backgroundColor: "#27a745", color: "white" }}
                                onClick={toggleFiltros}
                            >
                                <Filter size={18} className="me-2" />
                                Filtros
                            </button>
                        </div>
                    </div>
                    
                    {/* Panel de filtros */}
                    {mostrarFiltros && (
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-3">Filtrar por estado:</h6>
                                <div className="btn-group w-100 mb-3">
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
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Elementos por página:</label>
                                        <select 
                                            className="form-select" 
                                            value={elementosPorPagina}
                                            onChange={(e) => cambiarElementosPorPagina(Number(e.target.value))}
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={limpiarFiltros}
                                    >
                                        Limpiar filtros
                                    </button>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={aplicarFiltros}
                                    >
                                        Aplicar filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

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
                                            <td>{orden.cliente || "N/A"}</td>
                                            <td>${orden.total.toFixed(2)}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        orden.estado === "Completada"
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
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => verDetalles(orden)}
                                                >
                                                    <Eye size={16} className="me-1" />
                                                    Ver detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!loading && ordenes.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-muted">No se encontraron órdenes</p>
                        </div>
                    )}

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
                                    <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={irAPaginaAnterior}
                                            disabled={paginaActual === 1}
                                        >
                                            Anterior
                                        </button>
                                    </li>
                                    
                                    {generarNumerosPagina().map(numeroPagina => (
                                        <li 
                                            key={numeroPagina} 
                                            className={`page-item ${paginaActual === numeroPagina ? 'active' : ''}`}
                                        >
                                            <button 
                                                className="page-link" 
                                                onClick={() => irAPagina(numeroPagina)}
                                            >
                                                {numeroPagina}
                                            </button>
                                        </li>
                                    ))}
                                    
                                    <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={irAPaginaSiguiente}
                                            disabled={paginaActual === totalPaginas}
                                        >
                                            Siguiente
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para ver detalles de la orden */}
            {ordenDetalle && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Detalles de la Orden #{ordenDetalle.ordenId}</h5>
                                <button type="button" className="btn-close" onClick={cerrarDetalles}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Cliente:</strong> {ordenDetalle.cliente || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Fecha:</strong> {ordenDetalle.fecha}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p>
                                            <strong>Estado:</strong>{" "}
                                            <span
                                                className={`badge ${
                                                    ordenDetalle.estado === "Completada"
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
                                        {ordenDetalle.detalles && ordenDetalle.detalles.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.producto}</td>
                                                <td>{detalle.cantidad}</td>
                                                <td>${detalle.precio.toFixed(2)}</td>
                                                <td>${detalle.subtotal ? detalle.subtotal.toFixed(2) : (detalle.cantidad * detalle.precio).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
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
                                <button type="button" className="btn btn-secondary" onClick={cerrarDetalles}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MisOrdenes