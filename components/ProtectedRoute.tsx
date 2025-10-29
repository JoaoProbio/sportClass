import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: for role-based access control
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();

  // Show a loading state while authentication status is being determined
  if (isLoading) {
    return <div>Loading...</div>; // Or a more elaborate loading spinner/component
  }

  // If there's no token, redirect to login page
  if (!token) {
    router.push("/login"); // Assuming a login page at /login
    return null;
  }

  // Optional: Implement role-based access control
  // If user is defined and allowedRoles are specified, check if user's role is included
  if (allowedRoles && user && !allowedRoles.includes(user.tipo)) {
    // Redirect to an unauthorized page or dashboard
    router.push("/unauthorized"); // Or a general dashboard
    return null;
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
