from databases import get_session
from fastapi import APIRouter, Depends, HTTPException
from models import Course, CourseIn, CourseOut, Enrollment, EnrollmentWithStudent, User
from routers.auth import get_current_user
from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix = "/courses", tags = ["courses"])

@router.post("/", status_code = 201, response_model = CourseOut)
async def create_course(course : CourseIn, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    new_course = Course(
        name = course.name,
        instructor_name = course.instructor_name,
        department = course.department,
        credits = course.credits,
        max_capacity = course.max_capacity
    )
    session.add(new_course)
    await session.commit()
    await session.refresh(new_course)
    return new_course

@router.get("/{course_id}", response_model = CourseOut)
async def get_course(course_id : int, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_course = await session.get(Course, course_id)
    if not db_course:
        raise HTTPException(status_code = 404, detail = "The course ID doesnt exist")
    return db_course

@router.put("/{course_id}", response_model = CourseOut)
async def update_course(course_id : int, course : CourseIn, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_course = await session.get(Course, course_id)
    if not db_course:
        raise HTTPException(status_code = 404, detail = "The course ID doesnt exist")
    db_course.name = course.name
    db_course.instructor_name = course.instructor_name
    db_course.department = course.department
    db_course.credits = course.credits
    db_course.max_capacity = course.max_capacity
    session.add(db_course)
    await session.commit()
    await session.refresh(db_course)
    return db_course

@router.delete("/{course_id}", status_code = 204, response_model = None)
async def delete_course(course_id : int, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_course = await session.get(Course, course_id)
    if not db_course:
        raise HTTPException(status_code = 404, detail = "The course ID doesnt exist")
    enrollments = await session.exec(
        select(Enrollment).where(Enrollment.course_id == course_id)
    )
    for enrollment in enrollments: #enrollment has course as a foreign key - can not be empty.
        await session.delete(enrollment)
    await session.delete(db_course)
    await session.commit()

@router.get("/{course_id}/students", response_model = list[EnrollmentWithStudent])
async def get_enrolled_students(course_id : int, session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)):
    db_course = await session.get(Course, course_id)
    if not db_course:
        raise HTTPException(status_code = 404, detail = "The course ID doesnt exist")
    enrollments = await session.exec(
        select(Enrollment)
        .where(Enrollment.course_id == course_id)
        .options(selectinload(Enrollment.student))
    )
    enrollments = enrollments.all()
    return enrollments
    

@router.get("/", response_model = list[CourseOut])
async def get_all_courses(session : AsyncSession = Depends(get_session), current_user : User = Depends(get_current_user)): 
    db_courses = await session.exec(select(Course))
    db_courses = db_courses.all()
    return db_courses
