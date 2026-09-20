import { useStudents } from "../Hooks/useStudents";
import StudentList from "../List/StudentList";
import StudentManager from "../Manager/StudentManager";

function StudentsPage() {

    const { students, isLoading, error } = useStudents();

    return (
        <>
            {isLoading ? (
                <p className="status-message">Loading students...</p>
            ) : error ? (
                <p className="error">{`Error while fetching: ${error}`}</p>
            ) : (
                <>
                    <h2>Create Student:</h2>
                    <StudentManager students={students} />

                    <h2>Student List:</h2>
                    <p className="list-caption">Click a student to view their details and enrolled courses.</p>
                    <StudentList students={students} />
                </>
            )}
        </>
    )

}

export default StudentsPage