


const stateConfig = {
  idle: {
    borderClass: 'border-violet-200',
    glowClass: 'shadow-[0_0_15px_rgba(167,139,250,0.2)]', // Bóng mờ nhẹ
  },
  listening: {
    borderClass: 'border-emerald-500 animate-border-pulse',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.6)]', // Tỏa sáng xanh lá
  },
  thinking: {
    borderClass: 'border-violet-600',
    glowClass: 'shadow-[0_0_20px_rgba(124,58,237,0.4)]',
    overlay: (
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
        <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  },
  speaking: {
    borderClass: 'border-violet-400',
    glowClass: 'shadow-[0_0_30px_rgba(167,139,250,0.8)]', // Tỏa sáng tím mạnh
  },
};

const PLACEHOLDER_IMAGE = "https://slidesdocs.com/powerpoint-background/sunset-anime-sky";

export default function CharacterCompanion({ state = 'idle', characterImage = PLACEHOLDER_IMAGE }) {
  const config = stateConfig[state] || stateConfig.idle;

  return (
    <div className="fixed bottom-28 right-8 z-50 transition-all duration-500">
      {/* QUAN TRỌNG: 
          - Thêm rounded-[40px] vào ĐÂY để shadow nhận diện đúng hình dáng.
          - Overflow-hidden để ảnh không tràn ra khỏi bo góc.
      */}
      <div className={`
        relative w-44 h-64 
        rounded-[40px] border-4 
        bg-white/30 backdrop-blur-xl
        flex items-end justify-center overflow-hidden
        transition-all duration-500 ease-in-out
        ${config.borderClass} 
        ${config.glowClass}
      `}>
        
        {/* Nhân vật 2D */}
        <img 
          src={characterImage} 
          alt="Companion" 
          className="w-[90%] h-auto object-contain z-10 select-none"
          style={{ 
            transform: state === 'speaking' ? 'scale(1.05)' : 'scale(1)',
            filter: state === 'thinking' ? 'grayscale(0.5)' : 'none'
          }} 
        />

        {/* Lớp phủ khi đang suy nghĩ */}
        {config.overlay}

        {/* Hiệu ứng trang trí nhẹ bên trong (Reflection) */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}