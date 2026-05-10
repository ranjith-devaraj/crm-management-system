import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import ClientView from "./pages/ClientView";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext"
import Requests from "./pages/Requests";

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            user ? (
              // 🔥 Redirect based on role if already logged in
              user.role === "owner" ? (
                <Navigate to="/dashboard" />
              ) : user.role === "employee" ? (
                <Navigate to="/customers" />
              ) : (
                <Navigate to="/client" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* OWNER ONLY */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

<Route
  path="/add"
  element={
    <ProtectedRoute allowedRoles={["owner", "employee"]}>
      <MainLayout>
        <AddCustomer />
      </MainLayout>
    </ProtectedRoute>
  }
/>

        {/* OWNER + EMPLOYEE */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={["owner", "employee"]}>
              <MainLayout>
                <Customers />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* CLIENT ONLY */}
<Route
  path="/client"
  element={
    <ProtectedRoute allowedRoles={["client"]}>
      <ClientView />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["owner", "employee", "client"]}>
      <MainLayout>
        <Profile />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/requests"
  element={
    <ProtectedRoute allowedRoles={["owner", "employee"]}>
      <MainLayout>
        <Requests />
      </MainLayout>
    </ProtectedRoute>
  }
/>
        {/* ❌ Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}