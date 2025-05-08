import { useState, useEffect } from "react"
import { Clock, RefreshCw } from "lucide-react"
import OrderCard from "../../components/kitchen/OrderCard"
import KitchenNavbar from "../../components/kitchen/KitchenNavbar"

function KitchenView() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(new Date())
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [refreshInterval, setRefreshInterval] = useState(30) // segundos
    const [timeLeft, setTimeLeft] = useState(refreshInterval)

    // Función para obtener las órdenes pendientes
    const fetchOrders = () => {
        setLoading(true)

        // Simulación de datos de órdenes pendientes
        // En un entorno real, esto sería una llamada a la API
        setTimeout(() => {
            const pendingOrders = [
                {
                    id: 1,
                    orderNumber: "456",
                    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutos atrás
                    status: "pending",
                    items: [
                        { name: "Hamburguesa", quantity: 1, notes: "Sin lechuga, sin cebolla" },
                        { name: "Papas Fritas", quantity: 1, notes: "Extra sal" },
                    ],
                    table: "Mesa 5",
                    customer: "Juan Pérez",
                    isToGo: false,
                },
                {
                    id: 2,
                    orderNumber: "457",
                    timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutos atrás
                    status: "in_progress",
                    items: [
                        { name: "Pizza Margarita", quantity: 1, notes: "Extra queso" },
                        { name: "Refresco", quantity: 2, notes: "" },
                    ],
                    table: "Mesa 3",
                    customer: "María López",
                    isToGo: false,
                },
                {
                    id: 3,
                    orderNumber: "458",
                    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutos atrás
                    status: "pending",
                    items: [
                        { name: "Snack", quantity: 1, notes: "Sin ajo" },
                        { name: "Cerveza", quantity: 1, notes: "" },
                    ],
                    table: "",
                    customer: "Carlos Ruiz",
                    isToGo: true,
                },
                {
                    id: 4,
                    orderNumber: "459",
                    timestamp: new Date().toISOString(), // Ahora
                    status: "pending",
                    items: [
                        { name: "Ensalada César", quantity: 1, notes: "Sin crutones" },
                        { name: "Agua", quantity: 1, notes: "Con gas" },
                    ],
                    table: "Mesa 8",
                    customer: "Ana Martínez",
                    isToGo: false,
                },
            ]

            setOrders(pendingOrders)
            setLastUpdate(new Date())
            setLoading(false)
            setTimeLeft(refreshInterval)
        }, 800) // Simular tiempo de carga
    }

    // Efecto para cargar órdenes iniciales
    useEffect(() => {
        fetchOrders()
    }, [])

    // Efecto para el temporizador de actualización automática
    useEffect(() => {
        let timer

        if (autoRefresh) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        fetchOrders() // Actualizar cuando llegue a cero
                        return refreshInterval
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [autoRefresh, refreshInterval])

    // Función para actualizar el estado de una orden
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
        )
    }

    // Filtrar órdenes por estado
    const pendingOrders = orders.filter((order) => order.status === "pending")
    const inProgressOrders = orders.filter((order) => order.status === "in_progress")
    const completedOrders = orders.filter((order) => order.status === "completed")

    return (
        <div className="kitchen-view bg-light min-vh-100">
            <KitchenNavbar />

            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3">Vista de Cocina</h1>

                    <div className="d-flex align-items-center">
                        <div className="me-3 d-flex align-items-center">
                            <Clock className="me-1" size={18} />
                            <span>Próxima actualización: {timeLeft}s</span>
                        </div>

                        <div className="form-check form-switch me-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoRefreshToggle"
                                checked={autoRefresh}
                                onChange={() => setAutoRefresh(!autoRefresh)}
                            />
                            <label className="form-check-label" htmlFor="autoRefreshToggle">
                                Auto
                            </label>
                        </div>

                        <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                            onClick={fetchOrders}
                            disabled={loading}
                        >
                            <RefreshCw size={16} className={`me-1 ${loading ? "animate-spin" : ""}`} />
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="mb-3 text-muted small">Última actualización: {lastUpdate.toLocaleTimeString()}</div>

                <div className="row">
                    <div className="col-12 mb-4">
                        <h2 className="h5 mb-3">Órdenes Pendientes ({pendingOrders.length})</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                            {pendingOrders.map((order) => (
                                <div className="col" key={order.id}>
                                    <OrderCard order={order} onUpdateStatus={updateOrderStatus} />
                                </div>
                            ))}
                            {pendingOrders.length === 0 && (
                                <div className="col">
                                    <div className="alert alert-info">No hay órdenes pendientes</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 mb-4">
                        <h2 className="h5 mb-3">Órdenes En Proceso ({inProgressOrders.length})</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                            {inProgressOrders.map((order) => (
                                <div className="col" key={order.id}>
                                    <OrderCard order={order} onUpdateStatus={updateOrderStatus} />
                                </div>
                            ))}
                            {inProgressOrders.length === 0 && (
                                <div className="col">
                                    <div className="alert alert-info">No hay órdenes en proceso</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12">
                        <h2 className="h5 mb-3">Órdenes Completadas Recientemente ({completedOrders.length})</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                            {completedOrders.map((order) => (
                                <div className="col" key={order.id}>
                                    <OrderCard order={order} onUpdateStatus={updateOrderStatus} />
                                </div>
                            ))}
                            {completedOrders.length === 0 && (
                                <div className="col">
                                    <div className="alert alert-info">No hay órdenes completadas recientemente</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KitchenView
