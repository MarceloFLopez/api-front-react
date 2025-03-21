import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log(role, token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
