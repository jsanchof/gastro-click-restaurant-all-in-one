// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { RegisterPage } from "./pages/RegisterPage";
import { Contacto } from "./pages/Contacto";
import { LoginPage } from "./pages/LoginPage";
import { Nosotros } from "./pages/Nosotros"
import { Menu } from "./pages/Menu";
import { Reservas } from "./pages/Reservas"
import { EditarPerfil } from "./pages/EditarPerfil";
// Componente rutas protegidas
import ProtectedRoute from "./components/ProtectedRoute";
// Componentes Cliente
import LayoutClient from "./layouts/LayoutClient";
import CrearOrden from "./pages/user/CrearOrden";
import MisOrdenes from "./pages/user/MisOrdenes";
// Componentes Cocina
import KitchenView from "./pages/kitchen/KitchenView";
import LayoutKitchen from "./layouts/LayoutKitchen";
// Componentes Admin
import AdminOrdenes from "./pages/admin/AdminOrdenes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProductos from "./pages/admin/AdminProductos";
import LayoutAdmin from "./layouts/LayoutAdmin";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.
    <>
      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path="/" element={<Home />} />
        <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
      </Route>

      {/* Cliente */}
      <Route
        element={
          <ProtectedRoute requiredRole="client">
            <LayoutClient />
          </ProtectedRoute>
        }
      >
        <Route path="/cliente/crear-orden" element={<CrearOrden />} />
        <Route path="/cliente/mis-ordenes" element={<MisOrdenes />} />
      </Route>

      {/* Administrador */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminOrdenes />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
      </Route>

      {/* Cocina */}
      <Route
        element={
          <ProtectedRoute requiredRole="kitchen">
            <LayoutKitchen />
          </ProtectedRoute>
        }
      >
        <Route path="/kitchen" element={<KitchenView />} />
      </Route>
    </>
  )
);