import { useParams, Link } from "react-router";
import { useCourse } from "../Hooks/useCourse";

function CourseDetailPage() {

    const { id } = useParams();
    const { course, students, errCour, errStuds } = useCourse(id);

    if(!course && !errCour) return <p>Loading course details...</p>

    return( 
        <>

            <Link to="/courses">Back to courses</Link>

            <h3>Course Details:</h3>

            {errCour ? (
                <p>Error fetching Course</p>
            ) : (
                <ul>
                    <li key={course.id}>{`Name: ${course.name}, Id: ${id}, Instructor: ${course.instructor_name}, Department: ${course.department}, Credits: ${course.credits}, Capacity: ${course.max_capacity}`}</li>
                </ul>
            )}

            <h3>Registered Students:</h3>

            {errStuds ? (
                <p>Error fetching Students</p>
            ) : (
                <ul>
                    {students.length === 0 ? (
                        <li>No registrations yet</li>
                    ) : (
                        students.map((enrollment) => (
                            <li key={enrollment.id}>{`Student ID: ${enrollment.student_id} -> ${enrollment.student.name} -> Grade: ${enrollment.grade} (${enrollment.letter_grade})`}</li>
                        ))
                    )}
                </ul>
            )}
        </>
    )
}

export default CourseDetailPage