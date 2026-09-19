import { showError, showLoading } from "./ui.js";
import { BASEURL } from "./config.js";

async function getStudent(id, token) {
    try{

        const response = await fetch(`${BASEURL}students/${id}`, {
            headers : {"Authorization" : `bearer ${token}`}    
        });

        if(!response.ok) throw new Error(response.status);

        const responseData = await response.json();    
        return responseData.name;

    } catch(err) {
        console.log(err);
    }

}

export async function createEntity(data, token, entity, func) {
    try {

        showLoading("#main-div");

        const response = await fetch(`${BASEURL}${entity}/`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `bearer ${token}`
            },
            body : JSON.stringify(data)
        })
        
        if(!response.ok) throw new Error(response.status);
        
        const mainDiv = document.querySelector("#main-div");
        mainDiv.innerHTML = "";

        const temp = entity.slice(0, -1);

        alert(`New ${temp} created!`);

        func(token);
        
    } catch(err) {
        showError("#main-div");
        console.log(err);
    }
}

async function getStudentEnrollments(id, token, name) {
    try {
        
        showLoading("#stu-enr-div");
        
        const request = await fetch(`${BASEURL}students/${id}/courses`, {
            headers : {Authorization : `Bearer ${token}`}
        });
        
        if (!request.ok) throw new Error("wrong here");
        const responseData = await request.json();
        
        const enrDiv = document.querySelector("#stu-enr-div");
        enrDiv.textContent = "";

        const enrH2 = document.createElement('h3');
        enrH2.textContent = "The courses enrolled by the student " + name + " with the student ID: " + id;
        enrDiv.appendChild(enrH2);
        
        if(responseData.length !== 0) {

            responseData.forEach(item => {
                const tempDiv = document.createElement('div');
                const enrUl = document.createElement('ul');
                const grade = document.createElement('li');
                const course_id = document.createElement('li');

                tempDiv.dataset.id = item.id;

                course_id.textContent = "Course ID: " + item.course_id;
                grade.textContent = "Grade: " + item.grade + " (" + item.letter_grade + ")";

                enrUl.appendChild(course_id);
                enrUl.appendChild(grade);

                tempDiv.appendChild(enrUl);

                tempDiv.style.border = "2px solid black";
                tempDiv.style.borderRadius = "10px";
                tempDiv.style.maxWidth = "150px";
                tempDiv.style.display = "flex";
                tempDiv.style.alignItems = "center";

                enrDiv.appendChild(tempDiv);
            });
        } else {
            const emptyPara = document.createElement('p');
            emptyPara.textContent = "No enrollments yet!";
            enrDiv.appendChild(emptyPara);
        }
        
    } catch(err) {
        showError("#stu-enr-div");
        console.log(err);
    }
}

export async function getAllStudents(token) {
    try {
        
        showLoading("#all-stu-div");

        const response = await fetch(`${BASEURL}students/`, {
            headers : {Authorization : `Bearer ${token}`}
        });
        
        if(!response.ok) throw new Error(response.status); 
        
        const responseData = await response.json();
        
        let studentsList;
        
        if(!document.getElementById("students-list")) {
            studentsList = document.createElement('ul');
            studentsList.id = "students-list";
        } else {
            studentsList = document.querySelector("#students-list");
        }
        
        studentsList.innerHTML = "";
        const allStuDiv = document.querySelector("#all-stu-div");
        allStuDiv.innerHTML = "";
        const head = document.createElement('h2');
        head.textContent = "List of all students:";
        allStuDiv.appendChild(head);

        if(responseData.length !== 0) {
            responseData.forEach(item => {
                const tempListItem = document.createElement('li');
                tempListItem.textContent = `${item.id} : ${item.name}${item.email ? ` (${item.email})` : ""}${item.phone_number ? ` [${item.phone_number}]` : ""}`;
                tempListItem.dataset.id = item.id;

                tempListItem.addEventListener("click", () => {
                    getStudentEnrollments(tempListItem.dataset.id, token, item.name);
                });

                studentsList.appendChild(tempListItem);
            });
            allStuDiv.appendChild(studentsList);
        } else {
            const emptyPara = document.createElement('p');
            emptyPara.textContent = "No students yet!";
            allStuDiv.appendChild(emptyPara);
        }


    } catch(err) {
        showError("#all-stu-div");
        console.log(err);
    }
}

