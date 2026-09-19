import pytest


def course_payload(**overrides):
    payload = {
        "name": "M1",
        "instructor_name": "Dr. A",
        "department": "Math",
        "credits": 3,
        "max_capacity": 30,
    }
    payload.update(overrides)
    return payload


async def test_create_course(client):
    response = await client.post("/courses/", json=course_payload())

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Mathematics"
    assert data["instructor_name"] == "Dr. Smith"
    assert data["department"] == "Math"
    assert data["credits"] == 3
    assert data["max_capacity"] == 30


async def test_get_course(client):
    post_response = await client.post("/courses/", json=course_payload())
    course_id = post_response.json()["id"]

    response = await client.get(f"/courses/{course_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Mathematics"
    assert response.json()["department"] == "Math"


async def test_get_all_courses(client):
    await client.post("/courses/", json=course_payload(name="Mathematics"))
    await client.post("/courses/", json=course_payload(name="Science"))

    response = await client.get("/courses/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {course["name"] for course in data} == {"Mathematics", "Science"}


async def test_update_course(client):
    post_response = await client.post("/courses/", json=course_payload(name="Old Name"))
    course_id = post_response.json()["id"]

    response = await client.put(
        f"/courses/{course_id}",
        json=course_payload(
            name="Updated Name",
            instructor_name="Dr. Jones",
            department="Physics",
            credits=4,
            max_capacity=40,
        ),
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["instructor_name"] == "Dr. Jones"
    assert data["department"] == "Physics"
    assert data["credits"] == 4
    assert data["max_capacity"] == 40


async def test_delete_course(client):
    post_response = await client.post("/courses/", json=course_payload(name="Delete Me"))
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
    course_response = await client.post("/courses/", json=course_payload(name="Delete Me"))
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
    course_response = await client.post("/courses/", json=course_payload())
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
    assert {enrollment["letter_grade"] for enrollment in data} == {"A", "B"}


async def test_get_course_students_for_empty_course(client):
    course_response = await client.post("/courses/", json=course_payload(name="Empty Course"))
    course_id = course_response.json()["id"]

    response = await client.get(f"/courses/{course_id}/students")

    assert response.status_code == 200
    assert response.json() == []


async def test_course_not_found_cases(client):
    get_response = await client.get("/courses/9999")
    update_response = await client.put("/courses/9999", json=course_payload(name="Updated"))
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
    response = await client.post("/courses/", json=course_payload(name=""))

    assert response.status_code == 422


async def test_create_course_invalid_credits(client):
    response = await client.post("/courses/", json=course_payload(credits=0))

    assert response.status_code == 422


async def test_create_course_invalid_max_capacity(client):
    response = await client.post("/courses/", json=course_payload(max_capacity=0))

    assert response.status_code == 422
