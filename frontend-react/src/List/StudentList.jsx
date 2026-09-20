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
            { studentId: editingId, name: formData.name, email: formData.email, phone_number: formData.phone_number },
            { onSuccess: () => {
                setEditingId(null);
                reset();
            }}
        );
    }

    return (
        <ul>
            {(students.length === 0) ?
                <li className="status-message"> No students yet </li> :
                students.map((student) => (
                    <li key={student.id}>
                    {editingId === student.id ? (
                        <>  
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <input {...register("name")}/>
                                <input type="email" {...register("email")}/>
                                <input type="tel" {...register("phone_number")}/>
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => { setEditingId(null); reset(); }}>
                                    Cancel
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link to={`/students/${student.id}`}>{`Name: ${student.name}${student.email ? `, Email: ${student.email}` : ""}${student.phone_number ? `, Phone: ${student.phone_number}` : ""}`}</Link>
                            <button onClick={() => { setEditingId(student.id); reset({ name: student.name, email: student.email, phone_number: student.phone_number }); }}>
                                Edit
                            </button>
                        </>
                    )}
                    <button
                        className="btn-danger"
                        onClick={() => {
                            if (window.confirm(`Delete ${student.name}? This cannot be undone.`)) {
                                deleteStudent(student.id);
                            }
                        }}
                    >
                        Delete
                    </button>
                    </li>
                ))}
            {updateError && <li>{updateError.message}</li>}
        </ul>
    );
}

export default StudentList