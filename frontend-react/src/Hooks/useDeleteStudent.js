import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useDeleteStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (studentId) => apiFetch(`http://localhost:8000/students/${studentId}`, {
            method : "DELETE",
        }).then((res) => {
            if(!res.ok) throw new Error(`Failed to delete the student. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] })
        }
  })
}