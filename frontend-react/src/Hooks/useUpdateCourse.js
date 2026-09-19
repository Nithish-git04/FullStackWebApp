import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useUpdateCourse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ courseId, name, instructor_name, department, credits, max_capacity }) => apiFetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, instructor_name, department, credits: Number(credits), max_capacity: Number(max_capacity) })
        }).then((res) => {
            if(!res.ok) throw new Error(`Error while updating the course. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })
}