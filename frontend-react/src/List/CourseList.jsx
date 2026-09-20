import { Link } from "react-router";
import { useDeleteCourse } from "../Hooks/useDeleteCourse";
import { useUpdateCourse } from "../Hooks/useUpdateCourse";
import { useForm } from "react-hook-form";
import { useState } from "react";

function CourseList({ courses }) {

    const { mutate: updateCourse, error: updateError } = useUpdateCourse();
    const { mutate: deleteCourse } = useDeleteCourse();
    const { register, handleSubmit, reset } = useForm();
    const [editId, setEditId] = useState(null);

    function onSubmit(formData) {
        updateCourse(
            {
                courseId: editId,
                name: formData.name,
                instructor_name: formData.instructor_name,
                department: formData.department,
                credits: formData.credits,
                max_capacity: formData.max_capacity
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
            {courses.length === 0 ?
                <li className="status-message"> No courses yet </li> :
                courses.map((course) => (
                    <li key = {course.id}>
                        {editId === course.id ? (
                            <>  
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <input {...register("name")}/>
                                    <input {...register("instructor_name")}/>
                                    <input {...register("department")}/>
                                    <input type="number" min="1" max="10" {...register("credits")}/>
                                    <input type="number" min="1" {...register("max_capacity")}/>
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => { setEditId(null); reset(); }}>
                                        Cancel
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link to={`/courses/${course.id}`}>{`Course: ${course.name}, Instructor: ${course.instructor_name}, Dept: ${course.department}, Credits: ${course.credits}, Capacity: ${course.max_capacity}`}</Link>
                                <button onClick={() => { setEditId(course.id); reset({ name: course.name, instructor_name: course.instructor_name, department: course.department, credits: course.credits, max_capacity: course.max_capacity }); }}>
                                    Edit
                                </button>
                            </>
                        )}
                        <button
                            className="btn-danger"
                            onClick={() => {
                                if (window.confirm(`Delete the course "${course.name}"? This cannot be undone.`)) {
                                    deleteCourse(course.id);
                                }
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))
            }
            {updateError && <li>{updateError.message}</li>}
        </ul>
    );
}

export default CourseList