import pytest

async def test_create_course(client):
    response = await client.post("/courses/", json={"name": "Mathematics"})

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Mathematics"


async def test_get_course(client):
    post_response = await client.post("/courses/", json={"name": "Mathematics"})
    course_id = post_response.json()["id"]

    response = await client.get(f"/courses/{course_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Mathematics"


async def test_get_all_courses(client):
    await client.post("/courses/", json={"name": "Mathematics"})
    await client.post("/courses/", json={"name": "Science"})

    response = await client.get("/courses/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {course["name"] for course in data} == {"Mathematics", "Science"}


async def test_update_course(client):
    post_response = await client.post("/courses/", json={"name": "Old Name"})
    course_id = post_response.json()["id"]

    response = await client.put(
        f"/courses/{course_id}", json={"name": "Updated Name"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"


async def test_delete_course(client):
    post_response = await client.post("/courses/", json={"name": "Delete Me"})
    course_id = post_response.json()["id"]

    response = await client.delete(f"/courses/{course_id}")

    assert response.status_code == 204
    get_response = await client.get(f"/courses/{course_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "The course ID doesnt exist"


async def test_delete_course_removes_enrollments(client):
    student_response = await client.post(
        "/students/", json={"name": "Enrolled Student"}
    )
    course_response = await client.post("/courses/", json={"name": "Delete Me"})
    student_id = student_response.json()["id"]
    course_id = course_response.json()["id"]

    enrollment_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 90},
    )
    enrollment_id = enrollment_response.json()["id"]

    await client.delete(f"/courses/{course_id}")

    response = await client.get(f"/enrollments/{enrollment_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "The enrollment ID doesnt exist"


async def test_get_course_students(client):
    first_student = await client.post("/students/", json={"name": "Student One"})
    second_student = await client.post("/students/", json={"name": "Student Two"})
    course_response = await client.post("/courses/", json={"name": "Mathematics"})
    course_id = course_response.json()["id"]

    await client.post(
        "/enrollments/",
        json={
            "student_id": first_student.json()["id"],
            "course_id": course_id,
            "grade": 95,
        },
    )
    await client.post(
        "/enrollments/",
        json={
            "student_id": second_student.json()["id"],
            "course_id": course_id,
            "grade": 88.5,
        },
    )

    response = await client.get(f"/courses/{course_id}/students")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {enrollment["student"]["name"] for enrollment in data} == {
        "Student One",
        "Student Two",
    }


async def test_get_course_students_for_empty_course(client):
    course_response = await client.post("/courses/", json={"name": "Empty Course"})
    course_id = course_response.json()["id"]

    response = await client.get(f"/courses/{course_id}/students")

    assert response.status_code == 200
    assert response.json() == []


async def test_course_not_found_cases(client):
    get_response = await client.get("/courses/9999")
    update_response = await client.put("/courses/9999", json={"name": "Updated"})
    delete_response = await client.delete("/courses/9999")
    students_response = await client.get("/courses/9999/students")

    for response in (
        get_response,
        update_response,
        delete_response,
        students_response,
    ):
        assert response.status_code == 404
        assert response.json()["detail"] == "The course ID doesnt exist"


async def test_create_course_invalid_name(client):
    response = await client.post("/courses/", json={"name": ""})

    assert response.status_code == 422