export async function createEnrollment(stuId, courId, grade, token) {
    try{

        showLoading("#enroll-div");
        document.querySelector("#stu-enr-div").innerHTML = "";

        const body = {"student_id" : stuId, "course_id" : courId, "grade" : grade}

        const response = await fetch(`${BASEURL}enrollments/`, {
            method : "POST",
            headers : {
                "Authorization" : `bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        })

        if(!response.ok) throw new Error(response.status);

        document.querySelector("#enroll-div").innerHTML = "";

        const name = await getStudent(stuId, token);
        getStudentEnrollments(stuId, token, name);

    } catch(err) {
        showError("#enroll-div");
        console.log(err);
    }
}

async function getEnrolledStudents(id, token, name) {
    try {

        showLoading("#enr-stu-div");

        const response = await fetch(`${BASEURL}courses/${id}/students`, {
            headers : {Authorization : `Bearer ${token}`}
        });

        if(!response.ok) throw new Error(response.status);
        const responseData = await response.json();

        const enrStuDIv = document.querySelector("#enr-stu-div");
        enrStuDIv.innerHTML = "";

        const enrH2 = document.createElement('h3');
        enrH2.textContent = `Students Enrolled in the course ${name} with course ID  ${id}`;
        enrStuDIv.appendChild(enrH2);

        if(responseData.length !== 0) {

            responseData.forEach(item => {
                const tempDiv = document.createElement('div');
                const enrUl = document.createElement('ul');
                const stuId = document.createElement('li');
                const grade = document.createElement('li');

                tempDiv.dataset.id = item.id;

                stuId.textContent = `Student ID: ${item.student_id}`;
                grade.textContent = `Grade : ${item.grade} (${item.letter_grade})`;

                enrUl.appendChild(stuId);
                enrUl.appendChild(grade);

                tempDiv.appendChild(enrUl);

                tempDiv.style.border = "2px solid black";
                tempDiv.style.borderRadius = "10px";
                tempDiv.style.maxWidth = "150px";
                tempDiv.style.display = "flex";
                tempDiv.style.alignItems = "center";

                enrStuDIv.appendChild(tempDiv);
            });
        } else {
            const emptyPara = document.createElement('p');
            emptyPara.textContent = "No students yet!";
            enrStuDIv.appendChild(emptyPara);
        }

    } catch(err) {
        showError("#enr-stu-div");
        console.log(err);
    }
}

export async function getAllCourses(token) {
    try {

        showLoading("#all-cour-div");

        const response = await fetch(`${BASEURL}courses/`, {
            headers : {Authorization : `Bearer ${token}`}
        });

        if(!response.ok) throw new Error(response.status);

        const responseData = await response.json();
        
        let coursesList;
        
        if(!document.getElementById("courses-list")) {
            coursesList = document.createElement('ul');
            coursesList.id = "courses-list";
        } else {
            coursesList = document.querySelector("#courses-list");
        }
        
        coursesList.innerHTML = "";
        const courDiv = document.querySelector("#all-cour-div");
        courDiv.innerHTML = "";
        const head = document.createElement('h2');
        head.textContent = "List of all courses:";
        courDiv.appendChild(head);

        if(responseData.length !== 0) {
            responseData.forEach(item => {
                const tempListItem = document.createElement('li');
                tempListItem.textContent = `${item.id} : ${item.name} (Instructor: ${item.instructor_name}, Dept: ${item.department}, Credits: ${item.credits}, Capacity: ${item.max_capacity})`;
                tempListItem.dataset.id = item.id;

                tempListItem.addEventListener("click", () => {
                    getEnrolledStudents(tempListItem.dataset.id, token, item.name);
                });

                coursesList.appendChild(tempListItem);
            });
            courDiv.appendChild(coursesList); 
        } else {
            const emptyPara = document.createElement('p');
            emptyPara.textContent = "No courses yet!";
            courDiv.appendChild(emptyPara);
        }



    } catch(err) {
        showError("#all-cour-div");
        console.log(err);
    }
}
