import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Reset from "./components/Reset";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import WorkerDashboard from "./components/WorkerDashboard";
import WasteManagement from "./components/WasteManagement";
import WaterManagement from "./components/WaterManagement";
import Grievance from "./components/Grievance";
import Registration from "./components/Registration"; // Assuming /r maps to this

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "worker") return <Navigate to="/worker" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset" element={<Reset />} />

      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={["worker"]}>
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/waste" element={<WasteManagement />} />
      <Route path="/water" element={<WaterManagement />} />
      <Route path="/grievance" element={<Grievance />} />
      <Route path="/r" element={<Registration />} />
    </Routes>
  );
};

export default App;
