from sqlmodel import Field, Relationship, SQLModel


#student model
class StudentBase(SQLModel):
    name: str = Field(min_length = 2, max_length = 100)
    email: str | None = None
class StudentIn(StudentBase):
    pass
class StudentOut(StudentBase):
    id: int | None = None
class Student(StudentBase, table = True):
    id: int | None = Field(default = None, primary_key = True)
    enrollments : list["Enrollment"] = Relationship(back_populates = "student")


#course model
class CourseBase(SQLModel):
    name : str = Field(min_length = 1, max_length = 100)
class CourseIn(CourseBase):
    pass
class CourseOut(CourseBase):
    id : int | None = None
class Course(CourseBase, table = True):
    id : int | None = Field(default = None, primary_key = True)
    enrollments : list["Enrollment"] = Relationship(back_populates = "course")


#enrollment model
class EnrollmentBase(SQLModel):
    grade : float = Field(ge = 0.0, le = 100.0)
    student_id : int
    course_id : int
class EnrollmentIn(EnrollmentBase):
    pass
class EnrollmentOut(EnrollmentBase):
    id : int | None = None
class EnrollmentWithStudent(EnrollmentOut):
    student : StudentOut
class EnrollmentWithCourse(EnrollmentOut):
    course : CourseOut
class Enrollment(EnrollmentBase, table = True):
    id : int | None = Field(default = None, primary_key = True)
    student_id : int = Field(foreign_key = "student.id")
    course_id : int = Field(foreign_key = "course.id")
    student : Student = Relationship(back_populates = "enrollments")
    course : Course = Relationship(back_populates = "enrollments")

#user credentials model
class UserBase(SQLModel):
    username : str = Field(min_length = 5, unique = True, index = True)
class UserIn(UserBase):
    password : str = Field(min_length = 8)
class UserOut(UserBase):
    id : int 
class User(UserBase, table = True):
    id : int | None = Field(primary_key = True, default = None)
    hashed_password : str