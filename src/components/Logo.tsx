export default function Logo({ compact = false, size = 40 }: { compact?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-3 select-none" aria-label="BabaG7Star home">
      {/* B7 monogram */}
      <span
        className="relative grid place-items-center rounded-2xl bg-black border border-[#d4a017]/40 overflow-hidden shrink-0"
        style={{ width: size + 8, height: size + 8, boxShadow: "0 0 24px rgba(212,160,23,.25)" }}
      >
        <svg viewBox="0 0 64 44" width={size} height={size * 0.7} aria-hidden>
          <defs>
            <linearGradient id="b7gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4A017" />
              <stop offset="55%" stopColor="#F5C542" />
              <stop offset="100%" stopColor="#FFE9A8" />
            </linearGradient>
          </defs>
          {/* B */}
          <text x="4" y="36" fontFamily="Sora, Montserrat, sans-serif" fontWeight="900" fontSize="36" fill="#fff" letterSpacing="-1">B</text>
          {/* 7 */}
          <text x="30" y="36" fontFamily="Sora, Montserrat, sans-serif" fontWeight="900" fontSize="36" fill="url(#b7gold)">7</text>
          {/* star */}
          <path d="M52 4 L54.2 10.2 L60.8 10.4 L55.6 14.3 L57.4 20.6 L52 17 L46.6 20.6 L48.4 14.3 L43.2 10.4 L49.8 10.2 Z" fill="url(#b7gold)" stroke="#F5C542" strokeWidth="0.6" />
          {/* swoosh */}
          <path d="M3 30 C 16 24, 30 21, 52 17 C 34 21.5, 18 25, 6 33 C 2 35, 0 32, 3 30 Z" fill="url(#b7gold)" opacity="0.95" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display font-black tracking-tight text-[19px] sm:text-[21px]">
            <span className="text-white">BABAG</span>
            <span className="gold-text">7</span>
            <span className="text-white">STAR</span>
          </span>
          <span className="block text-[10px] tracking-[0.32em] text-[#f5c542]/80 font-semibold mt-1">PREMIUM • FAST • TRUSTED</span>
        </span>
      )}
    </span>
  );
}
