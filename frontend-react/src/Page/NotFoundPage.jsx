import { Link } from "react-router"

function NotFoundPage() {
    return (
        <>
            <p>Page not found</p>
            <Link to="/students">Back to students</Link>
        </>
    )
}

export default NotFoundPage