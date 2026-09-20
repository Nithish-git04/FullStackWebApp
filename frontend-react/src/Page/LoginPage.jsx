import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router";
import { useLogin } from "../Hooks/useLogin";

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { mutate, error : errorLogin} = useLogin();

    const canSubmit = username.trim() !== "" && password.trim() !== "";

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        mutate(
            { username: username, password: password },
            { onSuccess: (data) => {
                login(data.access_token);
                navigate("/students")
            }}
        )
    }

    return (
        <>
            <h2>Login:</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" disabled={!canSubmit}>Submit</button>
            </form>

            {errorLogin && <p className="error">{errorLogin.message}</p>}

            <p className="auth-hint">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </>
    )
}

export default LoginPage