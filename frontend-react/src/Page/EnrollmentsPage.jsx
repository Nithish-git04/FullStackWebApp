import EnrollmentList from "../List/EnrollmentList";
import EnrollmentManager from "../Manager/EnrollmentManager";
import { useEnrollments } from "../Hooks/useEnrollments";

function EnrollmentsPage() {
    const { enrollments, isLoading, error } = useEnrollments();

    return (
        <>
            {isLoading ? (
                <p className="status-message">Loading enrollments...</p>
            ) : error ? (
                <p className="error">{`Error while fetching: ${error}`}</p>
            ) : (
                <>
                    <h2>Enroll a student:</h2>
                    <EnrollmentManager />

                    <h2>Enrollment List:</h2>
                    <EnrollmentList enrollments={enrollments} />
                </>
            )}
        </>
    )
}

export default EnrollmentsPage