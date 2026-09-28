import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-24 border-b border-[#E6E4DC] max-w-6xl mx-auto px-6 overflow-hidden">
      {/* Subtle organic light accent in background */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/40 via-sky-50/20 to-transparent blur-3xl pointer-events-none"
      />

      <div className="relative max-w-4xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-medium mb-4">
          <span>Физика жидкостей</span>
          <span className="text-stone-300">/</span>
          <span>Глава 01</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-display text-stone-900 leading-[1.04] tracking-tight mb-12">
          Закон
          <br />
          <em className="font-serif italic font-normal text-blue-900 selection:text-white">Архимеда</em>
        </h1>

        <div className="grid md:grid-cols-12 gap-8 md:gap-14 pt-8 border-t border-[#E6E4DC]/80">
          <div className="md:col-span-6">
            <p className="text-xl md:text-2xl font-display text-stone-900 leading-snug">
              Почему камень идёт ко дну, льдина держится на воде, а огромный стальной корабль остаётся на поверхности?
            </p>
          </div>
          <div className="md:col-span-6 text-stone-600 text-sm md:text-base leading-relaxed space-y-4">
            <p>
              Ответ начинается с простой мысли: жидкость давит на погружённое тело со всех сторон, но снизу сильнее, чем сверху. Из этой разницы рождается сила, направленная вверх.
            </p>
            <p className="text-xs text-stone-500">
              Три интерактивных опыта ниже позволяют исследовать этот закон на практике: управлять бассейном сил, проверить золотую корону Архимеда и испытать плавучесть стального судна.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
