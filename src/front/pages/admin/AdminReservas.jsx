"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Search, Plus, Filter, CheckCircle, XCircle, Clock, Edit } from "lucide-react"
import BookingForm from "../../components/admin/BookingForm"

function AdminReservas() {
  const [reservas, setReservas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [reservaToEdit, setReservaToEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [statusModal, setStatusModal] = useState({ show: false, reservaId: null, currentStatus: null })

  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")

  // Estados para paginación desde el backend
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const [elementosPorPagina, setElementosPorPagina] = useState(10)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalElementos, setTotalElementos] = useState(0)

  const fetchReservations = async (pagina = 1, porPagina = 10, buscar = "", estado = "", fecha = "") => {
    try {
      setLoading(true)
      setError(null)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      // Construir URL con parámetros de paginación y filtros
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/reservations?page=${pagina}&per_page=${porPagina}`

      // Añadir búsqueda si existe
      if (buscar.trim() !== "") {
        url += `&search=${encodeURIComponent(buscar)}`
      }

      // Añadir filtro de estado si existe
      if (estado !== "") {
        url += `&status=${estado}`
      }

      // Añadir filtro de fecha si existe
      if (fecha !== "") {
        url += `&date=${fecha}`
      }

      // Realizar la petición al endpoint
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cargar reservaciones: ${response.status}`)
      }

      const data = await response.json()

      // Actualizar estados con la respuesta del backend
      setReservas(data.items || [])
      setPaginaActual(data.page || 1)
      setTotalPaginas(data.pages || 1)
      setElementosPorPagina(data.per_page || 10)
      setTotalElementos(data.total || 0)
    } catch (err) {
      console.error("Error al cargar reservaciones:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations(paginaActual, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
  }, [])

  const handleCreateReservation = () => {
    setReservaToEdit(null)
    setShowForm(true)
  }

  const handleEditReservation = (reserva) => {
    setReservaToEdit(reserva)
    setShowForm(true)
  }

  const handleDeleteConfirm = (reservaId) => {
    setConfirmDelete(reservaId)
  }

  const handleDeleteReservation = async () => {
    if (confirmDelete) {
      try {
        setLoading(true)

        // Obtener el token de autenticación
        const token = sessionStorage.getItem("access_token")

        // Realizar la petición para eliminar la reservación
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${confirmDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error al eliminar reservación: ${response.status}`)
        }

        // Mostrar mensaje de éxito
        setSuccessMessage("Reservación eliminada correctamente")
        setTimeout(() => setSuccessMessage(null), 3000)

        // Recargar la lista de reservaciones
        await fetchReservations(paginaActual, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
        setConfirmDelete(null)
      } catch (err) {
        console.error("Error al eliminar reservación:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveReservation = async (reservationData) => {
    try {
      setLoading(true)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      // Preparar los datos según si es creación o edición
      let url, method

      if (reservaToEdit) {
        // EDICIÓN
        url = `${import.meta.env.VITE_BACKEND_URL}/api/reservations/${reservaToEdit.id}`
        method = "PUT"
      } else {
        // CREACIÓN
        url = `${import.meta.env.VITE_BACKEND_URL}/api/reservations`
        method = "POST"
      }

      // Realizar la petición para crear/actualizar la reservación
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error(`Error al ${reservaToEdit ? "actualizar" : "crear"} reservación: ${response.status}`)
      }

      // Mostrar mensaje de éxito
      setSuccessMessage(`Reservación ${reservaToEdit ? "actualizada" : "creada"} correctamente`)
      setTimeout(() => setSuccessMessage(null), 3000)

      // Recargar la lista de reservaciones
      await fetchReservations(paginaActual, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
      setShowForm(false)
    } catch (err) {
      console.error(`Error al ${reservaToEdit ? "actualizar" : "crear"} reservación:`, err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Abrir modal para cambiar estado
  const openStatusModal = (reserva) => {
    setStatusModal({
      show: true,
      reservaId: reserva.id,
      currentStatus: reserva.status,
    })
  }

  // Cambiar rápidamente el estado de una reserva
  const handleQuickStatusChange = async (nuevoEstado) => {
    try {
      setLoading(true)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      // Realizar la petición para actualizar el estado
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${statusModal.reservaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nuevoEstado }),
      })

      if (!response.ok) {
        throw new Error(`Error al actualizar estado: ${response.status}`)
      }

      // Mostrar mensaje de éxito
      setSuccessMessage(`Estado actualizado a ${nuevoEstado}`)
      setTimeout(() => setSuccessMessage(null), 3000)

      // Cerrar el modal
      setStatusModal({ show: false, reservaId: null, currentStatus: null })

      // Recargar la lista de reservaciones
      await fetchReservations(paginaActual, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
    } catch (err) {
      console.error("Error al actualizar estado:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const buscarReservaciones = () => {
    fetchReservations(1, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
  }

  const aplicarFiltros = () => {
    fetchReservations(1, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
  }

  const limpiarFiltros = () => {
    setFiltroEstado("")
    setFiltroFecha("")
    fetchReservations(1, elementosPorPagina, searchTerm, "", "")
  }

  // Funciones para la paginación
  const irAPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      fetchReservations(numeroPagina, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
    }
  }

  const irAPaginaAnterior = () => {
    if (paginaActual > 1) {
      fetchReservations(paginaActual - 1, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
    }
  }

  const irAPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      fetchReservations(paginaActual + 1, elementosPorPagina, searchTerm, filtroEstado, filtroFecha)
    }
  }

  const cambiarElementosPorPagina = (nuevaCantidad) => {
    setElementosPorPagina(nuevaCantidad)
    fetchReservations(1, nuevaCantidad, searchTerm, filtroEstado, filtroFecha)
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

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Formatear fecha para input date
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Obtener el color de la insignia según el estado
  const getBadgeColor = (status) => {
    switch (status) {
      case "CANCELADA":
        return "bg-danger"
      case "CONFIRMADA":
        return "bg-success"
      case "PENDIENTE":
        return "bg-warning"
      case "COMPLETADA":
        return "bg-info"
      default:
        return "bg-secondary"
    }
  }

  // Obtener el icono según el estado
  const getStatusIcon = (status) => {
    switch (status) {
      case "CANCELADA":
        return <XCircle size={16} className="me-2 text-danger" />
      case "CONFIRMADA":
        return <CheckCircle size={16} className="me-2 text-success" />
      case "PENDIENTE":
        return <Clock size={16} className="me-2 text-warning" />
      case "COMPLETADA":
        return <CheckCircle size={16} className="me-2 text-info" />
      default:
        return null
    }
  }

  return (
    <div className="container-fluid">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">Gestión de Reservaciones</h4>
            <button
              className="btn"
              onClick={handleCreateReservation}
              style={{ backgroundColor: "#27a745", color: "white" }}
            >
              <Plus size={18} className="me-2" />
              Crear Reservación
            </button>
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
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarReservaciones()}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={buscarReservaciones}>
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
                  className="btn btn-outline-danger"
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
                <div className="col-md-5">
                  <label className="form-label">Filtrar por estado</label>
                  <select
                    className="form-select"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADA">CONFIRMADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                    <option value="COMPLETADA">COMPLETADA</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label">Filtrar por fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <div className="d-grid gap-2 w-100">
                    <button className="btn btn-primary" type="button" onClick={aplicarFiltros}>
                      Aplicar
                    </button>
                    <button className="btn btn-outline-secondary" type="button" onClick={limpiarFiltros}>
                      Limpiar
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
                  <th>Invitado</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Personas</th>
                  <th>Fecha Reserva</th>
                  <th>Mesa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reservas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.id}</td>
                      <td>{reserva.guest_name}</td>
                      <td>{reserva.email}</td>
                      <td>{reserva.guest_phone}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className={`badge ${getBadgeColor(reserva.status)} px-3 rounded-pill me-2`}>
                            {reserva.status}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-secondary border-0"
                            onClick={() => openStatusModal(reserva)}
                            title="Cambiar estado"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      </td>
                      <td>{reserva.quantity}</td>
                      <td>{formatDate(reserva.start_date_time)}</td>
                      <td>{reserva.table_id}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditReservation(reserva)}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteConfirm(reserva.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && reservas.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-3">
                      No se encontraron reservaciones
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
                  Mostrando {indiceInicial} a {indiceFinal} de {totalElementos} reservaciones
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

      {/* Modal para cambiar estado */}
      {statusModal.show && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Estado de Reservación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setStatusModal({ show: false, reservaId: null, currentStatus: null })}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Estado actual:{" "}
                  <span className={`badge ${getBadgeColor(statusModal.currentStatus)}`}>
                    {statusModal.currentStatus}
                  </span>
                </p>
                <p>Selecciona el nuevo estado:</p>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-warning d-flex align-items-center justify-content-center"
                    onClick={() => handleQuickStatusChange("PENDIENTE")}
                  >
                    <Clock size={18} className="me-2" />
                    PENDIENTE
                  </button>

                  <button
                    className="btn btn-success d-flex align-items-center justify-content-center"
                    onClick={() => handleQuickStatusChange("CONFIRMADA")}
                  >
                    <CheckCircle size={18} className="me-2" />
                    CONFIRMADA
                  </button>

                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center"
                    onClick={() => handleQuickStatusChange("CANCELADA")}
                  >
                    <XCircle size={18} className="me-2" />
                    CANCELADA
                  </button>

                  <button
                    className="btn btn-info d-flex align-items-center justify-content-center text-white"
                    onClick={() => handleQuickStatusChange("COMPLETADA")}
                  >
                    <CheckCircle size={18} className="me-2" />
                    COMPLETADA
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStatusModal({ show: false, reservaId: null, currentStatus: null })}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <BookingForm onClose={() => setShowForm(false)} onSave={handleSaveReservation} reservaToEdit={reservaToEdit} />
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
                <p>¿Estás seguro de que deseas eliminar esta reservación?</p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteReservation}>
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

export default AdminReservas
