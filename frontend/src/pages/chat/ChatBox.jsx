// src/pages/chat/ChatBox.jsx
import React, { useState } from "react";
import ChatInput from "../../components/ChatInput";
import { useChatStore } from "../../../store/useChatStore";
import { useUserInfo } from "../../../store/useUserInfo";
import { serverTimestamp } from "firebase/firestore";
// Thêm Menu, X, Plus cho giao diện Mobile và New Chat
import { LogOut, Menu, X, Plus } from "lucide-react"; 
import { signOutFromFireBase } from "../../../api/firebase/auth/logOut";

export default function ChatBox() {
  // THÊM STATE QUẢN LÝ MENU MOBILE
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    uid,
    userName,
    currentConversation,
    conversations,
    appendMessage,
    currentConversationIdx,
    makeNewConversation,
    setConversation,
    startNewChat, // Lấy hàm vừa tạo từ store
  } = useUserInfo();
  const { messages, sendMessage, isLoading } = useChatStore();

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    if (currentConversationIdx === null) await makeNewConversation(text);

    const userMsg = { role: "user", content: text, timestamp: serverTimestamp() };
    await appendMessage(userMsg);
    const resMsg = await sendMessage(text);
    if (resMsg) await appendMessage(resMsg);
  };

  const handleLogout = async () => {
    try {
      await signOutFromFireBase();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Hàm xử lý khi bấm tạo mới
  const handleNewChat = () => {
    startNewChat();
    setIsMobileMenuOpen(false); // Đóng menu mobile nếu đang mở
  };

  return (
    // Thêm relative để chứa overlay mobile
    <div className="flex h-screen bg-[#F8F9FD] font-sans text-slate-900 overflow-hidden relative">
      
      {/* 1. HEADER DÀNH RIÊNG CHO MOBILE (Chỉ hiện trên màn hình nhỏ) */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 z-10 w-full absolute top-0 left-0">
        <div className="flex items-center gap-2 text-xl font-bold text-violet-700">
          <div className="w-7 h-7 bg-violet-600 rounded-lg" /> Lumo
        </div>
        <div className="flex gap-3">
          <button onClick={handleNewChat} className="p-2 bg-violet-100 text-violet-700 rounded-xl active:scale-95">
            <Plus size={20} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-100 text-slate-700 rounded-xl active:scale-95">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* OVERLAY LÀM TỐI MÀN HÌNH KHI MỞ MENU MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* 2. SIDEBAR TRÁI (Trượt ra trên Mobile, Cố định trên Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 flex flex-col gap-6 transition-transform transform ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none`}>
        {/* Nút đóng trên Mobile */}
        <div className="flex justify-between items-center lg:hidden mb-2">
          <div className="text-xl font-bold text-violet-700 flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg" /> Lumo
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 bg-slate-50 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Logo trên Desktop */}
        <div className="hidden lg:flex text-2xl font-bold text-violet-700 items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" /> Lumo
        </div>

        <nav className="flex flex-col gap-2 text-slate-500 font-medium">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">Main</div>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors">Dashboard</button>
          <button className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 text-violet-700">AI Chat</button>
        </nav>

        {/* GỘP LỊCH SỬ CHAT VÀO ĐÂY CHO MOBILE */}
        <div className="flex-1 overflow-y-auto lg:hidden mt-4 border-t border-slate-50 pt-6">
          <h3 className="font-bold mb-3 text-sm flex items-center justify-between">
            Recent Prompts
            <span className="text-xs text-slate-400 font-normal">({conversations.length})</span>
          </h3>
          <div className="flex flex-col gap-2">
            {conversations.map((item, i) => (
              <div
                key={i}
                onClick={() => { setConversation(item.id); setIsMobileMenuOpen(false); }}
                className="p-3 rounded-xl bg-slate-50 text-sm font-medium line-clamp-1 text-slate-600 cursor-pointer active:scale-95"
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>

        {/* LOG OUT (Dành cho Mobile, ở đáy Sidebar Trái) */}
        <div className="mt-auto lg:hidden">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-50 text-red-500 font-semibold active:scale-95">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 3. VÙNG CHAT CHÍNH */}
      {/* Thêm pt-20 để không bị Header Mobile che mất nội dung */}
      <main className="flex-1 flex flex-col relative overflow-hidden pt-20 lg:pt-0">
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 flex flex-col gap-6">
          {!currentConversation?.messages?.length ? (
            <div className="text-center mt-10 lg:mt-20">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">Welcome To Lumo.AI</h2>
              <p className="text-slate-400">What's on your mind?</p>
            </div>
          ) : (
            currentConversation.messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] lg:max-w-[70%] p-4 rounded-2xl shadow-sm border ${msg.role === "user" ? "bg-violet-600 text-white rounded-tr-none border-transparent" : "bg-white text-slate-700 rounded-tl-none border-slate-100"} whitespace-pre-wrap break-words text-sm lg:text-base`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 lg:p-8">
          <ChatInput onSendMessage={handleSendMessage} onVoiceClick={() => {}} />
        </div>
      </main>

      {/* 4. SIDEBAR PHẢI (Desktop) */}
      <aside className="w-80 bg-white border-l border-slate-100 hidden xl:flex flex-col overflow-hidden">
        
        {/* NÚT TẠO CUỘC TRÒ CHUYỆN MỚI */}
        <div className="p-6 pb-2">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white p-3.5 rounded-xl hover:bg-violet-700 transition-colors shadow-md shadow-violet-200 font-medium active:scale-95"
          >
            <Plus size={20} />
            New Conversation
          </button>
        </div>

        <div className="p-6 pt-4 flex-1 overflow-y-auto">
          <h3 className="font-bold mb-4 flex justify-between items-center text-sm">
            Recent Prompts
            {conversations.length > 0 && <span className="text-xs text-slate-400 font-normal">({conversations.length})</span>}
          </h3>
          <div className="flex flex-col gap-3">
            {conversations.map((item, i) => (
              <div key={i} onClick={() => setConversation(item.id)} className="p-4 rounded-xl border border-slate-50 hover:border-violet-200 cursor-pointer transition-all">
                <p className="text-sm font-medium line-clamp-2 text-slate-600">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-50 mt-auto">
          <button onClick={handleLogout} className="flex items-center justify-start gap-3 w-full p-3 rounded-xl bg-white text-red-500 font-semibold transition-all hover:bg-slate-100 hover:text-red-700 active:scale-95">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
}