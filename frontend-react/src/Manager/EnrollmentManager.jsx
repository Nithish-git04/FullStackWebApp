import { useForm } from "react-hook-form";
import { useCreateEnrollment } from "../Hooks/useCreateEnrollment";

function EnrollmentManager() {
    const { mutate, error } = useCreateEnrollment();
    const { register, handleSubmit, reset } = useForm();

    function onSubmit(formData) {
        mutate(formData, {
           onSuccess: () => reset()
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="newStudentId">Student Id:</label>
                <input id="newStudentId" type="number" {...register("student_id", { valueAsNumber : true })}/>
                <label htmlFor="newCourseId">Course Id:</label>
                <input id="newCourseId" type="number" {...register("course_id", { valueAsNumber : true })}/>
                <label htmlFor="newGrade">Grade:</label>
                <input id="newGrade" type="number" min="0" max="100" {...register("grade", { valueAsNumber : true })}/>
                <button type="submit"> Submit </button>
                {error && <p>{`Error while posting! Detail: ${error}`}</p>}
            </form>
        </>
    );
}

export default EnrollmentManager;