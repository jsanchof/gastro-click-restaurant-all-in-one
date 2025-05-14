import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { useState } from "react"
import useGlobalReducer from "../../hooks/useGlobalReducer"

function AdminNavbar({ toggleSidebar, toggleUserType }) {
  const {store, dispatch} = useGlobalReducer()

  function handleLogout() {
    dispatch({type: "logout"})
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#0b2139", color: "white" }}>
      <div className="container-fluid">
        <button className="navbar-toggler border-0 me-2" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand" style={{ color: " #a9b9c9" }} to="/admin">
          <i className="fa-solid fa-house-user"></i> Dashboard del Administrador
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-5">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin">
                <i className="fa-solid fa-basket-shopping"></i> Órdenes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin/usuarios">
                <i className="fa-solid fa-users"></i> Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin/reservas">
              <i className="fa-solid fa-calendar-days"></i> Reservas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/admin/productos">
                <i className="fa-solid fa-utensils"></i> Platillos y Bebidas
              </Link>
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-light d-flex align-items-center">
            <LogOut size={18} className="me-1" />
           {store.isAuthenticated &&  <span className="d-none d-md-inline" onClick={handleLogout}>Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
