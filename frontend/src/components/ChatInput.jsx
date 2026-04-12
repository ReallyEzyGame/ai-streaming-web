// src/components/ChatInput.jsx
import React, { useState } from 'react';
import { Paperclip, Mic, Brain, Send } from 'lucide-react'; // Sử dụng lucide-react cho icon

export default function ChatInput({ onSendMessage, onVoiceClick }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white border border-slate-200 rounded-3xl shadow-lg">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Write Content For My Latest..."
        className="w-full p-2 outline-none text-slate-700 bg-transparent"
      />
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
            <Paperclip size={18} /> Attach
          </button>
          
          <button 
            onClick={onVoiceClick}
            className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors"
          >
            <Mic size={18} /> Voice Message
          </button>
          
          <button className="flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
            <Brain size={18} /> Deep Think AI
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