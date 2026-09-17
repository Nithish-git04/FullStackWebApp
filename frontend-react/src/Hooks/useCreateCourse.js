import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useCreateCourse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newCourse) => apiFetch("http://localhost:8000/courses/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newCourse)
        }).then((res) => {
            if(!res.ok) throw new Error(`Failed to create a new course. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    })
}