import { useContext } from "react";
import { Navigate } from "react-router";
import { JsonAuthContext } from "../../../general/JsonAuthContext.jsx";

export const Protected = ({ children, allowedRoles }) => {
  const { isSignedIn, userRole } = useContext(JsonAuthContext);

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="*" replace />;
  }

  return children;
};
