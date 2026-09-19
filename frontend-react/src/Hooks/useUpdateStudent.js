import { useQueryClient, useMutation } from "@tanstack/react-query";
import apiFetch from "../api";

export function useUpdateStudent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn : ({ studentId, name, email, phone_number }) => apiFetch(`${import.meta.env.VITE_API_URL}/students/${studentId}`, {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({"name" : name, "email" : email, "phone_number" : phone_number})
        }).then((res) => {
            if(!res.ok) throw new Error(`Error while updating the student. Err : ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] })
        }

    })
}