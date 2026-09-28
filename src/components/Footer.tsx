import React from 'react';

interface FooterProps {
  onOpenGithub: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGithub }) => {
  return (
    <footer className="py-12 border-t border-[#E6E4DC] max-w-6xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <a
          href="#top"
          className="text-stone-900 font-semibold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-blue-600 font-light text-base">∞</span>
          <span className="tracking-wider">ЛАБА</span>
        </a>

        <p className="font-display italic text-stone-600 text-sm">
          Физика, которую можно проверить.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenGithub}
            className="hover:text-stone-900 transition-colors cursor-pointer text-stone-600 font-medium"
          >
            Экспорт в GitHub
          </button>
          <a
            href="#top"
            className="hover:text-stone-900 transition-colors cursor-pointer"
          >
            Наверх ↑
          </a>
        </div>
      </div>
    </footer>
  );
};
