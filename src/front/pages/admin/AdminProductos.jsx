"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Search, Coffee, Utensils, Plus } from "lucide-react"
import ProductForm from "../../components/admin/ProductForm"

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState("")

  // Estados para paginación desde el backend
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const [elementosPorPagina, setElementosPorPagina] = useState(10)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalElementos, setTotalElementos] = useState(0)

  const fetchProductos = async (pagina = 1, porPagina = 10, buscar = "", tipo = "") => {
    try {
      setLoading(true)
      setError(null)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      // Construir URL con parámetros de paginación y filtros
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/productos?page=${pagina}&per_page=${porPagina}`

      // Añadir búsqueda si existe
      if (buscar.trim() !== "") {
        url += `&search=${encodeURIComponent(buscar)}`
      }

      // Añadir filtro de tipo si está definido
      if (tipo !== "") {
        url += `&tipo=${tipo}`
      }

      // Realizar la petición al endpoint
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status}`)
      }

      const data = await response.json()

      // Actualizar estados con la respuesta del backend
      setProductos(data.items || [])
      setPaginaActual(data.page || 1)
      setTotalPaginas(data.pages || 1)
      setElementosPorPagina(data.per_page || 10)
      setTotalElementos(data.total || 0)
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos(paginaActual, elementosPorPagina, searchTerm, filtroTipo)
  }, [])

  const handleCreateProduct = () => {
    setProductToEdit(null)
    setShowForm(true)
  }

  const handleEditProduct = (product) => {
    setProductToEdit(product)
    setShowForm(true)
  }

  const handleDeleteConfirm = (product) => {
    setConfirmDelete(product)
  }

  const handleDeleteProduct = async () => {
    if (confirmDelete) {
      try {
        setLoading(true)

        // Obtener el token de autenticación
        const token = sessionStorage.getItem("access_token")

        // Extraer el número del ID
        const rawId = confirmDelete.id
        const id = Number.parseInt(rawId.split("-")[1])

        // Realizar la petición para eliminar el producto
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/productos/${confirmDelete.tipo}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error al eliminar producto: ${response.status}`)
        }

        // Recargar la lista de productos
        await fetchProductos(paginaActual, elementosPorPagina, searchTerm, filtroTipo)
        setConfirmDelete(null)
      } catch (err) {
        console.error("Error al eliminar producto:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      setLoading(true)

      // Obtener el token de autenticación
      const token = sessionStorage.getItem("access_token")

      // Preparar los datos según si es creación o edición
      let url, method

      if (productToEdit) {
        // EDICIÓN
        // Extraer el número del ID
        const rawId = productToEdit.id
        const id = Number.parseInt(rawId.split("-")[1])

        url = `${import.meta.env.VITE_BACKEND_URL}/api/productos/${productToEdit.tipo}/${id}`
        method = "PUT"
      } else {
        // CREACIÓN
        url = `${import.meta.env.VITE_BACKEND_URL}/api/productos`
        method = "POST"
      }

      // Realizar la petición para crear/actualizar el producto
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error(`Error al ${productToEdit ? "actualizar" : "crear"} producto: ${response.status}`)
      }

      // Recargar la lista de productos
      await fetchProductos(paginaActual, elementosPorPagina, searchTerm, filtroTipo)
      setShowForm(false)
    } catch (err) {
      console.error(`Error al ${productToEdit ? "actualizar" : "crear"} producto:`, err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const buscarProductos = () => {
    fetchProductos(1, elementosPorPagina, searchTerm, filtroTipo)
  }

  // Funciones para la paginación
  const irAPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      fetchProductos(numeroPagina, elementosPorPagina, searchTerm, filtroTipo)
    }
  }

  const irAPaginaAnterior = () => {
    if (paginaActual > 1) {
      fetchProductos(paginaActual - 1, elementosPorPagina, searchTerm, filtroTipo)
    }
  }

  const irAPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      fetchProductos(paginaActual + 1, elementosPorPagina, searchTerm, filtroTipo)
    }
  }

  const cambiarElementosPorPagina = (nuevaCantidad) => {
    setElementosPorPagina(nuevaCantidad)
    fetchProductos(1, nuevaCantidad, searchTerm, filtroTipo)
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

  // Obtener el icono según el tipo de producto
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "BEBIDA":
        return <Coffee size={16} className="me-1" />
      case "COMIDA":
        return <Utensils size={16} className="me-1" />
      default:
        return <Utensils size={16} className="me-1" />
    }
  }

  // Obtener el color de la insignia según el tipo
  const getBadgeColor = (tipo, type) => {
    if (tipo === "BEBIDA") {
      switch (type) {
        case "GASEOSA":
          return "bg-info"
        case "NATURAL":
          return "bg-success"
        case "CERVEZA":
          return "bg-warning"
        case "DESTILADOS":
          return "bg-danger"
        default:
          return "bg-secondary"
      }
    } else if (tipo === "COMIDA") {
      switch (type) {
        case "ENTRADA":
          return "bg-info"
        case "PRINCIPAL":
          return "bg-success"
        case "POSTRE":
          return "bg-warning"
        default:
          return "bg-secondary"
      }
    }
    return "bg-secondary"
  }

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price)
  }

  return (
    <div className="container-fluid">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">Gestión de Platillos y Bebidas</h4>
            <button
              className="btn"
              onClick={handleCreateProduct}
              style={{ backgroundColor: "#27a745", color: "white" }}
            >
              <Plus size={18} className="me-2" />
              Crear Nuevo
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
                  placeholder="Buscar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarProductos()}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={buscarProductos}>
                  Buscar
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100">
                <button
                  className={`btn ${filtroTipo === "" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => {
                    setFiltroTipo("")
                    fetchProductos(1, elementosPorPagina, searchTerm, "")
                  }}
                >
                  Todos
                </button>
                <button
                  className={`btn ${filtroTipo === "COMIDA" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => {
                    setFiltroTipo("COMIDA")
                    fetchProductos(1, elementosPorPagina, searchTerm, "COMIDA")
                  }}
                >
                  <Utensils size={16} className="me-1" />
                  Comidas
                </button>
                <button
                  className={`btn ${filtroTipo === "BEBIDA" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => {
                    setFiltroTipo("BEBIDA")
                    fetchProductos(1, elementosPorPagina, searchTerm, "BEBIDA")
                  }}
                >
                  <Coffee size={16} className="me-1" />
                  Bebidas
                </button>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Elementos por página:</label>
              <select
                className="form-select"
                value={elementosPorPagina}
                onChange={(e) => cambiarElementosPorPagina(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th>Estado</th>
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
                  productos.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <img
                          src={product.url_img || "/placeholder.svg"}
                          alt={product.name}
                          className="img-thumbnail"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>
                        <span className={`badge bg-primary rounded-pill d-flex align-items-center`}>
                          {getTipoIcon(product.tipo)}
                          {product.tipo}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getBadgeColor(product.tipo, product.type)} rounded-pill`}>
                          {product.type}
                        </span>
                      </td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <span className="text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
                          {product.description}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${product.is_active ? "bg-success" : "bg-danger"} rounded-pill`}>
                          {product.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditProduct(product)}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteConfirm(product)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && productos.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-3">
                      No se encontraron productos
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
                  Mostrando {indiceInicial} a {indiceFinal} de {totalElementos} productos
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

      {showForm && (
        <ProductForm onClose={() => setShowForm(false)} onSave={handleSaveProduct} productToEdit={productToEdit} />
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
                <p>
                  ¿Estás seguro de que deseas eliminar el producto <strong>{confirmDelete.name}</strong>?
                </p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteProduct}>
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

export default AdminProductos
