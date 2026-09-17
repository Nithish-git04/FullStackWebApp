import apiFetch from "../api";
import { useQuery } from "@tanstack/react-query";

export function useCourses() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["courses"],
        queryFn: () => apiFetch('http://localhost:8000/courses/').then(res => {
            if (!res.ok) throw new Error(`Failed to fetch courses. Err: (${res.status})`)
            return res.json()
        })
    })

    return { courses: data ?? [], isLoading, error }
}