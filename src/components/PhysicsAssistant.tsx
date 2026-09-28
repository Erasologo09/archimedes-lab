import React, { useState } from 'react';
import { SimState, CrownState, ShipState } from '../types/physics';
import { askPhysicsAssistant } from '../services/aiAssistant';

interface PhysicsAssistantProps {
  sim: SimState;
  crown: CrownState;
  ship: ShipState;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const PhysicsAssistant: React.FC<PhysicsAssistantProps> = ({ sim, crown, ship }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Я читаю параметры опыта и объясняю, почему тело всплывает, тонет или остаётся в равновесии. Задайте вопрос или выберите одну из подсказок.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Почему корабль не тонет?',
    'Зависит ли сила от глубины?',
    'Что будет в масле?',
    'Рассчитай мои текущие значения',
    'В чём суть опыта с короной?',
  ];

  const handleSend = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askPhysicsAssistant(text, { sim, crown, ship });
      setMessages((prev) => [...prev, { sender: 'assistant', text: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Не удалось обработать запрос. Попробуйте переформулировать вопрос.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <section id="assistant" className="py-20 border-b border-[#E6E4DC] max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Copy */}
        <div className="md:col-span-4">
          <div className="sticky top-24">
            <p className="text-xs uppercase tracking-widest text-blue-700 font-medium mb-2">
              Помощник по опыту
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-stone-900 leading-tight mb-4">
              Спросите о том, что видите
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              Ответ учитывает текущие параметры ваших трёх опытов (бассейн, корона, корабль) и связывает формулы с физическим смыслом.
            </p>
            <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-xs text-[11px] text-stone-500 font-mono space-y-1">
              <div>• Среда: {sim.fluidId}</div>
              <div>• Масса тела: {sim.mass.toFixed(1)} кг</div>
              <div>• Состав короны: {Math.round(crown.goldRatio * 100)}% Au</div>
              <div>• Судно: {ship.isHollow ? 'Полое' : 'Сплошное'} ({ship.cargoTons} т груза)</div>
            </div>
          </div>
        </div>

        {/* Right Dialogue & Interaction */}
        <div className="md:col-span-8 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs flex flex-col justify-between min-h-[460px]">
          {/* Messages Stream */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 mb-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1 px-1">
                  {m.sender === 'user' ? 'Вы' : 'ЛАБА'}
                </span>
                <div
                  className={`p-4 rounded-xs text-sm leading-relaxed max-w-[90%] whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-stone-900 text-stone-50'
                      : 'bg-stone-50 border border-stone-200 text-stone-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mb-1 px-1">
                  ЛАБА
                </span>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-500 italic">
                  Анализирую физические данные опыта...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="pt-3 border-t border-stone-100 mb-4">
            <p className="text-[11px] text-stone-500 mb-2 font-medium">Быстрые вопросы:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="text-xs py-1 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xs transition-colors cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              aria-label="Вопрос помощнику"
              placeholder="Например: объясни формулу для моего опыта…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-stone-300 rounded-xs px-3.5 py-2 text-sm focus:outline-hidden focus:border-stone-900 bg-stone-50/50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Отправить"
              className="px-4 py-2 bg-stone-900 text-white rounded-xs font-semibold text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
