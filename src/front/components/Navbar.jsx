import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<>
			{/* Menú superior */}
			<nav className="navbar navbar-light bg-light py-2 border-bottom">
				<div className="container justify-content-between">
					<div>
						<span className="fw-semibold"><i className="fa-solid fa-calendar-days text-success"></i> Realiza tu primera reserva y recibe un 10% de desc.</span>
					</div>

					<div className="d-flex">
						<form className="d-flex me-3" role="search">
							<input
								className="form-control me-2"
								type="search"
								placeholder="Buscar"
								aria-label="Buscar"
							/>
						</form>
						<Link to="/login">
							<button className="btn btn-outline-primary">Acceder a Cuenta</button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Menú principal */}
			<nav className="navbar navbar-light bg-light py-4">
				<div className="container">
					<Link to="/">
						<img
							src="https://images.seeklogo.com/logo-png/36/2/sushi-ponta-negra-logo-png_seeklogo-364847.png"
							alt="logo shushi"
							className="img-fluid"
							style={{ maxWidth: '80px', height: 'auto' }}
						/>
					</Link>
					<div>
						<nav className="navbar navbar-expand-lg navbar-light bg-light">
							<div className="container-fluid">

								<button
									className="navbar-toggler"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#navbarNav"
									aria-controls="navbarNav"
									aria-expanded="false"
									aria-label="Toggle navigation"
								>
									<span className="navbar-toggler-icon" />
								</button>
								<div
									className="collapse navbar-collapse justify-content-end"
									id="navbarNav"
								>
									<ul className="navbar-nav">
										<li className="nav-item fw-semibold pe-5">
											<Link to="/" className="text-decoration-none">
												<span className="nav-link active" aria-current="page">
													Inicio
												</span>
											</Link>
										</li>
										<li className="nav-item fw-semibold pe-5">
											<Link className="text-decoration-none">
												<span className="nav-link">
													Menú
												</span>
											</Link>
										</li>
										<li className="nav-item fw-semibold pe-5">
											<Link to="/nosotros" className="text-decoration-none">
												<span className="nav-link">
													Nosotros
												</span>
											</Link>


										</li>
										<li className="nav-item fw-semibold pe-5">
											<Link to="/contacto" className="text-decoration-none">
												<span className="nav-link">
													Contacto
												</span>
											</Link>
										</li>
									</ul>
								</div>
							</div>
						</nav>

					</div>
					<div className="ml-auto">
						<Link to="/reservas">
							<button className="btn bg-red">Reserva Aquí</button>
						</Link>
					</div>
				</div>
			</nav>
		</>

	);
};