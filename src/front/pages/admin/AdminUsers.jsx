import { useState, useEffect } from "react"
import { Pencil, Trash2, Search } from "lucide-react"
import UserForm from "../../components/admin/UserForm"

function AdminUsers() {
    const [users, setUsers] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [userToEdit, setUserToEdit] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        // Simulación de datos de usuarios
        const usersData = [
            {
                id: 1,
                nombre: "Ruben Gonzalez",
                correo: "ruben@ejemplo.com",
                rol: "admin",
                fechaRegistro: "2023-01-15",
            },
            {
                id: 2,
                nombre: "Carlos Mendez",
                correo: "carlos@ejemplo.com",
                rol: "cliente",
                fechaRegistro: "2023-02-20",
            },
            {
                id: 3,
                nombre: "Maria Lopez",
                correo: "maria@ejemplo.com",
                rol: "cliente",
                fechaRegistro: "2023-03-10",
            },
            {
                id: 4,
                nombre: "Juan Perez",
                correo: "juan@ejemplo.com",
                rol: "cliente",
                fechaRegistro: "2023-04-05",
            },
            {
                id: 5,
                nombre: "Ana Martinez",
                correo: "ana@ejemplo.com",
                rol: "admin",
                fechaRegistro: "2023-05-12",
            },
        ]

        setUsers(usersData)
    }, [])

    const handleCreateUser = () => {
        setUserToEdit(null)
        setShowForm(true)
    }

    const handleEditUser = (user) => {
        setUserToEdit(user)
        setShowForm(true)
    }

    const handleDeleteConfirm = (userId) => {
        setConfirmDelete(userId)
    }

    const handleDeleteUser = () => {
        if (confirmDelete) {
            setUsers(users.filter((user) => user.id !== confirmDelete))
            setConfirmDelete(null)
        }
    }

    const handleSaveUser = (userData) => {
        if (userToEdit) {
            // Actualizar usuario existente
            setUsers(users.map((user) => (user.id === userToEdit.id ? { ...user, ...userData, id: userToEdit.id } : user)))
        } else {
            // Crear nuevo usuario
            const newUser = {
                ...userData,
                id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
                fechaRegistro: new Date().toISOString().split("T")[0],
            }
            setUsers([...users, newUser])
        }
    }

    const filteredUsers = users.filter(
        (user) =>
            user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.correo.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="container-fluid">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="card-title mb-0">Gestión de Usuarios</h4>
                        <button className="btn btn-warning" onClick={handleCreateUser}>
                            Crear Usuario
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
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.nombre}</td>
                                        <td>{user.correo}</td>
                                        <td>
                                            <span className={`badge ${user.rol === "admin" ? "bg-danger" : "bg-primary"} rounded-pill`}>
                                                {user.rol}
                                            </span>
                                        </td>
                                        <td>{user.fechaRegistro}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditUser(user)}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteConfirm(user.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-3">
                                            No se encontraron usuarios
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

            {showForm && <UserForm onClose={() => setShowForm(false)} onSave={handleSaveUser} userToEdit={userToEdit} />}

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

export default AdminUsers
