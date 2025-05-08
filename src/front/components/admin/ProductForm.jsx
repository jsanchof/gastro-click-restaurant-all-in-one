import { useState } from "react"

function ProductForm({ onClose, onSave, productToEdit = null }) {
    const [formData, setFormData] = useState({
        nombre: productToEdit ? productToEdit.nombre : "",
        tipo: productToEdit ? productToEdit.tipo : "platillo",
        precio: productToEdit ? productToEdit.precio : "",
        descripcion: productToEdit ? productToEdit.descripcion : "",
        imagen: productToEdit ? productToEdit.imagen : "",
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
        if (!formData.precio) newErrors.precio = "El precio es requerido"
        else if (isNaN(formData.precio) || Number.parseFloat(formData.precio) <= 0)
            newErrors.precio = "El precio debe ser un número positivo"

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validate()

        if (Object.keys(newErrors).length === 0) {
            onSave({
                ...formData,
                precio: Number.parseFloat(formData.precio),
            })
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
                        <h5 className="modal-title">{productToEdit ? "Editar Producto" : "Crear Producto"}</h5>
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
                                <label htmlFor="tipo" className="form-label">
                                    Tipo
                                </label>
                                <select className="form-select" id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
                                    <option value="platillo">Platillo</option>
                                    <option value="bebida">Bebida</option>
                                    <option value="postre">Postre</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="precio" className="form-label">
                                    Precio
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                                        id="precio"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                    />
                                    {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="descripcion" className="form-label">
                                    Descripción
                                </label>
                                <textarea
                                    className="form-control"
                                    id="descripcion"
                                    name="descripcion"
                                    rows="3"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="imagen" className="form-label">
                                    URL de la imagen
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="imagen"
                                    name="imagen"
                                    value={formData.imagen}
                                    onChange={handleChange}
                                    placeholder="/placeholder.svg"
                                />
                                <div className="form-text">Deje en blanco para usar una imagen predeterminada</div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {productToEdit ? "Actualizar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductForm
