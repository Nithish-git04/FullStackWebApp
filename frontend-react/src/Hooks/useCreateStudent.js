import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useCreateStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newStudent) => apiFetch("http://localhost:8000/students/", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(newStudent)
        }).then((res) => {
            if(!res.ok) throw new Error(`Failed to create a new student. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] })
        }
  })
}