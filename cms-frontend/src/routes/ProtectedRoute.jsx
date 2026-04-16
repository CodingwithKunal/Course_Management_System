import { useSelector } from "react-redux"
import { Navigate } from "react-router"

const ProtectedRoute = ({children, allowedRoles}) => {
  const {isAuthenticated, user} = useSelector((state) => state.auth)

  if(!isAuthenticated){
    return <Navigate to="/login"/>
  }
  if(allowedRoles && !allowedRoles.includes(user?.role)){
    return <Navigate to="/" />
  }
    return children
}

export default ProtectedRoute
