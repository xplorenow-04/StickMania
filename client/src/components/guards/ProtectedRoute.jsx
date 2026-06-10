import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../../context/AuthProvider.jsx";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useContext(authContext);

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;