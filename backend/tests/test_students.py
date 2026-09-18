import pytest

async def test_create_student(client):
    response = await client.post("/students/", json={"name": "Test Student"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Student"

async def test_get_student(client):
    post_response = await client.post("/students/", json={"name": "Test Student"})
    student_id = post_response.json()["id"]

    get_response = await client.get(f"/students/{student_id}")
    data = get_response.json()
    assert data["name"] == "Test Student"

async def test_get_all_students(client):
    await client.post("/students/", json={"name": "Student One"})
    await client.post("/students/", json={"name": "Student Two"})

    response = await client.get("/students/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {student["name"] for student in data} == {"Student One", "Student Two"}

async def test_update_student(client):
    post_response = await client.post("/students/", json={"name": "Old Name"})
    student_id = post_response.json()["id"]

    response = await client.put(f"/students/{student_id}", json={"name": "Updated Name"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"

async def test_delete_student(client):
    post_response = await client.post("/students/", json={"name": "Delete Me"})
    student_id = post_response.json()["id"]

    delete_response = await client.delete(f"/students/{student_id}")
    assert delete_response.status_code == 204

    get_response = await client.get(f"/students/{student_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == "The id does not exist"

async def test_delete_all_students(client):
    await client.post("/students/", json={"name": "Student One"})
    await client.post("/students/", json={"name": "Student Two"})

    response = await client.delete("/students/")
    assert response.status_code == 204

    get_response = await client.get("/students/")
    assert get_response.status_code == 200
    assert get_response.json() == []

async def test_get_student_not_found(client):
    response = await client.get("/students/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "The id does not exist"

async def test_update_student_not_found(client):
    response = await client.put("/students/9999", json={"name": "Updated Name"})
    assert response.status_code == 404
    assert response.json()["detail"] == "The id does not exist"

async def test_delete_student_not_found(client):
    response = await client.delete("/students/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "The id does not exist"

async def test_create_student_invalid_name(client):
    response = await client.post("/students/", json={"name": "A"})
    assert response.status_code == 422

async def test_get_student_courses(client):
    student_response = await client.post("/students/", json={"name": "Course Student"})
    student_id = student_response.json()["id"]

    math_response = await client.post("/courses/", json={"name": "Math"})
    science_response = await client.post("/courses/", json={"name": "Science"})

    await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": math_response.json()["id"], "grade": 95.0},
    )
    await client.post(
        "/enrollments/",
        json={"student_id": student_id, "course_id": science_response.json()["id"], "grade": 88.5},
    )

    response = await client.get(f"/students/{student_id}/courses")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {enrollment["course"]["name"] for enrollment in data} == {"Math", "Science"}