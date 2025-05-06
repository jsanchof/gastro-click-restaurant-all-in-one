import { Link, useNavigate } from "react-router-dom"

function Navbar({ toggleSidebar, toggleUserType }) {
  const navigate = useNavigate()

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
          <div className="dropdown me-2">
            {/* <button
              className="btn btn-outline-dark dropdown-toggle"
              type="button"
              id="modeDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Cambiar Modo
            </button> */}
            <ul className="dropdown-menu" aria-labelledby="modeDropdown">
              <li>
                <button className="dropdown-item" onClick={toggleUserType}>
                  Modo Admin
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => navigate("/kitchen")}>
                  Modo Cocina
                </button>
              </li>
            </ul>
          </div>
          <div className="p-2 rounded" style={{ backgroundColor: "#fff", color: " #0b2139" }}>
            <i className="fa-regular fa-circle-user"></i>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar