import { Link } from "react-router-dom"
import { LogOut, Bell } from "lucide-react"

function KitchenNavbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/kitchen">
                    Vista de Cocina
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#kitchenNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="kitchenNavbar">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/kitchen">
                                Órdenes
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link" to="/kitchen/history">
                                Historial
                            </Link>
                        </li> */}
                    </ul>

                    <div className="d-flex align-items-center">
                        <button className="btn btn-outline-light position-relative me-3">
                            <Bell size={18} />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                3<span className="visually-hidden">notificaciones no leídas</span>
                            </span>
                        </button>

                        <div className="text-light me-3 d-none d-md-block">
                            <div>Cocinero: Juan Pérez</div>
                            <div className="small text-muted">Turno: 8:00 - 16:00</div>
                        </div>

                        <button className="btn btn-outline-danger d-flex align-items-center">
                            <LogOut size={18} className="me-1" />
                            <span className="d-none d-md-inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default KitchenNavbar
