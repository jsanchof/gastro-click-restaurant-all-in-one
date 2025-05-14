"use client"

import { useState, useEffect } from "react"
import { Clock, RefreshCw, Search, Filter } from "lucide-react"
import KitchenNavbar from "../../components/kitchen/KitchenNavbar"

function KitchenView() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // segundos
  const [timeLeft, setTimeLeft] = useState(refreshInterval)

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("EN_PROCESO")

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Función para obtener las órdenes
  const fetchOrders = async (page = 1, perPage = 10, search = "", status = "EN_PROCESO") => {
    try {
      setLoading(true)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      // Construir URL con parámetros
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/cocina/ordenes?page=${page}&per_page=${perPage}`

      // Añadir filtro de estado si existe
      if (status) {
        url += `&status=${status}`
      }

      // Añadir búsqueda si existe
      if (search.trim() !== "") {
        url += `&search=${encodeURIComponent(search)}`
      }

      // Realizar la petición
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cargar órdenes: ${response.status}`)
      }

      const data = await response.json()

      // Actualizar estados con la respuesta del backend
      setOrders(data.items || [])
      setCurrentPage(data.page || 1)
      setTotalPages(data.pages || 1)
      setItemsPerPage(data.per_page || 10)
      setTotalItems(data.total || 0)
      setLastUpdate(new Date())
      setTimeLeft(refreshInterval)
      setError(null)
    } catch (err) {
      console.error("Error al cargar órdenes:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Efecto para cargar órdenes iniciales
  useEffect(() => {
    fetchOrders(currentPage, itemsPerPage, searchTerm, statusFilter)
  }, [])

  // Efecto para el temporizador de actualización automática
  useEffect(() => {
    let timer

    if (autoRefresh) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            fetchOrders(currentPage, itemsPerPage, searchTerm, statusFilter) // Actualizar cuando llegue a cero
            return refreshInterval
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [autoRefresh, refreshInterval, currentPage, itemsPerPage, searchTerm, statusFilter])

  // Función para actualizar el estado de una orden
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      // Realizar la petición para actualizar el estado
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cocina/ordenes/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al actualizar estado: ${response.status}`)
      }

      // Recargar las órdenes para reflejar el cambio
      await fetchOrders(currentPage, itemsPerPage, searchTerm, statusFilter)
    } catch (err) {
      console.error("Error al actualizar estado:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para buscar órdenes
  const handleSearch = () => {
    setCurrentPage(1) // Resetear a la primera página
    fetchOrders(1, itemsPerPage, searchTerm, statusFilter)
  }

  // Función para cambiar el filtro de estado
  const handleStatusChange = (status) => {
    setStatusFilter(status)
    setCurrentPage(1) // Resetear a la primera página
    fetchOrders(1, itemsPerPage, searchTerm, status)
  }

  // Funciones para la paginación
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      fetchOrders(pageNumber, itemsPerPage, searchTerm, statusFilter)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  const changeItemsPerPage = (newAmount) => {
    setItemsPerPage(newAmount)
    setCurrentPage(1) // Resetear a la primera página
    fetchOrders(1, newAmount, searchTerm, statusFilter)
  }

  // Generar números de página para mostrar
  const generatePageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  // Calcular índices para mostrar información de paginación
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems)

  // Formatear tiempo transcurrido
  const formatTimeElapsed = (timestamp) => {
    const orderDate = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60))

    if (diffInMinutes < 1) return "Hace menos de un minuto"
    if (diffInMinutes === 1) return "Hace 1 minuto"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`

    const hours = Math.floor(diffInMinutes / 60)
    if (hours === 1) return "Hace 1 hora"
    return `Hace ${hours} horas`
  }

  // Mapear estados API a texto amigable para mostrar
  const getStatusDisplayText = (apiStatus) => {
    switch (apiStatus) {
      case "EN_PROCESO":
        return "En Proceso"
      case "COMPLETADA":
        return "Completada"
      case "CANCELADA":
        return "Cancelada"
      default:
        return apiStatus
    }
  }

  // Mapear estados de la UI a valores de API
  const getStatusBadgeClass = (apiStatus) => {
    switch (apiStatus) {
      case "EN_PROCESO":
        return "bg-warning"
      case "COMPLETADA":
        return "bg-success"
      case "CANCELADA":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

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
              onClick={() => fetchOrders(currentPage, itemsPerPage, searchTerm, statusFilter)}
              disabled={loading}
            >
              <RefreshCw size={16} className={`me-1 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>

        <div className="mb-3 text-muted small">Última actualización: {lastUpdate.toLocaleTimeString()}</div>

        {/* Filtros y búsqueda */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por ID de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                Buscar
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 justify-content-end">
              {/* Selector de elementos por página */}
              <div style={{ width: "120px" }}>
                <select
                  className="form-select form-select-sm"
                  value={itemsPerPage}
                  onChange={(e) => changeItemsPerPage(Number(e.target.value))}
                  aria-label="Elementos por página"
                >
                  <option value="5">5 por página</option>
                  <option value="10">10 por página</option>
                  <option value="15">15 por página</option>
                  <option value="20">20 por página</option>
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
                    className={`btn ${statusFilter === "EN_PROCESO" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleStatusChange("EN_PROCESO")}
                  >
                    En Proceso
                  </button>
                  <button
                    className={`btn ${statusFilter === "COMPLETADA" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleStatusChange("COMPLETADA")}
                  >
                    Completada
                  </button>
                  <button
                    className={`btn ${statusFilter === "CANCELADA" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleStatusChange("CANCELADA")}
                  >
                    Cancelada
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
          </div>
        )}

        {/* Contenido principal */}
        <div className="row">
          <div className="col-12 mb-4">
            <h2 className="h5 mb-3">
              Órdenes {getStatusDisplayText(statusFilter)} ({totalItems})
            </h2>

            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div className="col" key={order.id}>
                        <div className="card h-100 shadow-sm">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Orden #{order.ordenId}</h5>
                            <span
                              className={`badge ${
                                order.estado === "Completada"
                                  ? "bg-success"
                                  : order.estado === "En proceso"
                                    ? "bg-warning"
                                    : order.estado === "Cancelada"
                                      ? "bg-danger"
                                      : "bg-secondary"
                              }`}
                            >
                              {order.estado}
                            </span>
                          </div>
                          <div className="card-body">
                            <p className="card-text">
                              <strong>Cliente:</strong> {order.cliente}
                            </p>
                            <p className="card-text">
                              <strong>Fecha:</strong> {order.fecha}
                            </p>
                            <p className="card-text">
                              <strong>Total:</strong> ${order.total.toFixed(2)}
                            </p>

                            <h6 className="mt-3 mb-2">Productos:</h6>
                            <ul className="list-group list-group-flush">
                              {order.detalles &&
                                order.detalles.map((item, index) => (
                                  <li key={index} className="list-group-item px-0">
                                    <div className="d-flex justify-content-between">
                                      <span>
                                        <strong>{item.cantidad}x</strong> {item.producto}
                                      </span>
                                      <span>${item.subtotal.toFixed(2)}</span>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                          <div className="card-footer bg-transparent">
                            <div className="d-grid gap-2">
                              {order.estado === "En proceso" && (
                                <button
                                  className="btn btn-success"
                                  onClick={() => updateOrderStatus(order.id, "COMPLETADA")}
                                >
                                  Marcar como Completada
                                </button>
                              )}
                              {order.estado === "Pendiente" && (
                                <button
                                  className="btn btn-warning"
                                  onClick={() => updateOrderStatus(order.id, "EN_PROCESO")}
                                >
                                  Iniciar Preparación
                                </button>
                              )}
                              {(order.estado === "Pendiente" || order.estado === "En proceso") && (
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => updateOrderStatus(order.id, "CANCELADA")}
                                >
                                  Cancelar Orden
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col">
                      <div className="alert alert-info">No se encontraron órdenes</div>
                    </div>
                  )}
                </div>

                {/* Paginación */}
                {totalItems > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <span className="text-muted">
                        Mostrando {startIndex} a {endIndex} de {totalItems} órdenes
                      </span>
                    </div>
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goToPreviousPage} disabled={currentPage === 1}>
                            Anterior
                          </button>
                        </li>

                        {generatePageNumbers().map((pageNumber) => (
                          <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(pageNumber)}>
                              {pageNumber}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages}>
                            Siguiente
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitchenView
