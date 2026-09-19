import apiFetch from "../api";
import { useQuery } from "@tanstack/react-query"

export function useStudents() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["students"],
        queryFn: () => apiFetch(`${import.meta.env.VITE_API_URL}/students/`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch students (${res.status})`)
            return res.json()
        })
    })

    return { students: data ?? [], isLoading, error }
}