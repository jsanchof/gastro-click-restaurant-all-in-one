import { Outlet } from "react-router-dom"
import Navbar from "../components/user/Navbar"
import Sidebar from "../components/user/Sidebar"

export default function LayoutClient() {
    console.log("Ejecutando LayoutClient")
    return (
        <div className="app-container">
            <Navbar />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main className="content-area p-3 flex-grow-1">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}






