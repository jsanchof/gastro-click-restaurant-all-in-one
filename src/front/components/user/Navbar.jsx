import { Link, useNavigate } from "react-router-dom"

function Navbar({ toggleSidebar, toggleUserType }) {
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-warning">
      <div className="container-fluid">
        <button className="navbar-toggler border-0 me-2" type="button" onClick={toggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand fw-bold" to="/cliente/crear-orden">
          Dashboard del Cliente
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/crear-orden">
                Crear Orden
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cliente/mis-ordenes">
                Mis Órdenes
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
          <div className="bg-warning-subtle p-2 rounded">
            <i className="fa-regular fa-circle-user"></i>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar