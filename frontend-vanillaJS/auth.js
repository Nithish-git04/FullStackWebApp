import { showError, showLoading } from "./ui.js";
import { BASEURL } from "./config.js";
import { getAllCourses, getAllStudents, createEnrollment, createEntity } from "./api.js";

export async function signIn(username, password) {
    try {

        const mainDiv = document.querySelector('#main-div');
        mainDiv.innerHTML = "";

        showLoading("#main-div");

        const body = new URLSearchParams();
        body.append("username", username);
        body.append("password", password);

        const response = await fetch(`${BASEURL}auth/token`, {
            method : "POST", 
            headers : {"Content-Type" : "application/x-www-form-urlencoded"},
            body : body
        });

        if (!response.ok) throw new Error(response.status);

        const responseData = await response.json();

        const inpDiv = document.querySelector('#input-details');
        inpDiv.innerHTML = "";

        mainDiv.innerHTML = "";
        const getStudBt = document.createElement('button');
        const stuDiv = document.querySelector("#stu-div");
        getStudBt.innerHTML = "Get all students";
        stuDiv.appendChild(getStudBt);
        getStudBt.addEventListener("click", () => {
            getAllStudents(responseData.access_token);
        });

        const courDiv = document.querySelector('#cour-div');
        const getCourBt = document.createElement('button');
        getCourBt.innerHTML = "Get all the courses";
        courDiv.appendChild(getCourBt);
        getCourBt.addEventListener("click", () => {
            getAllCourses(responseData.access_token);
        });

        const createStuDiv = document.querySelector("#crea-stu-div");
        const createCourDiv = document.querySelector("#crea-cour-div");
        const createEnrollDiv = document.querySelector("#crea-enroll-div");

        createStuDiv.style.display = "flex";
        createCourDiv.style.display = "flex";
        createEnrollDiv.style.display = "flex";
    
        const createCourBtn = document.querySelector("#create-course-btn");
        const createStuBtn = document.querySelector("#create-user-btn");
        const createEnrBtn = document.querySelector("#enroll-btn");
        
        createEnrBtn.addEventListener("click", () => {
            const stuIdInp = document.querySelector("#stu-id-inp");
            const courIdInp = document.querySelector("#cour-id-inp");
            const gradeInp = document.querySelector("#grade-inp");

            const stuId = stuIdInp.value;
            const courId = courIdInp.value;
            const grade = gradeInp.value;

            createEnrollment(stuId, courId, grade, responseData.access_token);

            document.querySelector("#stu-id-inp").value = "";
            document.querySelector("#cour-id-inp").value = "";
            document.querySelector("#grade-inp").value = "";

        });
        createStuBtn.addEventListener("click", () => {
            const nameInput = document.querySelector("#create-user");
            const emailInput = document.querySelector("#create-user-email");
            const phoneInput = document.querySelector("#create-user-phone");
            const name = nameInput.value;
            const email = emailInput.value;
            const phone_number = phoneInput.value;

            createEntity({name, email : email || null, phone_number : phone_number || null}, responseData.access_token, "students", getAllStudents);
            document.querySelector("#create-user").value = "";
            document.querySelector("#create-user-email").value = "";
            document.querySelector("#create-user-phone").value = "";

        });
        createCourBtn.addEventListener("click", () => {
            const nameInput = document.querySelector("#create-course");
            const instructorInput = document.querySelector("#create-course-instructor");
            const departmentInput = document.querySelector("#create-course-department");
            const creditsInput = document.querySelector("#create-course-credits");
            const capacityInput = document.querySelector("#create-course-capacity");
            const name = nameInput.value;
            const instructor_name = instructorInput.value;
            const department = departmentInput.value;
            const credits = Number(creditsInput.value);
            const max_capacity = Number(capacityInput.value);

            createEntity({name, instructor_name, department, credits, max_capacity}, responseData.access_token, "courses", getAllCourses);
            document.querySelector("#create-course").value = "";
            document.querySelector("#create-course-instructor").value = "";
            document.querySelector("#create-course-department").value = "";
            document.querySelector("#create-course-credits").value = "";
            document.querySelector("#create-course-capacity").value = "";
        });

    } catch(err) {
        showError("#main-div");
        console.log(err);
    }
}

export async function signUp(username, password) {
    try {

        const data = {username, password};
        const response = await fetch(`${BASEURL}auth/signup`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(data)
            });

        if(!response.ok) throw new Error(response.status);

        const responseData = await response.json();
        console.log(responseData);
        alert("user created, proceed with login");

    } catch(err) {
        showError("#main-div");
        console.log(err);
    }
}
