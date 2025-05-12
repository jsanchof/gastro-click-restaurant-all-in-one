import { useState, useEffect } from "react"
import { Search, Filter } from 'lucide-react'
import ProductCard from "../../components/user/ProductCard"
import OrdenActual from "../../components/user/OrdenActual"

function CrearOrden() {
    const [productos, setProductos] = useState([])
    const [ordenActual, setOrdenActual] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [paraLlevar, setParaLlevar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingProductos, setLoadingProductos] = useState(true)
    const [error, setError] = useState(null)
    
    // Estados para filtros
    const [filtroTipo, setFiltroTipo] = useState("todos")
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    
    // Estados para paginación desde el backend
    const [paginaActual, setPaginaActual] = useState(1)
    const [elementosPorPagina, setElementosPorPagina] = useState(10)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [totalElementos, setTotalElementos] = useState(0)

    const fetchProductos = async (pagina = 1, porPagina = 10, buscar = "", tipo = "todos") => {
        try {
            setLoadingProductos(true)
            setError(null)
            
            // Obtener el token de autenticación
            const token = sessionStorage.getItem("access_token")
            
            // Construir URL con parámetros de paginación y filtros
            let url = `${import.meta.env.VITE_BACKEND_URL}/api/productos?page=${pagina}&per_page=${porPagina}`
            
            // Añadir búsqueda si existe
            if (buscar.trim() !== "") {
                url += `&search=${encodeURIComponent(buscar)}`
            }
            
            // Añadir filtro de tipo si no es "todos"
            if (tipo !== "todos") {
                url += `&tipo=${tipo}`
            }
            
            // Realizar la petición al endpoint
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status}`)
            }
            
            const data = await response.json()
            
            // Filtrar solo productos activos y mapear a la estructura que usa el componente
            const productosFormateados = (data.items || [])
                .filter(producto => producto.is_active)
                .map(producto => ({
                    id: producto.id,
                    nombre: producto.name,
                    precio: producto.price,
                    imagen: producto.url_img,
                    descripcion: producto.description,
                    tipo: producto.tipo,
                    type: producto.type
                }))
            
            setProductos(productosFormateados)
            
            // Actualizar estados de paginación
            setPaginaActual(data.page || 1)
            setTotalPaginas(data.pages || 1)
            setElementosPorPagina(data.per_page || 10)
            setTotalElementos(data.total || 0)
            
        } catch (err) {
            console.error("Error al cargar productos:", err)
            setError(err.message)
        } finally {
            setLoadingProductos(false)
        }
    }

    useEffect(() => {
        fetchProductos(paginaActual, elementosPorPagina, busqueda, filtroTipo)
    }, [])

    const agregarProducto = (producto) => {
        const productoExistente = ordenActual.find((item) => item.id === producto.id)

        if (productoExistente) {
            setOrdenActual(
                ordenActual.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)),
            )
        } else {
            setOrdenActual([...ordenActual, { ...producto, cantidad: 1 }])
        }
    }

    const eliminarProducto = (id) => {
        setOrdenActual(ordenActual.filter((item) => item.id !== id))
    }

    const cambiarCantidad = (id, cantidad) => {
        if (cantidad <= 0) {
            eliminarProducto(id)
            return
        }

        setOrdenActual(ordenActual.map((item) => (item.id === id ? { ...item, cantidad } : item)))
    }

    const crearOrden = async () => {
        // Verificar si hay productos en la orden
        if (ordenActual.length === 0) {
            alert("No hay productos en la orden")
            return
        }

        try {
            setLoading(true)
            
            // 1. Generar código de orden único
            const orderCode = "ORD" + Date.now()
            
            // 2. Calcular el total de la orden
            const total = ordenActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
            
            // 3. Mapear productos al formato requerido
            const items = ordenActual.map(item => ({
                producto: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio
            }))
            
            // 4. Obtener token de autenticación
            const token = sessionStorage.getItem("access_token")
            
            // Extraer user_id del token (esto es opcional y depende de cómo esté estructurado tu token)
            // Si no puedes extraer el user_id del token, simplemente envía null
            let userId = null
            
            // 5. Preparar el cuerpo de la petición
            const orderData = {
                order_code: orderCode,
                user_id: userId,
                total: parseFloat(total.toFixed(2)),
                items: items,
                para_llevar: paraLlevar
            }
            
            // 6. Enviar la petición al backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            })
            
            // 7. Manejar la respuesta
            if (!response.ok) {
                throw new Error(`Error al crear la orden: ${response.status}`)
            }
            
            const data = await response.json()
            
            // 8. Mostrar mensaje de éxito y resetear el estado
            alert("Orden creada con éxito")
            setOrdenActual([])
            setParaLlevar(false)
            
        } catch (error) {
            console.error("Error al crear la orden:", error)
            alert(`Error al crear la orden: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }
    
    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros)
    }
    
    const aplicarFiltros = () => {
        fetchProductos(1, elementosPorPagina, busqueda, filtroTipo)
    }
    
    const limpiarFiltros = () => {
        setBusqueda("")
        setFiltroTipo("todos")
        fetchProductos(1, elementosPorPagina, "", "todos")
    }
    
    const buscarProductos = () => {
        fetchProductos(1, elementosPorPagina, busqueda, filtroTipo)
    }
    
    // Funciones para la paginación
    const irAPagina = (numeroPagina) => {
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            fetchProductos(numeroPagina, elementosPorPagina, busqueda, filtroTipo)
        }
    }
    
    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            fetchProductos(paginaActual - 1, elementosPorPagina, busqueda, filtroTipo)
        }
    }
    
    const irAPaginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            fetchProductos(paginaActual + 1, elementosPorPagina, busqueda, filtroTipo)
        }
    }
    
    const cambiarElementosPorPagina = (nuevaCantidad) => {
        setElementosPorPagina(nuevaCantidad)
        fetchProductos(1, nuevaCantidad, busqueda, filtroTipo)
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
        <div className="container-fluid p-0">
            <div className="row g-3">
                <div className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-8">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Buscar..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && buscarProductos()}
                                        />
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={buscarProductos}
                                        >
                                            <Search size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button 
                                        className="btn w-100" 
                                        style={{ backgroundColor: "#27a745", color: "white" }}
                                        onClick={toggleFiltros}
                                    >
                                        <Filter size={18} className="me-2" />
                                        Filtrar
                                    </button>
                                </div>
                            </div>
                            
                            {/* Panel de filtros */}
                            {mostrarFiltros && (
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h6 className="card-subtitle mb-3">Filtrar por tipo:</h6>
                                        <div className="btn-group w-100 mb-3">
                                            <button 
                                                className={`btn ${filtroTipo === "todos" ? "btn-danger" : "btn-outline-danger"}`}
                                                onClick={() => setFiltroTipo("todos")}
                                            >
                                                Todos
                                            </button>
                                            <button 
                                                className={`btn ${filtroTipo === "COMIDA" ? "btn-danger" : "btn-outline-danger"}`}
                                                onClick={() => setFiltroTipo("COMIDA")}
                                            >
                                                Comidas
                                            </button>
                                            <button 
                                                className={`btn ${filtroTipo === "BEBIDA" ? "btn-danger" : "btn-outline-danger"}`}
                                                onClick={() => setFiltroTipo("BEBIDA")}
                                            >
                                                Bebidas
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
                                                    <option value="15">15</option>
                                                    <option value="20">20</option>
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

                            {loadingProductos ? (
                                <div className="d-flex justify-content-center my-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando productos...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                                    {productos.length > 0 ? (
                                        productos.map((producto) => (
                                            <div className="col" key={producto.id}>
                                                <ProductCard producto={producto} onAgregar={() => agregarProducto(producto)} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center my-5">
                                            <p>No se encontraron productos que coincidan con la búsqueda.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Paginación */}
                            {!loadingProductos && totalElementos > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div>
                                        <span className="text-muted">
                                            Mostrando {indiceInicial} a {indiceFinal} de {totalElementos} productos
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
                </div>

                <div className="col-md-3">
                    <OrdenActual
                        items={ordenActual}
                        paraLlevar={paraLlevar}
                        setParaLlevar={setParaLlevar}
                        cambiarCantidad={cambiarCantidad}
                        eliminarProducto={eliminarProducto}
                        crearOrden={crearOrden}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    )
}

export default CrearOrden