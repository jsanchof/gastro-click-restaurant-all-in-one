import { useState } from "react"
import { Clock, ArrowRight, CheckCircle, MenuIcon as TakeoutDining } from "lucide-react"

function OrderCard({ order, onUpdateStatus }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calcular tiempo transcurrido desde que se realizó la orden
  const getElapsedTime = (timestamp) => {
    const orderTime = new Date(timestamp)
    const now = new Date()
    const diffMs = now - orderTime
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Ahora mismo"
    if (diffMins === 1) return "Hace 1 minuto"
    return `Hace ${diffMins} minutos`
  }

  // Determinar el color de fondo según el tiempo transcurrido
  const getUrgencyClass = (timestamp) => {
    const orderTime = new Date(timestamp)
    const now = new Date()
    const diffMs = now - orderTime
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins >= 15) return "bg-danger text-white" // Más de 15 minutos
    if (diffMins >= 10) return "bg-warning" // Entre 10 y 15 minutos
    return "bg-warning-subtle" // Menos de 10 minutos
  }

  // Determinar el color del borde según el estado
  const getStatusBorderClass = (status) => {
    switch (status) {
      case "pending":
        return "border-warning"
      case "in_progress":
        return "border-primary"
      case "completed":
        return "border-success"
      default:
        return ""
    }
  }

  return (
    <div className={`card shadow-sm ${getStatusBorderClass(order.status)} border-2`}>
      <div
        className={`card-header d-flex justify-content-between align-items-center ${order.status === "pending" ? getUrgencyClass(order.timestamp) : ""}`}
      >
        <h5 className="card-title mb-0">Orden #{order.orderNumber}</h5>
        <div className="d-flex align-items-center">
          {order.isToGo && (
            <span className="badge bg-info me-2 d-flex align-items-center">
              <TakeoutDining size={14} className="me-1" />
              Para llevar
            </span>
          )}
          <span className="badge bg-light text-dark d-flex align-items-center">
            <Clock size={14} className="me-1" />
            {getElapsedTime(order.timestamp)}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="mb-2">
          <strong>{order.isToGo ? "Cliente: " : "Mesa: "}</strong>
          {order.isToGo ? order.customer : order.table}
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Productos:</strong>
            <button className="btn btn-sm btn-link p-0" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Colapsar" : "Expandir"}
            </button>
          </div>

          <ul className="list-group">
            {order.items.map((item, index) => (
              <li key={index} className="list-group-item p-2">
                <div className="d-flex justify-content-between">
                  <span>
                    <strong>{item.quantity}x</strong> {item.name}
                  </span>
                </div>
                {item.notes && isExpanded && (
                  <div className="mt-1 text-muted small">
                    <em>{item.notes}</em>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="d-flex justify-content-between">
          {order.status === "pending" && (
            <button className="btn btn-warning w-100 me-2" onClick={() => onUpdateStatus(order.id, "in_progress")}>
              <ArrowRight size={18} className="me-1" />
              En Proceso
            </button>
          )}

          {order.status === "in_progress" && (
            <button className="btn btn-success w-100" onClick={() => onUpdateStatus(order.id, "completed")}>
              <CheckCircle size={18} className="me-1" />
              Completada
            </button>
          )}

          {order.status === "completed" && (
            <div className="alert alert-success mb-0 w-100 py-2">
              <CheckCircle size={18} className="me-1" />
              Completada
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderCard
