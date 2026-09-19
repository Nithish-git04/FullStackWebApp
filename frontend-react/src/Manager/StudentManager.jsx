import { useCreateStudent } from "../Hooks/useCreateStudent";
import { useForm } from "react-hook-form";

function StudentManager() {

    const { register, handleSubmit, reset } = useForm();
    const { mutate, error } = useCreateStudent()

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
                <label htmlFor="inpemail">Email:</label>
                <input id="inpemail" type="email" {...register("email")}/>
                <label htmlFor="inpphone">Phone Number:</label>
                <input id="inpphone" type="tel" {...register("phone_number")}/>
                <button type="submit"> Submit </button>
                {error && <p>{ `Error while posting! Detail: ${error}` }</p>}
            </form>
        </>
    )
}

export default StudentManager