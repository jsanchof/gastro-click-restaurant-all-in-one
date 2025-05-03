import { Outlet } from "react-router-dom"

export default function LayoutKitchen() {
    return (
        <div className="kitchen-layout">
            <Outlet />
        </div>
    )
}
