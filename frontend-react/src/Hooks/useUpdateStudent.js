import { useQueryClient, useMutation } from "@tanstack/react-query";
import apiFetch from "../api";

export function useUpdateStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn : ({ studentId, name }) => apiFetch(`http://localhost:8000/students/${studentId}`, {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({"name" : name})
        }).then((res) => {
            if(!res.ok) throw new Error(`Error while updating the student. Err : ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] })
        }

    })
}