from databases import get_session
from fastapi import APIRouter, Depends, HTTPException
from models import (
    Enrollment,
    EnrollmentWithCourse,
    Student,
    StudentIn,
    StudentOut,
    User,
)
from routers.auth import get_current_user
from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix = "/students", tags = ["students"])

@router.post("/", response_model = StudentOut, status_code = 201)
async def create_student(student : StudentIn, session: AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    new_student = Student(name=student.name)
    session.add(new_student)
    await session.commit()
    await session.refresh(new_student)
    return new_student

@router.get("/{student_id}", response_model = StudentOut)
async def get_student(student_id : int, session: AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_student = await session.get(Student, student_id)
    if not db_student:
        raise HTTPException(status_code = 404, detail = "The id does not exist")
    return db_student

@router.put("/{student_id}", response_model = StudentOut)
async def update_student(student_id : int, student : StudentIn, session: AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_student = await session.get(Student, student_id)
    if not db_student:
        raise HTTPException(status_code = 404, detail = "The id does not exist")
    db_student.name = student.name
    session.add(db_student)
    await session.commit()
    await session.refresh(db_student)
    return db_student

@router.delete("/{student_id}", status_code = 204)
async def delete_student(student_id : int, session: AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_student = await session.get(Student, student_id)
    if not db_student:
        raise HTTPException(status_code = 404, detail = "The id does not exist")
    await session.delete(db_student)
    await session.commit()

@router.delete("/", status_code = 204)
async def delete_all_students(session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    students = await session.exec(select(Student))
    for student in students:
        await session.delete(student)
    await session.commit()

@router.get("/", response_model = list[StudentOut])
async def get_all_students(session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    students = await session.exec(select(Student))
    return students

@router.get("/{student_id}/courses", response_model = list[EnrollmentWithCourse])
async def get_enrolled_classes(student_id : int, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_student = await session.get(Student, student_id)
    if not db_student:
        raise HTTPException(status_code = 404, detail = "The id does not exist")
    enrollments = await session.exec(
        select(Enrollment)
        .where(Enrollment.student_id == student_id)
        .options(selectinload(Enrollment.course))
    )
    enrollments = enrollments.all()
    return enrollments

