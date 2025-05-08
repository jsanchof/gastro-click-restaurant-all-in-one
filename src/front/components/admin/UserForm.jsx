import { useState } from "react"

function UserForm({ onClose, onSave, userToEdit = null }) {
    const [formData, setFormData] = useState({
        nombre: userToEdit ? userToEdit.nombre : "",
        correo: userToEdit ? userToEdit.correo : "",
        password: "",
        confirmPassword: "",
        rol: userToEdit ? userToEdit.rol : "cliente",
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!formData.correo.trim()) newErrors.correo = "El correo es requerido"
        else if (!/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = "El correo no es válido"

        if (!userToEdit) {
            if (!formData.password) newErrors.password = "La contraseña es requerida"
            else if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres"

            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden"
        }

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validate()

        if (Object.keys(newErrors).length === 0) {
            onSave(formData)
            onClose()
        } else {
            setErrors(newErrors)
        }
    }

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{userToEdit ? "Editar Usuario" : "Crear Usuario"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                                    id="correo"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                />
                                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                            </div>

                            {!userToEdit && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                    </div>
                                </>
                            )}

                            <div className="mb-3">
                                <label htmlFor="rol" className="form-label">
                                    Rol
                                </label>
                                <select className="form-select" id="rol" name="rol" value={formData.rol} onChange={handleChange}>
                                    <option value="cliente">Cliente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {userToEdit ? "Actualizar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserForm
