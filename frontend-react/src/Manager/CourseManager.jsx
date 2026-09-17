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
                <button type="submit"> Submit </button>
                {error && <p>{`Error while posting! Detail: ${error}`}</p>}
            </form>
        </>
    )

}

export default CourseManager;