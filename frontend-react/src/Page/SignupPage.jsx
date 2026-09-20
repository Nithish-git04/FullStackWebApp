import { useState } from "react";
import { useNavigate, Link } from "react-router";

function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const canSubmit = username.trim() !== "" && password.trim() !== "";

    async function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Signup failed.");
            }

            navigate("/");
        } catch (err) {
            setError(err.message || "Signup failed.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <h2>Sign up:</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="signup-username">Username:</label>
                <input
                    id="signup-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="signup-password">Password:</label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={isSubmitting || !canSubmit}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <p className="auth-hint">
                Already have an account? <Link to="/">Login</Link>
            </p>
        </>
    );
}

export default SignupPage;
