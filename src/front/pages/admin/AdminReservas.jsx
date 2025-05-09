import { useState, useEffect } from "react"
import { Pencil, Trash2, Search } from "lucide-react"
import UserForm from "../../components/admin/UserForm"
import BookingForm from "../../components/admin/BookingForm"

function AdminReservas() {
    const [reservas, setReservas] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [reservaToEdit, setReservaToEdit] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)

    

    const handleCreateUser = () => {
        setReservaToEdit(null)
        setShowForm(true)
    }

    const handleEditReserva = (reserva) => {
        setReservaToEdit(reserva)
        setShowForm(true)
    }

    const handleDeleteConfirm = (userId) => {
        setConfirmDelete(userId)
    }

    const handleDeleteUser = () => {
        if (confirmDelete) {
            setReservas(reservas.filter((user) => user.id !== confirmDelete))
            setConfirmDelete(null)
        }
    }

    const handleSaveReserva = (userData) => {
        if (reservaToEdit) {
            // Actualiza una reserva existente
            setReservas(reservas.map((user) => (user.id === reservaToEdit.id ? { ...user, ...userData, id: reservaToEdit.id } : user)))
        } else {
            // Crear nuevo usuario
            const newUser = {
                ...userData,
                id: reservas.length > 0 ? Math.max(...reservas.map((u) => u.id)) + 1 : 1,
                fechaRegistro: new Date().toISOString().split("T")[0],
            }
            setReservas([...reservas, newUser])
        }
    }

    const filteredReservas = reservas.filter(
        (user) =>
            user.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    useEffect(() => {
        // Simulación de datos de usuarios
        // const usersData = [
        //     {
        //         id: 1,
        //         guest_name: "Ruben Gonzalez",
        //         email: "ruben@ejemplo.com",
        //         guest_phone: "123456",
        //         status: "Confirmada",
        //         quantity: "10",
        //         start_date_time: "2025-01-15",
        //         // fechaCreacion: "2024-12-15",
        //         additional_details: "Mesa cerca de ventana"
        //     },
        //     {
        //         id: 2,
        //         guest_name: "Carlos Mendez",
        //         email: "carlos@ejemplo.com",
        //         guest_phone: "23456789",
        //         status: "Cancelada",
        //         quantity: "6",
        //         start_date_time: "2025-02-20",
        //         // fechaCreacion: "2025-02-15",
        //         additional_details: "Un perchero"
        //     },
        //     {
        //         id: 3,
        //         guest_name: "Maria Lopez",
        //         email: "maria@ejemplo.com",
        //         guest_phone: "23456789",
        //         status: "Pendiente",
        //         quantity: "8",
        //         start_date_time: "2025-03-10",
        //         // fechaCreacion: "2025-02-10",
        //         additional_details: "Mesas de gabinete"
        //     },
        //     {
        //         id: 4,
        //         guest_name: "Juan Perez",
        //         email: "juan@ejemplo.com",
        //         guest_phone: "23456789",
        //         status: "Confirmada",
        //         quantity: "5",
        //         start_date_time: "2025-04-05",
        //         // fechaCreacion: "2025-03-15",
        //         additional_details: "Mesas de gabinete"
        //     },
        //     {
        //         id: 5,
        //         guest_name: "Ana Martinez",
        //         email: "ana@ejemplo.com",
        //         guest_phone: "23456789",
        //         status: "Completada",
        //         quantity: "30",
        //         start_date_time: "2025-05-12",
        //         // fechaCreacion: "2025-05-02",
        //         additional_details: "Area de fumadores"
        //     },
        // ]
        
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/reservations')
        .then(response => response.json())
        .then(data => setReservas(data))
        .catch(error => console.error("Error al conectar con el servidor:", error))

        // setReservas(usersData)
    }, [])

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="card-title mb-0">Gestión de Usuarios</h4>
                        <button className="btn" onClick={handleCreateUser} style={{ backgroundColor: "#27a745", color: "white" }}>
                            Crear una Reserva
                        </button>
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
                                    placeholder="Buscar por nombre o correo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
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
                                    <th>Cantidad Personas</th>
                                    <th>Fecha Reserva</th>
                                    {/* <th>Fecha Creación</th> */}
                                    <th>Acciones</th>
                                    <th>Detalles Adicionales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservas.map((reserva) => (
                                    <tr key={reserva.id}>
                                        <td>{reserva.id}</td>
                                        <td>{reserva.guest_name}</td>
                                        <td>{reserva.email}</td>
                                        <td>{reserva.guest_phone}</td>
                                        <td>
                                            <span className={`badge ${reserva.status === "CANCELADA"
                                                ? "bg-danger px-3" 
                                                : reserva.status === "CONFIRMADA"
                                                ? "bg-success px-3"
                                                : reserva.status === "PENDIENTE"
                                                ? "bg-warning px-3"
                                                : "bg-info px-3"} rounded-pill`}>
                                                {reserva.status}
                                            </span>
                                        </td>
                                        <td>{reserva.quantity}</td>
                                        <td>{reserva.start_date_time}</td>
                                        {/* <td>{reserva.fechaCreacion}</td> */}
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditReserva(reserva)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteConfirm(reserva.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>{reserva.additional_details}</td>
                                        
                                    </tr>
                                ))}

                                {filteredReservas.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-3">
                                            No se encontraron usuarios
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
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

            {showForm && <BookingForm onClose={() => setShowForm(false)} onSave={handleSaveReserva} reservaToEdit={reservaToEdit} />}

            {/* Eliminación de Reservas */}
            {confirmDelete && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                                <p className="text-danger">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>
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
