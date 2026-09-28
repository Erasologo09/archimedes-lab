import React, { useState } from 'react';
import { playTactileClick } from '../utils/audio';

interface GithubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubExportModal: React.FC<GithubExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState('your-username');
  const [repoName, setRepoName] = useState('archimedes-principle-lab');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptCommands = `# 1. Проверьте статус локального репозитория
git status

# 2. Добавьте все файлы и создайте коммит
git add .
git commit -m "feat: interactive Archimedes Principle laboratory"

# 3. Переименуйте ветку в main
git branch -M main

# 4. Привяжите ваш удаленный GitHub репозиторий
git remote add origin https://github.com/${username.trim() || 'your-username'}/${repoName.trim() || 'archimedes-lab'}.git

# 5. Отправьте код на GitHub
git push -u origin main`;

  const handleCopy = () => {
    playTactileClick();
    navigator.clipboard.writeText(scriptCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#FAF9F5] border border-[#E6E4DC] max-w-xl w-full p-6 md:p-8 rounded-sm shadow-2xl relative text-stone-900">
        <button
          type="button"
          onClick={() => {
            playTactileClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 text-lg cursor-pointer transition-colors p-1"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
            ⌘
          </span>
          <h2 className="text-xl md:text-2xl font-display font-medium text-stone-900">
            Экспорт и публикация в GitHub
          </h2>
        </div>

        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Проект полностью готов к отправке. Введите ваш логин GitHub и имя репозитория, скопируйте команды и выполните их в терминале.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Логин GitHub:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full text-xs font-mono p-2.5 bg-white border border-[#D5D3CB] rounded-xs focus:outline-hidden focus:border-stone-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Имя репозитория:
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="archimedes-principle-lab"
              className="w-full text-xs font-mono p-2.5 bg-white border border-[#D5D3CB] rounded-xs focus:outline-hidden focus:border-stone-900"
            />
          </div>
        </div>

        <div className="relative mb-6">
          <div className="flex items-center justify-between bg-stone-900 text-stone-300 text-[11px] font-mono px-4 py-2 rounded-t-xs border-b border-stone-800">
            <span>Terminal (bash)</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-stone-300 hover:text-white transition-colors cursor-pointer font-medium"
            >
              {copied ? '✓ Скопировано' : 'Скопировать всё'}
            </button>
          </div>
          <pre className="p-4 bg-stone-950 text-stone-100 font-mono text-xs overflow-x-auto rounded-b-xs leading-relaxed max-h-56">
            <code>{scriptCommands}</code>
          </pre>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E6E4DC] text-xs">
          <span className="text-stone-500">
            Все зависимости и tsconfig настроены
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xs shadow-xs transition-colors cursor-pointer"
          >
            {copied ? 'Скопировано!' : 'Скопировать команды'}
          </button>
        </div>
      </div>
    </div>
  );
};
