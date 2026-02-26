import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import VisitPage from "./Component/Visit/VisitPage";
import HomePage from "./Component/Home/HomePage";
import Login from "./Component/Auth/Login";
import Signup from "./Component/Auth/Signup";
import VerifyEmail from "./Component/Auth/VerifyEmail";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import ResetPassword from "./Component/Auth/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<VisitPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;