import { useMutation } from "@tanstack/react-query"
import apiFetch from "../api"

export function useLogin() {
    return useMutation({
        mutationFn: ({ username, password }) => {
            return apiFetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
                method: "POST",
                headers: {"Content-Type" : "application/x-www-form-urlencoded"},
                body: new URLSearchParams({ username, password })
            }).then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.detail || "Incorrect username or password.");
                }
                return res.json()
            })
        } 
    })
}