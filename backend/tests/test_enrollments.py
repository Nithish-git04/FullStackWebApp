import pytest

def course_payload(**overrides):
    payload = {
        "name": "Test Course",
        "instructor_name": "Dr. Smith",
        "department": "Math",
        "credits": 3,
        "max_capacity": 30,
    }
    payload.update(overrides)
    return payload


async def create_student_and_course(client):
    student_response = await client.post("/students/", json={"name": "Test Student"})
    course_response = await client.post("/courses/", json=course_payload())
    return student_response.json()["id"], course_response.json()["id"]


async def test_create_enrollment(client):
    student_id, course_id = await create_student_and_course(client)

    response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 92.5},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["student_id"] == student_id
    assert data["course_id"] == course_id
    assert data["grade"] == 92.5
    assert data["letter_grade"] == "A"


async def test_get_enrollment(client):
    student_id, course_id = await create_student_and_course(client)
    post_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 80},
    )
    enrollment_id = post_response.json()["id"]

    response = await client.get(f"/enrollments/{enrollment_id}")

    assert response.status_code == 200
    assert response.json()["grade"] == 80
    assert response.json()["letter_grade"] == "B"


async def test_get_all_enrollments(client):
    student_id, first_course_id = await create_student_and_course(client)
    second_course_response = await client.post(
        "/courses/", json=course_payload(name="Second Course")
    )
    second_course_id = second_course_response.json()["id"]
    await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": first_course_id, "grade": 75},
    )
    await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": second_course_id, "grade": 85},
    )

    response = await client.get("/enrollments/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {enrollment["grade"] for enrollment in data} == {75, 85}


async def test_update_enrollment(client):
    student_id, course_id = await create_student_and_course(client)
    post_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 70},
    )
    enrollment_id = post_response.json()["id"]

    response = await client.put(
        f"/enrollments/{enrollment_id}",
        json={"student_id": student_id, "course_id": course_id, "grade": 99},
    )

    assert response.status_code == 200
    assert response.json()["grade"] == 99


async def test_delete_enrollment(client):
    student_id, course_id = await create_student_and_course(client)
    post_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 70},
    )
    enrollment_id = post_response.json()["id"]

    response = await client.delete(f"/enrollments/{enrollment_id}")

    assert response.status_code == 204
    get_response = await client.get(f"/enrollments/{enrollment_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "The enrollment ID doesnt exist"


async def test_create_duplicate_enrollment(client):
    student_id, course_id = await create_student_and_course(client)
    payload = {"student_id": student_id, "course_id": course_id, "grade": 70}
    await client.post("/enrollments/", json=payload)

    response = await client.post("/enrollments/", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "The student is already enrolled in that course"


async def test_enrollment_missing_student_or_course(client):
    student_id, course_id = await create_student_and_course(client)
    missing_student = await client.post(
        "/enrollments/",
        json={"student_id": 9999, "course_id": course_id, "grade": 70},
    )
    missing_course = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": 9999, "grade": 70},
    )

    for response in (missing_student, missing_course):
        assert response.status_code == 404
        assert response.json()["detail"] == "Either student ID or course ID doesnt exist"


async def test_update_enrollment_missing_student_or_course(client):
    student_id, course_id = await create_student_and_course(client)
    post_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 70},
    )
    enrollment_id = post_response.json()["id"]
    missing_student = await client.put(
        f"/enrollments/{enrollment_id}",
        json={"student_id": 9999, "course_id": course_id, "grade": 70},
    )
    missing_course = await client.put(
        f"/enrollments/{enrollment_id}",
        json={"student_id": student_id, "course_id": 9999, "grade": 70},
    )

    for response in (missing_student, missing_course):
        assert response.status_code == 404
        assert response.json()["detail"] == "Either student ID or course ID doesnt exist"


async def test_enrollment_not_found_cases(client):
    get_response = await client.get("/enrollments/9999")
    update_response = await client.put(
        "/enrollments/9999",
        json={"student_id": 1, "course_id": 1, "grade": 70},
    )
    delete_response = await client.delete("/enrollments/9999")

    for response in (get_response, update_response, delete_response):
        assert response.status_code == 404
        assert response.json()["detail"] == "The enrollment ID doesnt exist"


async def test_letter_grade_boundaries(client):
    student_id, course_id = await create_student_and_course(client)

    expected = {90: "A", 80: "B", 70: "C", 60: "D", 59: "F"}
    for grade, letter in expected.items():
        response = await client.post(
            "/enrollments/",
            json={"student_id": student_id, "course_id": course_id, "grade": grade},
        )
        assert response.json()["letter_grade"] == letter
        await client.delete(f"/enrollments/{response.json()['id']}")


async def test_create_enrollment_rejects_when_course_is_full(client):
    course_response = await client.post("/courses/", json=course_payload(max_capacity=1))
    course_id = course_response.json()["id"]
    first_student = await client.post("/students/", json={"name": "Student One"})
    second_student = await client.post("/students/", json={"name": "Student Two"})

    filling_response = await client.post(
        "/enrollments/",
        json={"student_id": first_student.json()["id"], "course_id": course_id, "grade": 70},
    )
    assert filling_response.status_code == 201

    response = await client.post(
        "/enrollments/",
        json={"student_id": second_student.json()["id"], "course_id": course_id, "grade": 70},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "The course has reached its maximum capacity"


async def test_update_enrollment_rejects_moving_into_full_course(client):
    full_course_response = await client.post("/courses/", json=course_payload(name="Full Course", max_capacity=1))
    full_course_id = full_course_response.json()["id"]
    other_course_response = await client.post("/courses/", json=course_payload(name="Other Course"))
    other_course_id = other_course_response.json()["id"]

    first_student = await client.post("/students/", json={"name": "Student One"})
    second_student = await client.post("/students/", json={"name": "Student Two"})

    await client.post(
        "/enrollments/",
        json={"student_id": first_student.json()["id"], "course_id": full_course_id, "grade": 70},
    )
    second_enrollment = await client.post(
        "/enrollments/",
        json={"student_id": second_student.json()["id"], "course_id": other_course_id, "grade": 70},
    )
    second_enrollment_id = second_enrollment.json()["id"]

    response = await client.put(
        f"/enrollments/{second_enrollment_id}",
        json={"student_id": second_student.json()["id"], "course_id": full_course_id, "grade": 70},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "The course has reached its maximum capacity"


async def test_update_enrollment_allows_staying_in_same_full_course(client):
    course_response = await client.post("/courses/", json=course_payload(max_capacity=1))
    course_id = course_response.json()["id"]
    student_response = await client.post("/students/", json={"name": "Student One"})
    student_id = student_response.json()["id"]

    post_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 70},
    )
    enrollment_id = post_response.json()["id"]

    response = await client.put(
        f"/enrollments/{enrollment_id}",
        json={"student_id": student_id, "course_id": course_id, "grade": 95},
    )

    assert response.status_code == 200
    assert response.json()["grade"] == 95


async def test_enrollment_grade_must_be_between_zero_and_one_hundred(client):
    student_id, course_id = await create_student_and_course(client)

    low_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": -1},
    )
    high_response = await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": course_id, "grade": 101},
    )

    assert low_response.status_code == 422
    assert high_response.status_code == 422