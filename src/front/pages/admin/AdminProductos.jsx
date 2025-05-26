"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Search, Coffee, Utensils, Plus } from "lucide-react"
import { Container, Card, Input, Button, Alert, Table, Modal } from '../../components/common';
import { colors, typography, spacing, borderRadius } from '../../theme';
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
  const [alert, setAlert] = useState(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const [elementosPorPagina, setElementosPorPagina] = useState(10)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalElementos, setTotalElementos] = useState(0)

  const fetchProductos = async (pagina = 1, porPagina = 10, buscar = "", tipo = "") => {
    try {
      setLoading(true)
      setAlert(null)

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
      setAlert({
        variant: "danger",
        title: "Error",
        message: err.message
      })
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
        setAlert({
          variant: "danger",
          title: "Error",
          message: err.message
        })
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
      setAlert({
        variant: "danger",
        title: "Error",
        message: err.message
      })
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

  const columns = [
    { id: 'id', label: 'ID' },
    {
      id: 'imagen',
      label: 'Imagen',
      render: (row) => (
        <img
          src={row.url_img || "/placeholder.svg"}
          alt={row.name}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: borderRadius.sm
          }}
        />
      )
    },
    { id: 'name', label: 'Nombre' },
    {
      id: 'tipo',
      label: 'Tipo',
      render: (row) => (
        <span style={{
          backgroundColor: colors.primary.main,
          color: colors.neutral.white,
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.full,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          fontSize: typography.fontSize.sm,
        }}>
          {getTipoIcon(row.tipo)}
          {row.tipo}
        </span>
      )
    },
    {
      id: 'type',
      label: 'Categoría',
      render: (row) => (
        <span style={{
          backgroundColor: colors.status[getBadgeColor(row.tipo, row.type)],
          color: colors.neutral.white,
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.full,
          fontSize: typography.fontSize.sm,
        }}>
          {row.type}
        </span>
      )
    },
    {
      id: 'price',
      label: 'Precio',
      render: (row) => formatPrice(row.price)
    },
    {
      id: 'description',
      label: 'Descripción',
      render: (row) => (
        <span style={{
          display: 'inline-block',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {row.description}
        </span>
      )
    },
    {
      id: 'is_active',
      label: 'Estado',
      render: (row) => (
        <span style={{
          backgroundColor: row.is_active ? colors.status.success : colors.status.error,
          color: colors.neutral.white,
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: borderRadius.full,
          fontSize: typography.fontSize.sm,
        }}>
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      id: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Button
            variant="outline"
            size="small"
            onClick={() => handleEditProduct(row)}
            title="Editar"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => handleDeleteConfirm(row)}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Container maxWidth="xl">
      {alert && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Card>
        <div style={{ padding: spacing.xl }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.xl
          }}>
            <h2 style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.semibold,
              margin: 0
            }}>
              Gestión de Platillos y Bebidas
            </h2>
            <Button
              variant="primary"
              onClick={handleCreateProduct}
            >
              <Plus size={18} />
              Crear Nuevo
            </Button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.lg,
            marginBottom: spacing.xl
          }}>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && buscarProductos()}
                fullWidth
              />
              <Button
                variant="outline"
                onClick={buscarProductos}
              >
                <Search size={18} />
              </Button>
            </div>

            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button
                variant={filtroTipo === "" ? "primary" : "outline"}
                onClick={() => {
                  setFiltroTipo("")
                  fetchProductos(1, elementosPorPagina, searchTerm, "")
                }}
                fullWidth
              >
                Todos
              </Button>
              <Button
                variant={filtroTipo === "COMIDA" ? "primary" : "outline"}
                onClick={() => {
                  setFiltroTipo("COMIDA")
                  fetchProductos(1, elementosPorPagina, searchTerm, "COMIDA")
                }}
                fullWidth
              >
                <Utensils size={16} />
                Comidas
              </Button>
              <Button
                variant={filtroTipo === "BEBIDA" ? "primary" : "outline"}
                onClick={() => {
                  setFiltroTipo("BEBIDA")
                  fetchProductos(1, elementosPorPagina, searchTerm, "BEBIDA")
                }}
                fullWidth
              >
                <Coffee size={16} />
                Bebidas
              </Button>
            </div>
          </div>

          <div style={{ marginBottom: spacing.xl }}>
            <Input
              type="select"
              label="Elementos por página"
              value={elementosPorPagina}
              onChange={(e) => cambiarElementosPorPagina(Number(e.target.value))}
              style={{ width: '200px' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>

          <Table
            columns={columns}
            data={productos}
            loading={loading}
            striped
            hoverable
          />

          {!loading && totalElementos > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacing.lg
            }}>
              <span style={{
                color: colors.neutral.gray,
                fontSize: typography.fontSize.sm
              }}>
                Mostrando {indiceInicial} a {indiceFinal} de {totalElementos} productos
              </span>
              <div style={{ display: 'flex', gap: spacing.xs }}>
                <Button
                  variant="outline"
                  size="small"
                  onClick={irAPaginaAnterior}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </Button>
                {generarNumerosPagina().map((numeroPagina) => (
                  <Button
                    key={numeroPagina}
                    variant={paginaActual === numeroPagina ? "primary" : "outline"}
                    size="small"
                    onClick={() => irAPagina(numeroPagina)}
                  >
                    {numeroPagina}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="small"
                  onClick={irAPaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de formulario */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={productToEdit ? "Editar Producto" : "Crear Nuevo Producto"}
        size="large"
      >
        <ProductForm
          product={productToEdit}
          onSave={handleSaveProduct}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirmar Eliminación"
        size="small"
      >
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: spacing.md,
          marginTop: spacing.xl
        }}>
          <Button
            variant="outline"
            onClick={() => setConfirmDelete(null)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteProduct}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </Container>
  );
}

export default AdminProductos;
