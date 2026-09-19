import apiFetch from "../api";
import { useQuery } from "@tanstack/react-query";

export function useEnrollments() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["enrollments"],
        queryFn: () => apiFetch(`${import.meta.env.VITE_API_URL}/enrollments/`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch enrollments (${res.status})`)
            return res.json()
        })
    })

    return { enrollments: data ?? [], isLoading, error }
}