import { useState, useEffect } from "react"
import ProductCard from "../../components/user/ProductCard"
import OrdenActual from "../../components/user/OrdenActual"


function CrearOrden() {
    const [productos, setProductos] = useState([])
    const [ordenActual, setOrdenActual] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [paraLlevar, setParaLlevar] = useState(false)

    useEffect(() => {
        // Simulación de datos de productos
        const productosData = [
            { id: 1, nombre: "Cerveza", precio: 1.5, imagen: "https://picsum.photos/200/300" },
            { id: 2, nombre: "Snack", precio: 2.5, imagen: "https://picsum.photos/200/300" },
            { id: 3, nombre: "Hamburguesa", precio: 4.0, imagen: "https://picsum.photos/200/300" },
            { id: 4, nombre: "Pizza", precio: 5.5, imagen: "https://picsum.photos/200/300" },
            { id: 5, nombre: "Refresco", precio: 1.25, imagen: "https://picsum.photos/200/300" },
            { id: 6, nombre: "Papas Fritas", precio: 2.0, imagen: "https://picsum.photos/200/300" },
            { id: 7, nombre: "Ensalada", precio: 3.5, imagen: "https://picsum.photos/200/300" },
            { id: 8, nombre: "Helado", precio: 2.75, imagen: "https://picsum.photos/200/300" },
            { id: 9, nombre: "Café", precio: 1.75, imagen: "https://picsum.photos/200/300" },
            { id: 10, nombre: "Agua", precio: 1.0, imagen: "https://picsum.photos/200/300" },
        ]

        setProductos(productosData)
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

    const crearOrden = () => {
        // Aquí iría la lógica para enviar la orden al backend
        alert("Orden creada con éxito")
        setOrdenActual([])
        setParaLlevar(false)
    }

    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    )

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
                                        />
                                        <button className="btn btn-outline-secondary" type="button">
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button className="btn w-100" style={{ backgroundColor: "#27a745", color: "white" }}>Filtrar</button>
                                </div>
                            </div>

                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
                                {productosFiltrados.map((producto) => (
                                    <div className="col" key={producto.id}>
                                        <ProductCard producto={producto} onAgregar={() => agregarProducto(producto)} />
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-center mt-4">
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

                <div className="col-md-3">
                    <OrdenActual
                        items={ordenActual}
                        paraLlevar={paraLlevar}
                        setParaLlevar={setParaLlevar}
                        cambiarCantidad={cambiarCantidad}
                        eliminarProducto={eliminarProducto}
                        crearOrden={crearOrden}
                    />
                </div>
            </div>
        </div>
    )
}

export default CrearOrden