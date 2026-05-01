// src/App.jsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; // THÊM Navigate
import { useEffect } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useUserInfo } from "../store/useUserInfo";

import AuthPage from "./pages/auth/AuthPage";
import ChatBox from "./pages/chat/ChatBox";

export default function App() {
  const {
    isLoggedIn,
    isAuthChecking,
    setUser,
    setEmpty,
    fetchCoversations,
    setAuthChecking,
  } = useUserInfo();

  useEffect(() => {
    let unsubscribe;

    const checkAuth = async () => {
      setAuthChecking(true); // hold the gate open

      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
          await fetchCoversations();
        } else {
          setEmpty();
        }
      });
    };

    checkAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Đang đồng bộ đăng nhập...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<ChatBox />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
