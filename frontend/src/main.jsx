import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AdminEnquiries from "./pages/AdminEnquiries.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./index.css";

// The customer landing page ("/") is untouched - App.jsx renders exactly
// what it did before. "/admin" is now behind a login (see ProtectedRoute +
// the backend's require_admin dependency, which is the real enforcement).
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminEnquiries />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
