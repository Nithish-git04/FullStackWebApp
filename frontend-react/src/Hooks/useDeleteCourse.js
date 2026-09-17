import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useDeleteCourse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (courseId) => apiFetch(`http://localhost:8000/courses/${courseId}`, {
            method: "DELETE"
        }).then((res) => {
            if(!res.ok) throw new Error(`Failed to delete the course. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })
}