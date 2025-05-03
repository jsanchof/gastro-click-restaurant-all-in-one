// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requiredRole }) => {
    const userType = localStorage.getItem("userType") || 'admin' // "client", "admin", "kitchen"

    if (userType !== requiredRole) {
        switch (userType) {
            case "admin": return <Navigate to="/admin" />
            case "client": return <Navigate to="/cliente/crear-orden" />
            case "kitchen": return <Navigate to="/kitchen" />
            default: return <Navigate to="/" />
        }
    }

    return children
}

export default ProtectedRoute