// src/App.jsx
import React, { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import CharacterCompanion from './components/CharacterCompanion';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, listening, thinking, speaking

  // Giả lập phản hồi từ LLM
  const handleSendMessage = (text) => {
    // 1. Thêm tin nhắn của User
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    // 2. Nhân vật chuyển sang trạng thái "Thinking"
    setStatus('thinking');

    // 3. Giả lập delay của LLM (2 giây)
    setTimeout(() => {
      setStatus('speaking');
      setMessages(prev => [...prev, { role: 'assistant', content: "Đây là phản hồi giả lập từ LLM cho câu hỏi của bạn!" }]);
      
      // 4. Sau khi "nói" xong 3 giây thì quay về idle
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  const handleVoiceActive = () => {
    setStatus('listening');
    // Giả lập việc nghe trong 3 giây rồi tắt
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FD] font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR TRÁI (Tương tự ảnh Lumo AI) */}
      <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col gap-8 hidden lg:flex">
        <div className="text-2xl font-bold text-violet-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg" /> Whyfu
        </div>
        <nav className="flex flex-col gap-2 text-slate-500 font-medium">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">Main</div>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors">Dashboard</button>
          <button className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 text-violet-700">AI Chat</button>
        </nav>
      </aside>

      {/* VÙNG CHAT CHÍNH */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-slate-400 text-sm">Welcome Back</h2>
            <h1 className="text-xl font-bold">Leezy</h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-full shadow-sm border border-slate-50">
            <input type="text" placeholder="Search Here..." className="bg-transparent outline-none text-sm w-48" />
          </div>
        </header>

        {/* Nội dung tin nhắn */}
        <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <h2 className="text-5xl font-bold mb-4">Welcome To Lumo.AI</h2>
              <p className="text-slate-400">Get started by script a task and chat can do the rest.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input bar cố định dưới cùng */}
        <div className="p-8">
          <ChatInput onSendMessage={handleSendMessage} onVoiceClick={handleVoiceActive} />
        </div>
      </main>

      {/* SIDEBAR PHẢI (Recent Prompts) */}
      <aside className="w-80 bg-white border-l border-slate-100 p-6 hidden xl:block overflow-y-auto">
        <h3 className="font-bold mb-4 flex justify-between items-center">
          Recent Prompts <span className="text-xs text-slate-400 font-normal">(08)</span>
        </h3>
        <div className="flex flex-col gap-3">
          {['How to make a loading screen...', 'Marketing strategy for SaaS...', 'UI/UX Design tips...'].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-50 hover:border-violet-200 cursor-pointer transition-all">
              <p className="text-sm font-medium line-clamp-2 text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* NHÂN VẬT 2D (FLOATING) */}
      <CharacterCompanion state={status} />
    </div>
  );
}