import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useUpdateCourse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ courseId, name }) => apiFetch(`http://localhost:8000/courses/${courseId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name })
        }).then((res) => {
            if(!res.ok) throw new Error(`Error while updating the course. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })
}