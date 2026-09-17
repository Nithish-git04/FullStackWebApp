import apiFetch from "../api";
import { useQuery } from "@tanstack/react-query"

export function useStudents() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["students"],
        queryFn: () => apiFetch('http://localhost:8000/students/').then(res => {
            if (!res.ok) throw new Error(`Failed to fetch students (${res.status})`)
            return res.json()
        })
    })

    return { students: data ?? [], isLoading, error }
}