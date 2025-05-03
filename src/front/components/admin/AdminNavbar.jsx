import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"

function AdminNavbar({ toggleSidebar, toggleUserType }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-warning">
      <div className="container-fluid">
        <button className="navbar-toggler border-0 me-2" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand fw-bold" to="/admin">
          Dashboard del Administrador
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Órdenes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/usuarios">
                Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/productos">
                Platillos y Bebidas
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          {/* <button className="btn btn-outline-dark me-2" onClick={toggleUserType}>
            Modo Cliente
          </button> */}
          <button className="btn btn-outline-danger d-flex align-items-center">
            <LogOut size={18} className="me-1" />
            <span className="d-none d-md-inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
