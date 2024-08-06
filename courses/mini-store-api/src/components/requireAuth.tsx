import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function RequireAuth() {
  const { auth } = useAuth();

  if (!auth.user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child components
  return <Outlet />;
}
