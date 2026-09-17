from datetime import datetime, timedelta, timezone

import jwt
from config import settings
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hash_password(password : str) -> str:
    return password_hash.hash(password)

def verify_password(password : str, stored_hash : str) -> bool:
    return password_hash.verify(password, stored_hash)

def create_access_token(subject : str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes = settings.access_token_expire_minutes)
    payload = {
        "sub" : subject,
        "exp" : expire
    }
    return jwt.encode(payload, settings.secret_key, algorithm = settings.algorithm)

def decode_access_token(token : str) -> str:
    payload = jwt.decode(token, settings.secret_key, algorithms = [settings.algorithm])
    username = payload.get("sub")
    if username is None:
        raise InvalidTokenError("Token is invalid")
    return username
