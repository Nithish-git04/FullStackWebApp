import CourseList from "../List/CourseList";
import CourseManager from "../Manager/CourseManager";
import { useCourses } from "../Hooks/useCourses";

function CoursesPage() {
    const { courses, isLoading, error } = useCourses();

    return (
        <>
            {isLoading ? (
                <p className="status-message">Loading courses...</p>
            ) : error ? (
                <p className="error">{`Error while fetching: ${error}`}</p>
            ) : (
                <>
                    <h2>Create Course:</h2>
                    <CourseManager />

                    <h2>Course List:</h2>
                    <p className="list-caption">Click a course to view its details and enrolled students.</p>
                    <CourseList courses={courses} />
                </>
            )}
        </>
    )
}

export default CoursesPage