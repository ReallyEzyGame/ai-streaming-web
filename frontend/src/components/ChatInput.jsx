// src/components/ChatInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Brain, Send } from "lucide-react";

export default function ChatInput({ onSendMessage, onVoiceClick}) {
  const textareaRef = useRef(null);
  const [text, setText ] = useState('')
  // Tự động điều chỉnh chiều cao của textarea khi gõ (tùy chọn)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim()) {      
      onSendMessage(text); // Gửi nội dung lên ChatBox
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    // Nhấn Enter để gửi, Shift + Enter để xuống dòng
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white border border-slate-200 rounded-3xl shadow-lg">
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write Content For My Latest..."
        className="w-full p-2 outline-none text-slate-700 bg-transparent resize-none max-h-40 overflow-y-auto" // resize-none để cố định khung
      />

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex gap-4">
          {/* Các nút chức năng giữ nguyên */}
          <button className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
            <Paperclip size={18} /> Attach
          </button>
          <button onClick={onVoiceClick} className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
            <Mic size={18} /> Voice
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
            <Brain size={18} /> Deep Think
          </button>
        </div>

        <button
          onClick={handleSend}
          className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-xl transition-all shadow-md active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}