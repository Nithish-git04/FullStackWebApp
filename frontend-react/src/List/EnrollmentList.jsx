import { useState } from "react";
import { useDeleteEnrollment } from "../Hooks/useDeleteEnrollment";
import { useUpdateEnrollment } from "../Hooks/useUpdateEnrollment";
import { useForm } from "react-hook-form";

function EnrollmentList({ enrollments }) {
    const [editId, setEditId] = useState(null);
    const { mutate: updateEnrollment, error: updateError } = useUpdateEnrollment();
    const { mutate: deleteEnrollment } = useDeleteEnrollment();
    const { register, handleSubmit, reset } = useForm();

    function onSubmit(formData) {
        updateEnrollment(
            {
                enrollmentId: editId,
                studentId: formData.studentId,
                courseId: formData.courseId,
                grade: formData.grade
            },
            {
                onSuccess: () => {
                    setEditId(null);
                    reset();
                }
            }
        );
    }

    return (
        <ul>
            {enrollments.length === 0 ? (
                <li className="status-message">No enrollments yet</li>
            ) : (
                enrollments.map((enrollment) => (
                    <li key = {enrollment.id}>
                        {editId === enrollment.id ? (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="studId">Student Id:</label>
                                <input id="studId" type="number" {...register("studentId")} />
                                <label htmlFor="courId">Course Id:</label>
                                <input id="courId" type="number" {...register("courseId")} />
                                <label htmlFor="grade">Grade:</label>
                                <input id="grade" type="number" min="0" max="100" {...register("grade")} />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => { setEditId(null); reset(); }}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <>
                                {`${enrollment.student.name} (Student ID: ${enrollment.student_id}) is enrolled in ${enrollment.course.name} (Course ID: ${enrollment.course_id}) with a grade of ${enrollment.grade} (${enrollment.letter_grade})`}
                                <button onClick={() => {
                                    setEditId(enrollment.id);
                                    reset({
                                        studentId: enrollment.student_id,
                                        courseId: enrollment.course_id,
                                        grade: enrollment.grade
                                    });
                                }}>Edit</button>
                            </>
                        )}
                        <button
                            className="btn-danger"
                            onClick={() => {
                                if (window.confirm(`Delete this enrollment (student ${enrollment.student_id}, course ${enrollment.course_id})? This cannot be undone.`)) {
                                    deleteEnrollment(enrollment.id);
                                }
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))
            )}
            {updateError && <li>{updateError.message}</li>}
        </ul>
    );
}

export default EnrollmentList