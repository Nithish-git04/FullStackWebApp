from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, courses, enrollments, students

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://localhost:5173"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(auth.router)
