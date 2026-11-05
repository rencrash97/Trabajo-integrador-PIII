import { useContext } from "react";
import { Navigate } from "react-router";
import { JsonAuthContext } from "../../../general/JsonAuthContext.jsx";

export const Protected = ({ children }) => {
  const { isSignedIn } = useContext(JsonAuthContext);

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};