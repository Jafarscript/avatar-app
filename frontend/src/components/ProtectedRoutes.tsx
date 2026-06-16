import type { ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoutes = ({children}: ProtectedRouteProps) => {
    

    const token = localStorage.getItem("token");

    return token ? children : <Navigate to='/' />;
}

export default ProtectedRoutes