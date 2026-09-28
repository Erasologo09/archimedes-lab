import React, { useState } from 'react';
import { playTactileClick, setAudioEnabled, getAudioEnabled } from '../utils/audio';

interface HeaderProps {
  onOpenGithub: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGithub }) => {
  const [audioOn, setAudioOn] = useState(getAudioEnabled());

  const handleToggleAudio = () => {
    const nextState = !audioOn;
    setAudioEnabled(nextState);
    setAudioOn(nextState);
    if (nextState) {
      playTactileClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E6E4DC] px-6 py-3.5 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-display tracking-tight text-stone-900 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl text-blue-600 font-sans font-light">∞</span>
          <span className="font-semibold tracking-wider text-sm font-sans">ЛАБА</span>
          <span className="text-xs text-stone-400 font-sans font-normal hidden sm:inline">
            / Физика жидкостей
          </span>
        </a>

        {/* Zone 2: Clean navigation links */}
        <nav
          aria-label="Навигация по материалу"
          className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600"
        >
          <a href="#principle" className="hover:text-stone-950 transition-colors">
            Принцип
          </a>
          <a href="#simulator" className="hover:text-stone-950 transition-colors">
            Бассейн
          </a>
          <a href="#crown-lab" className="hover:text-stone-950 transition-colors">
            Корона
          </a>
          <a href="#ship-lab" className="hover:text-stone-950 transition-colors">
            Корабль
          </a>
          <a href="#conclusions" className="hover:text-stone-950 transition-colors">
            Выводы
          </a>
          <a href="#assistant" className="hover:text-stone-950 transition-colors">
            Помощник
          </a>
        </nav>

        {/* Zone 3: Actions (Sound + GitHub + Lab CTA) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleAudio}
            title={audioOn ? 'Выключить звук опыта' : 'Включить тактильный звук опыта'}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xs transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
            aria-label="Переключить звук"
          >
            {audioOn ? '🔊 Звук вкл' : '🔇 Звук выкл'}
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onOpenGithub();
            }}
            className="text-xs font-medium px-3 py-1.5 border border-[#D5D3CB] bg-white hover:bg-stone-50 text-stone-800 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>GitHub</span>
            <span className="text-stone-400">↑</span>
          </button>

          <a
            href="#simulator"
            className="text-xs font-semibold px-3.5 py-1.5 bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-xs shadow-2xs whitespace-nowrap"
          >
            Лаборатория ↓
          </a>
        </div>
      </div>
    </header>
  );
};
