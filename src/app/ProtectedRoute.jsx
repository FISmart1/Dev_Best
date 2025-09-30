import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // ⏳ Tunggu context siap
  if (loading) {
    return <div>Loading...</div>; // Bisa diganti spinner
  }

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
