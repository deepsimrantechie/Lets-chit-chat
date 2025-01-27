import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignPage from "./pages/SignPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import SettingPage from "./pages/SettingPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isCheckingAuthState, setIsCheckingAuthState] = useState(true);

  const { theme } = useThemeStore();

  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth();
      setIsCheckingAuthState(false);
    };

    checkUserAuth();
  }, [checkAuth]);

  if (isCheckingAuthState || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="cursor-pointer">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
