import { useState } from "react";
import { useCreateCourse } from "../Hooks/useCreateCourse";
import { useForm } from "react-hook-form";

function CourseManager() {

    const { mutate, error } = useCreateCourse();
    const { register, handleSubmit, reset } = useForm();

    function onSubmit(formData) {
        mutate(formData, {
           onSuccess: () => reset()
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="inpname">Name:</label>
                <input id="inpname" {...register("name")}/>
                <label htmlFor="inpinstructor">Instructor Name:</label>
                <input id="inpinstructor" {...register("instructor_name")}/>
                <label htmlFor="inpdept">Department:</label>
                <input id="inpdept" {...register("department")}/>
                <label htmlFor="inpcredits">Credits:</label>
                <input id="inpcredits" type="number" min="1" max="10" {...register("credits", { valueAsNumber: true })}/>
                <label htmlFor="inpcapacity">Max Capacity:</label>
                <input id="inpcapacity" type="number" min="1" {...register("max_capacity", { valueAsNumber: true })}/>
                <button type="submit"> Submit </button>
                {error && <p>{`Error while posting! Detail: ${error}`}</p>}
            </form>
        </>
    )

}

export default CourseManager;