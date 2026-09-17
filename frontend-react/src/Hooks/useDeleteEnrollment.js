import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useDeleteEnrollment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (enrollmentId) => apiFetch(`http://localhost:8000/enrollments/${enrollmentId}`, {
            method: "DELETE"
        }).then((res) => {
            if(!res.ok) throw new Error(`Failed to delete the enrollment. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
        }
    })
}