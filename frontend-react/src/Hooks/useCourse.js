import { useQuery } from "@tanstack/react-query";
import apiFetch from "../api";

export function useCourse(id) {

    const { data : course, error : errCour } = useQuery({
        queryKey: ["course", id],
        queryFn: () => apiFetch(`http://localhost:8000/courses/${id}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch the courses. Err: ${res.status}`)
            return res.json()
        })
    })

    const { data : students, error : errStuds } = useQuery({
        queryKey: ["course", id, "students"],
        queryFn: () => apiFetch(`http://localhost:8000/courses/${id}/students`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch the registered students, Err: ${res.status}`)
            return res.json()
        })
    })

    return { course, students : students ?? [], errCour, errStuds };
}