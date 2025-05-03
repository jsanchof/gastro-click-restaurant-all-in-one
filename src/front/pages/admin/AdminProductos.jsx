import { useState, useEffect } from "react"
import { Pencil, Trash2, Search, Coffee, Utensils, IceCream } from "lucide-react"
import ProductForm from "../../components/admin/ProductForm"

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState("todos")

  useEffect(() => {
    // Simulación de datos de productos
    const productosData = [
      {
        id: 1,
        nombre: "Cerveza",
        tipo: "bebida",
        precio: 1.5,
        descripcion: "Cerveza fría de barril",
        imagen: "/placeholder.svg?key=ske7x",
      },
      {
        id: 2,
        nombre: "Snacks",
        tipo: "platillo",
        precio: 2.5,
        descripcion: "Variedad de snacks para compartir",
        imagen: "/placeholder.svg?key=00tyi",
      },
      {
        id: 3,
        nombre: "Hamburguesa",
        tipo: "platillo",
        precio: 4.0,
        descripcion: "Hamburguesa clásica con carne de res",
        imagen: "/classic-beef-burger.png",
      },
      {
        id: 4,
        nombre: "Pizza",
        tipo: "platillo",
        precio: 5.5,
        descripcion: "Pizza con ingredientes frescos",
        imagen: "/delicious-pizza.png",
      },
      {
        id: 5,
        nombre: "Refresco",
        tipo: "bebida",
        precio: 1.25,
        descripcion: "Refresco frío en vaso",
        imagen: "/refreshing-drink.png",
      },
    ]

    setProductos(productosData)
  }, [])

  const handleCreateProduct = () => {
    setProductToEdit(null)
    setShowForm(true)
  }

  const handleEditProduct = (product) => {
    setProductToEdit(product)
    setShowForm(true)
  }

  const handleDeleteConfirm = (productId) => {
    setConfirmDelete(productId)
  }

  const handleDeleteProduct = () => {
    if (confirmDelete) {
      setProductos(productos.filter((product) => product.id !== confirmDelete))
      setConfirmDelete(null)
    }
  }

  const handleSaveProduct = (productData) => {
    if (productToEdit) {
      // Actualizar producto existente
      setProductos(
        productos.map((product) =>
          product.id === productToEdit.id ? { ...product, ...productData, id: productToEdit.id } : product,
        ),
      )
    } else {
      // Crear nuevo producto
      const newProduct = {
        ...productData,
        id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
      }
      setProductos([...productos, newProduct])
    }
  }

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "bebida":
        return <Coffee size={16} className="me-1" />
      case "postre":
        return <IceCream size={16} className="me-1" />
      default:
        return <Utensils size={16} className="me-1" />
    }
  }

  const filteredProductos = productos.filter(
    (product) =>
      (filtroTipo === "todos" || product.tipo === filtroTipo) &&
      (product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container-fluid">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">Gestión de Platillos y Bebidas</h4>
            <button className="btn btn-warning" onClick={handleCreateProduct}>
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
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100">
                <button
                  className={`btn ${filtroTipo === "todos" ? "btn-info" : "btn-outline-info"}`}
                  onClick={() => setFiltroTipo("todos")}
                >
                  Todos
                </button>
                <button
                  className={`btn ${filtroTipo === "platillo" ? "btn-info" : "btn-outline-info"}`}
                  onClick={() => setFiltroTipo("platillo")}
                >
                  <Utensils size={16} className="me-1" />
                  Platillos
                </button>
                <button
                  className={`btn ${filtroTipo === "bebida" ? "btn-info" : "btn-outline-info"}`}
                  onClick={() => setFiltroTipo("bebida")}
                >
                  <Coffee size={16} className="me-1" />
                  Bebidas
                </button>
                <button
                  className={`btn ${filtroTipo === "postre" ? "btn-info" : "btn-outline-info"}`}
                  onClick={() => setFiltroTipo("postre")}
                >
                  <IceCream size={16} className="me-1" />
                  Postres
                </button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>#ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.nombre}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.tipo === "bebida"
                            ? "bg-info"
                            : product.tipo === "postre"
                              ? "bg-warning"
                              : "bg-success"
                        } rounded-pill d-flex align-items-center`}
                      >
                        {getTipoIcon(product.tipo)}
                        {product.tipo}
                      </span>
                    </td>
                    <td>${product.precio.toFixed(2)}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
                        {product.descripcion}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditProduct(product)}>
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteConfirm(product.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProductos.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      No se encontraron productos
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
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
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
