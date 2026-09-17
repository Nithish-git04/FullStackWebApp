import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);

    if (!token) return <Navigate to="/" />;
    return children;
}

export default ProtectedRoute;