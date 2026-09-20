import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthContext";

function GuestRoute({ children }) {
    const { token } = useContext(AuthContext);

    if (token) return <Navigate to="/students" />;
    return children;
}

export default GuestRoute;
