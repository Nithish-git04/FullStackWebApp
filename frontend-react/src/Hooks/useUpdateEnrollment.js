import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiFetch from "../api"

export function useUpdateEnrollment() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ enrollmentId, studentId, courseId, grade }) => apiFetch(`${import.meta.env.VITE_API_URL}/enrollments/${enrollmentId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                student_id: Number(studentId),
                course_id: Number(courseId),
                grade: Number(grade)
            })
        }).then((res) => {
            if(!res.ok) throw new Error(`Error while updating the enrollment. Err: ${res.status}`)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
        }
    })
}