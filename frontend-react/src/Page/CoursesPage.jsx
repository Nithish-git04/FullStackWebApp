import CourseList from "../List/CourseList";
import CourseManager from "../Manager/CourseManager";
import { useCourses } from "../Hooks/useCourses";

function CoursesPage() {
    const { courses, isLoading, error } = useCourses();

    return (
        <>
            {isLoading ? (
                <p>Loading courses...</p>
            ) : error ? (
                <p>{`Error while fetching: ${error}`}</p>
            ) : (
                <>
                    <h2>Create Course:</h2>
                    <CourseManager />

                    <h2>Course List:</h2>
                    <CourseList courses={courses} />
                </>
            )}
        </>
    )
}

export default CoursesPage