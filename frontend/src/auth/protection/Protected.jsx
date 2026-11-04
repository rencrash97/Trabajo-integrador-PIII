import { Navigate } from "react-router"

export const Protected = ({isSignedIn, children}) => {
  if(!isSignedIn) {
    return <Navigate to="/login" replace />
  }
    return children;
    
}
