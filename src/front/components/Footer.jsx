export const Footer = () => (

	<footer className="bg-light text-white pt-5 pb-3">
		<div className="container">
			<div className="row">
				
				{/* Logotipo y redes */}
				<div className="col-md-3 pe-5">
					<img
						src="https://images.seeklogo.com/logo-png/36/2/sushi-ponta-negra-logo-png_seeklogo-364847.png"
						alt="Logo"
						className="img-fluid"
						style={{ maxWidth: '100px', height: 'auto' }}
					/>
					<p className="text-black pt-3 pb-4">Quieres hacer una reservación? Llámanos y te atenderemos con gusto!</p>

					<div className="d-flex mt-3 gap-2 justify-content-start pb-5">
						<button className="btn border-0"><i className="social-icon fa-brands fa-instagram"></i></button>
						<button className="btn border-0"><i className="social-icon fa-brands fa-facebook-f"></i></button>
						<button className="btn border-0"><i className="social-icon fa-brands fa-twitter"></i></button>
						<button className="btn border-0"><i className="social-icon fa-brands fa-youtube"></i></button>
					</div>
				</div>

				{/* Menú Inicio */}
				<div className="col-md-2 mb-4">
					<h6 className="fw-bold text-black">INICIO</h6>
					<ul className="list-unstyled">
						<li>
							<p className="text-secondary-emphasis text-decoration-none pt-3 pb-1">
								Menús
							</p>
						</li>
						<li>
							<p className="text-secondary-emphasis text-decoration-none pb-1">
								Llámanos
							</p>
						</li>
						<li>
							<p className="text-secondary-emphasis text-decoration-none pb-1">
								Pedidos a domicilio
							</p>
						</li>
						<li>
							<p className="text-secondary-emphasis text-decoration-none pb-1">
								Pide por WhatsApp
							</p>
						</li>
					</ul>
				</div>

				{/* Menú Nosotros */}
				<div className="col-md-2 mb-4">
					<h6 className="fw-bold text-black">NOSOTROS</h6>
					<ul className="list-unstyled">
						<li>
							<p className="text-secondary-emphasis text-decoration-none pt-3 pb-1">
								Trayectoria
							</p>
						</li>
						<li>
							<p className="text-secondary-emphasis text-decoration-none">
								Trabaja con Nosotros
							</p>
						</li>
					</ul>
				</div>

				{/* Menú Información */}
				<div className="col-md-2 mb-4">
					<h6 className="fw-bold text-black">INFORMACIÓN</h6>
					<ul className="list-unstyled">
						<li>
							<p className="text-secondary-emphasis text-decoration-none pt-3 pb-1">570 8th Ave, New York, NY 10018 United States</p>
						</li>
						<li>
							<h6 className="fw-bold text-black">HORARIO:</h6>
							<p className="text-secondary-emphasis">8:00 am - 10:30 pm <br /> Lunes a Domingo</p>
						</li>
					</ul>
				</div>

				{/* Apps */}
				<div className="col-md-2 mb-4 text-end invisible">
					<h6 className="text-black">INSTALA NUSTRA APP</h6>
					<a href="#">
						<img
							src="https://w7.pngwing.com/pngs/772/166/png-transparent-download-on-the-app-store-button.png"
							alt="App Store"
							style={{ width: 130 }}
						/>
					</a>
					<br />
					<br />
					<a href="#">
						<img
							src="https://impulseradargpr.com/wp-content/uploads/2021/07/google-play-badge.png"
							alt="Google Play"
							style={{ width: 130 }}
						/>
					</a>
				</div>
			</div>

			{/* Línea inferior */}
			<div className="row pt-3 border-top border-secondary mt-4 text-black">
				<div className="col-md-4">
					<small>Términos y condiciones</small>
				</div>
				<div className="col-md-4 text-center text-black">
					<small>
						Copyright 2025 |
						Hecho con <i className="fa fa-heart text-danger" /> por{" "}
						<a href="http://www.4geeksacademy.com">Alumnos 4Geeks Academy</a>
					</small>
				</div>
				<div className="col-md-4 text-end text-black">
					<small>Política de cookies</small>
				</div>
			</div>
		</div>
	</footer>

);
