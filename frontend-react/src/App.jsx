import StudentsPage from "./Page/StudentsPage"
import CoursesPage from "./Page/CoursesPage"
import EnrollmentsPage from "./Page/EnrollmentsPage"
import StudentDetailPage from "./Detail_Page/StudentDetailPage"
import CourseDetailPage from "./Detail_Page/CourseDetailPage"
import NotFoundPage from "./Page/NotFoundPage"
import { Route, Routes, Link, useNavigate } from "react-router"
import LoginPage from "./Page/LoginPage"
import ProtectedRoute from "./ProtectedRoute"
import GuestRoute from "./GuestRoute"
import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import SignupPage from "./Page/SignupPage"

function App() {

  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <nav>
        <Link to="/students"> Students </Link>
        <Link to="/courses"> Courses </Link>
        <Link to="/enrollments"> Enrollments </Link>
        {token ? (
          <button onClick={() => handleLogout()}>Logout</button>
        ) : (
          <Link to="/">Login</Link>
        )}
        <Link to="/signup">Signup</Link>
      </nav>

      <Routes>
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>}/>
        <Route path="/" element={<GuestRoute><LoginPage /></GuestRoute>}/>
        <Route path="/students/:id" element={<ProtectedRoute><StudentDetailPage /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path="/enrollments" element={<ProtectedRoute><EnrollmentsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </>
  )
}

export default App