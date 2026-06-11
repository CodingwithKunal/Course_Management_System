import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Setlogout } from "../../App/authSlice.js"
function Navbar() {
    const { isAuthenticated, user  } = useSelector(state => state.auth)
    const dispatch = useDispatch() 
    
    const handleLogout = () => {
        dispatch(Setlogout()) 
    }

    return (
        <nav className=" flex justify-evenly gap-5 py-2 bg-white/15 backdrop-blur-sm rounded-3xl border border-white   text-white w-1/2 mx-auto mt-5">
         <Link to= "/" className="text-lg font-bold ">LMS</Link> 
            <Link to= "/courses" className="text-lg">Courses</Link>

           { ! isAuthenticated ? (
            <>
                 <div className=" flex justify-center">
                    <Link to= "/login" className="text-lg">Log/</Link>
                    <Link to= "/register" className="text-lg">Register</Link>
                 </div>
               
            </>
           ) : (
               <>
                { user.role === "USER" && (
                    <Link to= "/dashboard" className="text-lg" > Dashboard </Link>
                ) }

                { user.role === "INSTRUCTOR" && (
                    <Link to= "/instructor/dashboard" className="text-lg" > Instructor </Link>
                )}

                { user.role === "ADMIN" && (
                    <Link to= "/admin" className="text-lg" > Admin </Link>
                )} 

                <Link onClick={handleLogout} className="text-lg text-bold ">Logout</Link>
               </>
           )}


        </nav>
    )
}
export default Navbar