"use client"

import { useState, useEffect } from "react"

function ProductForm({ onClose, onSave, productToEdit }) {
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    tipo: "COMIDA",
    name: "",
    description: "",
    price: "",
    type: "PRINCIPAL", // Valor por defecto para COMIDA
    url_img: "",
    is_active: true,
  })

  // Estado para errores de validación
  const [errors, setErrors] = useState({})

  // Opciones para los tipos de productos
  const tipoOptions = [
    { value: "COMIDA", label: "Comida" },
    { value: "BEBIDA", label: "Bebida" },
  ]

  // Opciones para las subcategorías según el tipo
  const typeOptions = {
    COMIDA: [
      { value: "ENTRADA", label: "Entrada" },
      { value: "PRINCIPAL", label: "Plato Principal" },
      { value: "POSTRE", label: "Postre" },
    ],
    BEBIDA: [
      { value: "GASEOSA", label: "Gaseosa" },
      { value: "NATURAL", label: "Natural" },
      { value: "CERVEZA", label: "Cerveza" },
      { value: "DESTILADOS", label: "Destilados" },
    ],
  }

  // Cargar datos del producto si estamos en modo edición
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        tipo: productToEdit.tipo || "COMIDA",
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price ? productToEdit.price.toString() : "",
        type: productToEdit.type || "PRINCIPAL",
        url_img: productToEdit.url_img || "",
        is_active: productToEdit.is_active !== undefined ? productToEdit.is_active : true,
      })
    }
  }, [productToEdit])

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Para campos checkbox, usar el valor de checked
    const newValue = type === "checkbox" ? checked : value

    // Actualizar el estado del formulario
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Si cambia el tipo, actualizar el type a un valor válido para ese tipo
    if (name === "tipo") {
      setFormData((prev) => ({
        ...prev,
        type: value === "COMIDA" ? "PRINCIPAL" : "GASEOSA",
      }))
    }

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar campos requeridos
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida"
    if (!formData.price) newErrors.price = "El precio es requerido"

    // Validar que el precio sea un número válido
    if (formData.price && (isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0)) {
      newErrors.price = "El precio debe ser un número mayor que cero"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) return

    // Preparar datos para enviar
    const productData = {
      ...formData,
      price: Number.parseFloat(formData.price),
    }

    // Llamar a la función onSave con los datos del producto
    onSave(productData)
  }

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{productToEdit ? "Editar Producto" : "Crear Nuevo Producto"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Tipo de Producto*</label>
                  <select
                    className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    {tipoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Categoría*</label>
                  <select
                    className={`form-select ${errors.type ? "is-invalid" : ""}`}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    {typeOptions[formData.tipo].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre*</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción*</label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descripción del producto"
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Precio*</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.price ? "is-invalid" : ""}`}
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="text"
                    className={`form-control ${errors.url_img ? "is-invalid" : ""}`}
                    name="url_img"
                    value={formData.url_img}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {errors.url_img && <div className="invalid-feedback">{errors.url_img}</div>}
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    id="activeSwitch"
                  />
                  <label className="form-check-label" htmlFor="activeSwitch">
                    Producto Activo
                  </label>
                </div>
              </div>

              {/* Vista previa de la imagen */}
              {formData.url_img && (
                <div className="mb-3 text-center">
                  <label className="form-label">Vista previa de la imagen:</label>
                  <div className="border p-2 d-inline-block">
                    <img
                      src={formData.url_img || "/placeholder.svg"}
                      alt="Vista previa"
                      style={{ maxHeight: "150px", maxWidth: "100%" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
              )}
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
  )
}

export default ProductForm
