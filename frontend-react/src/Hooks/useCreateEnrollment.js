import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useCreateEnrollment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newEnrollment) => apiFetch(`${import.meta.env.VITE_API_URL}/enrollments/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newEnrollment)
        }).then((res) => {
            if(!res.ok) throw new Error(`Failed to create a new enrollment. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
        }
    })
}