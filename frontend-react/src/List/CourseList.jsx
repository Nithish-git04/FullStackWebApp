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
            { courseId: editId, name: formData.name },
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
                <li> "No courses yet" </li> :
                courses.map((course) => (
                    <li key = {course.id}>
                        {editId === course.id ? (
                            <>  
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <input {...register("name")}/>
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => { setEditId(null); reset(); }}>
                                        Cancel
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link to={`/courses/${course.id}`}>{`Course: ${course.name}`}</Link>
                                <button onClick={() => { setEditId(course.id); reset({ name: course.name }); }}>
                                    Edit
                                </button>
                            </>
                        )}
                        <button onClick={() => deleteCourse(course.id)}>Delete</button>
                    </li>
                ))
            }
            {updateError && <li>{updateError.message}</li>}
        </ul>
    );
}

export default CourseList