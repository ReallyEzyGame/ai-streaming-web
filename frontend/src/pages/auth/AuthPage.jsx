import React, { useState } from "react";
import { Mail, Lock, EyeOff, LogIn, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signUp, signInWithGoogle } from "../../../api/firebase/auth/signIn";

const AuthPage = () => {
  // State quản lý chế độ: true là Log In, false là Sign Up
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (isLogin) {
      signIn(email, password); // Gọi hàm đăng nhập[cite: 37]
    } else {
      signUp(email, password); // Gọi hàm đăng ký[cite: 38]
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-purple-100 relative overflow-hidden font-sans">
      {/* Các vòng tròn trang trí background */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-white/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-300/20 blur-3xl" />

      {/* Card chính với Glassmorphism[cite: 37, 38] */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[440px] p-10 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-2xl mx-4 z-10"
      >
        {/* Icon nổi thay đổi theo chế độ */}
        <motion.div 
          key={isLogin ? "login-icon" : "signup-icon"}
          initial={{ scale: 0.5, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-white/50"
        >
          {isLogin ? <LogIn className="text-slate-700" size={28} /> : <UserPlus className="text-violet-600" size={28} />}
        </motion.div>

        {/* Tiêu đề động[cite: 37, 38] */}
        <div className="text-center mt-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {isLogin ? "Sign in with email" : "Create an account"}
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {isLogin 
              ? "A small chat is all to visit an old friend" 
              : "To chat is to make a new friend"}
          </p>
        </div>

        {/* Form nhập liệu[cite: 37, 38] */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-transparent focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-transparent focus:border-blue-400 focus:bg-white rounded-2xl outline-none transition-all text-slate-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <EyeOff size={20} />
            </button>
          </div>

          {/* Nút chính thay đổi text theo chế độ[cite: 37, 38] */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 ${isLogin ? 'bg-slate-900' : 'bg-violet-600'} text-white font-bold rounded-2xl shadow-lg transition-colors mt-2`}
            onClick={handleSubmit}
          >
            {isLogin ? "Sign In" : "Register Now"}
          </motion.button>

          {/* Chuyển đổi giữa Log In và Sign Up[cite: 37, 38] */}
          <div className="text-center mt-4">
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>

        {/* Phân cách và Nút mạng xã hội[cite: 37, 38] */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300/50 dashed"></div>
          </div>
          <span className="relative px-4 bg-transparent text-slate-400 text-xs font-bold uppercase tracking-widest">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <SocialButton
            onClick={() => signInWithGoogle()}
            icon={<FcGoogle size={30} />}
            label="Google Account"
          />
        </div>
      </motion.div>
    </div>
  );
};

// Component con cho nút mạng xã hội[cite: 37, 38]
const SocialButton = ({ icon, label, onClick }) => (
  <motion.button
    whileHover={{ y: -4, backgroundColor: "white" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center justify-center gap-3 py-3 border border-white/60 bg-white/40 rounded-2xl shadow-sm transition-all text-slate-700 font-bold text-sm"
  >
    {icon} <span>{label}</span>
  </motion.button>
);

export default AuthPage;