from databases import get_session
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from models import User, UserIn, UserOut
from security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix = "/auth", tags = ["auth"])

@router.post("/signup", response_model = UserOut, status_code = 201)
async def create_user(userin : UserIn, session : AsyncSession = Depends(get_session)):

    existing = await session.exec(select(User).where(User.username == userin.username))
    existing = existing.first()

    if existing:
        raise HTTPException(status_code = 400, detail = "The username already exists")

    hashed = hash_password(userin.password)
    new_user = User(
        username = userin.username,
        hashed_password = hashed
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user

@router.post("/token")
async def login(form_data : OAuth2PasswordRequestForm = Depends(), session : AsyncSession = Depends(get_session)):
    user = await session.exec(select(User).where(User.username == form_data.username))
    user = user.first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code = 401,
            detail = "The username or the password is incorrect",
            headers = {"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token(subject = user.username)
    return {"access_token" : token, "token_type" : "bearer"}

oauth_scheme = OAuth2PasswordBearer(tokenUrl = "auth/token") #This gets the token from the header.
async def get_current_user(
        token : str = Depends(oauth_scheme),
        session : AsyncSession = Depends(get_session),
    ) -> User:
    credentialsError = HTTPException(
        status_code = 401,
        detail = "Could not validate the credentials",
        headers = {"WWW-Authenticate" : "Bearer"}
    )
    try:
        username = decode_access_token(token)
    except InvalidTokenError:
        raise credentialsError

    user = await session.exec(select(User).where(User.username == username))
    user = user.first()
    if not user:
        raise credentialsError

    return user
    