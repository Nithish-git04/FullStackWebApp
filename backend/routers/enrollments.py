from databases import get_session
from fastapi import APIRouter, Depends, HTTPException
from models import (
    Course,
    Enrollment,
    EnrollmentIn,
    EnrollmentOut,
    EnrollmentWithStudentAndCourse,
    Student,
    User,
)
from routers.auth import get_current_user
from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix = "/enrollments", tags = ["enrollments"])

@router.post("/", status_code = 201, response_model = EnrollmentOut)
async def create_entry(enrollment : EnrollmentIn, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_student_id = await session.get(Student, enrollment.student_id)
    db_course_id = await session.get(Course, enrollment.course_id)
    if not (db_course_id and db_student_id):
        raise HTTPException(status_code = 404, detail = "Either student ID or course ID doesnt exist")

    existing_enrollment = await session.exec(
        select(Enrollment).where(
            Enrollment.student_id == enrollment.student_id,
            Enrollment.course_id == enrollment.course_id
        )
    )
    existing_enrollment = existing_enrollment.first()

    if(existing_enrollment):
        raise HTTPException(status_code = 400, detail = "The student is already enrolled in that course")

    course_enrollments = await session.exec(
        select(Enrollment).where(Enrollment.course_id == enrollment.course_id)
    )
    if len(course_enrollments.all()) >= db_course_id.max_capacity:
        raise HTTPException(status_code = 400, detail = "The course has reached its maximum capacity")

    new_enrollment = Enrollment(
        grade = enrollment.grade, 
        student_id = enrollment.student_id, 
        course_id = enrollment.course_id
    )
    session.add(new_enrollment)
    await session.commit()
    await session.refresh(new_enrollment)
    return new_enrollment

@router.get("/{enrollment_id}", response_model = EnrollmentOut)
async def get_entry(enrollment_id : int, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_enrollment = await session.get(Enrollment, enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code = 404, detail = "The enrollment ID doesnt exist")
    return db_enrollment

@router.put("/{enrollment_id}")
async def update_entry(enrollment_id : int, enrollment : EnrollmentIn, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_enrollment = await session.get(Enrollment, enrollment_id)
    if not db_enrollment:
            raise HTTPException(status_code = 404, detail = "The enrollment ID doesnt exist")
    
    db_student_id = await session.get(Student, enrollment.student_id)
    db_course_id = await session.get(Course, enrollment.course_id)
    if not (db_course_id and db_student_id):
        raise HTTPException(status_code = 404, detail = "Either student ID or course ID doesnt exist")

    if enrollment.course_id != db_enrollment.course_id:
        course_enrollments = await session.exec(
            select(Enrollment).where(Enrollment.course_id == enrollment.course_id)
        )
        if len(course_enrollments.all()) >= db_course_id.max_capacity:
            raise HTTPException(status_code = 400, detail = "The course has reached its maximum capacity")

    db_enrollment.grade = enrollment.grade
    db_enrollment.student_id = enrollment.student_id
    db_enrollment.course_id = enrollment.course_id
    session.add(db_enrollment)
    await session.commit()
    await session.refresh(db_enrollment)
    return db_enrollment

@router.delete("/{enrollment_id}", status_code = 204, response_model = None)
async def delete_entry(enrollment_id : int, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_enrollment = await session.get(Enrollment, enrollment_id)
    if not db_enrollment:
            raise HTTPException(status_code = 404, detail = "The enrollment ID doesnt exist")
    await session.delete(db_enrollment)
    await session.commit()

@router.get("/", status_code = 200, response_model = list[EnrollmentWithStudentAndCourse])
async def get_all_enrollments(session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    enrollments = await session.exec(
        select(Enrollment)
        .options(selectinload(Enrollment.student), selectinload(Enrollment.course))
    )
    enrollments = enrollments.all()
    return enrollments