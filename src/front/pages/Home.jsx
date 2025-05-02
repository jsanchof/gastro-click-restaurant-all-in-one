import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import suhiSliderUrl from "../assets/img/Sushi-slider-1.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div
			className="p-5 text-center bg-image"
			style={{
				backgroundImage: 'url(https://insanelygoodrecipes.com/wp-content/uploads/2020/05/Sushi.jpg)',
				height: 600,
				backgroundSize: "cover",
				backgroundPosition: "center",
				position: "relative"
			}}
		>
			<div
				className="mask d-flex justify-content-center align-items-center h-100"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.39)" }}
			>
				<div className="text-white">
					<h1 className="mb-3 fw-bold">¡Bienvenido a Nuestro Restaurante!</h1>
					<p className="mb-4">
						Reserva tu mesa y disfruta una experiencia inolvidable
					</p>
					<Link to="/reservas">
						<a className="btn btn-danger btn-lg" href="#reservar">
							Reserva Aquí
						</a>
					</Link>
				</div>
			</div>
		</div>

	);
}; 