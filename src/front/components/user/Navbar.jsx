import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { LogOut } from "lucide-react"

function Navbar({ toggleSidebar, toggleUserType }) {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()

  function handleLogout() {
    dispatch({ type: "logout" })
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#0b2139" }}>
      <div className="container-fluid">
        <button className="navbar-toggler border-0 me-2" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand" style={{ color: " #a9b9c9" }} to="/cliente/crear-orden">
          <i class="fa-solid fa-house-user"></i> Dashboard del Cliente
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-5">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/cliente/crear-orden">
                <i class="fa-solid fa-basket-shopping"></i> Crear Orden
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/cliente/mis-ordenes">
                <i class="fa-solid fa-cart-plus"></i> Mis Órdenes
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex">
          <div className="btn-group mx-2">
            <button type="button" className="p-2 btn rounded dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: "#fff", color: " #0b2139" }}>
              <i className="fa-regular fa-circle-user"></i>
            </button>
            <ul className="dropdown-menu list dropdown-menu-end">
              <li><button className="dropdown-item" onClick={() => navigate("/editar-perfil")}>
                Perfil</button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li><button className="dropdown-item text-danger" >
                <LogOut size={18} className="me-1" />
                {store.isAuthenticated && <span className="d-none d-md-inline" onClick={handleLogout}>Cerrar Sesión</span>}</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar