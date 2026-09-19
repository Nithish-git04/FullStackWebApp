import apiFetch from "../api";
import { useQuery } from "@tanstack/react-query";

export function useStudent(id) {

    const { data : student, error : errorStud } = useQuery({
        queryKey: ["student", id],
        queryFn: () => apiFetch(`${import.meta.env.VITE_API_URL}/students/${id}`).then((res) => {
            if (!res.ok) throw new Error(`Error while fetching the student. Err: ${res.status}`)
            return res.json()
        })
    })

    const { data : courses, error : errorCour } = useQuery({
        queryKey: ["student", id, "courses"],
        queryFn: () => apiFetch(`${import.meta.env.VITE_API_URL}/students/${id}/courses`).then((res) => {
            if (!res.ok) throw new Error(`Error while fetching the registered courses. Err: ${res.status}`)
            return res.json()
        })
    })

    return { student, courses : courses ?? [], errorStud, errorCour };
}