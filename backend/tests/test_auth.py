import pytest

async def test_signup(client):
    response = await client.post("/auth/signup", json={
        "username": "Nithish123",
        "password": "Password123"
    })

    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "Nithish123"

async def test_signin(client):
    signup_response = await client.post("/auth/signup", json={
        "username": "Nithish123",
        "password": "Password123"
    })

    assert signup_response.status_code == 201
    signup_data = signup_response.json()
    assert signup_data["username"] == "Nithish123"

    signin_response = await client.post("/auth/token", data={
        "username": "Nithish123",
        "password": "Password123"
    })    

    assert signin_response.status_code == 200
    signin_data = signin_response.json()
    assert "access_token" in signin_data
    assert signin_data["token_type"] == "bearer"


async def test_signup_duplicate_username(client):
    payload = {
        "username": "Nithish123",
        "password": "Password123",
    }
    await client.post("/auth/signup", json=payload)

    response = await client.post("/auth/signup", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "The username already exists"


async def test_signup_rejects_short_username(client):
    response = await client.post(
        "/auth/signup",
        json={"username": "user", "password": "Password123"},
    )

    assert response.status_code == 422


async def test_signup_rejects_short_password(client):
    response = await client.post(
        "/auth/signup",
        json={"username": "Nithish123", "password": "short"},
    )

    assert response.status_code == 422


async def test_signup_requires_username_and_password(client):
    response = await client.post("/auth/signup", json={})

    assert response.status_code == 422


async def test_signin_unknown_username(client):
    response = await client.post(
        "/auth/token",
        data={"username": "UnknownUser", "password": "Password123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "The username or the password is incorrect"
    assert response.headers["www-authenticate"] == "Bearer"


async def test_signin_wrong_password(client):
    await client.post(
        "/auth/signup",
        json={"username": "Nithish123", "password": "Password123"},
    )

    response = await client.post(
        "/auth/token",
        data={"username": "Nithish123", "password": "WrongPassword"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "The username or the password is incorrect"
    assert response.headers["www-authenticate"] == "Bearer"


async def test_signin_requires_form_fields(client):
    response = await client.post("/auth/token", data={})

    assert response.status_code == 422
