import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../context/AuthProvider.jsx";

const ProtectedRouteAuth = ({ children }) => {
  const { isLoggedIn, isAdmin } = useContext(authContext);

  if (isLoggedIn && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRouteAuth;