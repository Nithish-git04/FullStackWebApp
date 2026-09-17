import { useStudents } from "../Hooks/useStudents";
import StudentList from "../List/StudentList";
import StudentManager from "../Manager/StudentManager";

function StudentsPage() {

    const { students, isLoading, error } = useStudents();

    return (
        <>
            {isLoading ? (
                <p>Loading students...</p>
            ) : error ? (
                <p>{`Error while fetching: ${error}`}</p>
            ) : (
                <>
                    <h2>Create Student:</h2>
                    <StudentManager students={students} />

                    <h2>Student List:</h2>
                    <StudentList students={students} />
                </>
            )}
        </>
    )

}

export default StudentsPage