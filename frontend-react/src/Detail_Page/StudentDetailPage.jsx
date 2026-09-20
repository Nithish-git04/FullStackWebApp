import { Link, useParams } from "react-router";
import { useStudent } from "../Hooks/useStudent";

function StudentDetailPage() {
    const { id } = useParams();
    const { student, courses, errorStud, errorCour } = useStudent(id);

    if (!student && !errorStud) return <p className="status-message">Loading student details...</p>;

    return (
        <>

            <Link to="/students">Back to students</Link>

            <h3>Student Details:</h3>

            {errorStud ? (
                <p className="error">Error fetching student</p>
            ) : (
                <ul>
                    <li key={student.id}>{`Name: ${student.name}, Id: ${student.id}, Email: ${student.email ?? "N/A"}, Phone: ${student.phone_number ?? "N/A"}`}</li>
                </ul>
            )}

            <h3>Registered Courses:</h3>

            {errorCour ? (
                <p className="error">Error fetching Courses</p>
            ) : (
                <ul>
                    {courses.length === 0 ? (
                        <li className="status-message">No registrations yet</li>
                    ) : (
                        courses.map((enrollment) => (
                            <li key={enrollment.id}>{`${enrollment.course.name} (Course ID: ${enrollment.course_id}) — Grade: ${enrollment.grade} (${enrollment.letter_grade})`}</li>
                        ))
                    )}
                </ul>
            )}
        </>
    )
}

export default StudentDetailPage