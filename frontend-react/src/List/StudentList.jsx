import { Link } from "react-router";
import { useDeleteStudent } from "../Hooks/useDeleteStudent";
import { useUpdateStudent } from "../Hooks/useUpdateStudent";
import { useForm } from "react-hook-form";
import { useState } from "react";

function StudentList({ students }) {

    const { mutate: updateStudent, error: updateError } = useUpdateStudent();
    const { mutate: deleteStudent } = useDeleteStudent();
    const { register, handleSubmit, reset } = useForm();
    const [editingId, setEditingId] = useState(null);

    function onSubmit(formData) {
        updateStudent(
            { studentId: editingId, name: formData.name },
            { onSuccess: () => {
                setEditingId(null);
                reset();
            }}
        );
    }

    return (
        <ul>
            {(students.length === 0) ? 
                <li> "No students yet" </li> : 
                students.map((student) => (
                    <li key={student.id}>
                    {editingId === student.id ? (
                        <>  
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <input {...register("name")}/>
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => { setEditingId(null); reset(); }}>
                                    Cancel
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link to={`/students/${student.id}`}>{`Name: ${student.name}`}</Link>
                            <button onClick={() => { setEditingId(student.id); reset({ name: student.name }); }}>
                                Edit
                            </button>
                        </>
                    )}
                    <button onClick={() => deleteStudent(student.id)}>Delete</button>
                    </li>
                ))}
            {updateError && <li>{updateError.message}</li>}
        </ul>
    );
}

export default StudentList