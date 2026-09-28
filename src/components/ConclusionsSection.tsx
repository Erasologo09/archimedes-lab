import React from 'react';

export const ConclusionsSection: React.FC = () => {
  return (
    <div id="conclusions" className="max-w-6xl mx-auto px-6">
      {/* 03 Три исхода */}
      <section className="py-20 border-b border-[#E6E4DC] grid md:grid-cols-12 gap-8 md:gap-12">
        <aside className="md:col-span-3">
          <div className="sticky top-24">
            <span className="text-3xl font-display text-stone-400 font-light block mb-1">03</span>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Три исхода
            </p>
          </div>
        </aside>

        <div className="md:col-span-9 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-display text-stone-900 mb-6 leading-tight">
            Всплыть, зависнуть или утонуть
          </h2>
          <div className="prose text-stone-700 leading-relaxed space-y-4 text-base">
            <p>
              Поведение тела определяется сравнением двух сил. Если выталкивающая сила Архимеда больше веса, результирующая направлена вверх. Если меньше, вниз. Если силы равны, ускорения нет: тело плавает на поверхности или остаётся на выбранной глубине.
            </p>

            <div className="my-8 space-y-3">
              <div className="p-4 bg-white border border-[#E6E4DC] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono font-bold text-blue-700 text-base">
                  ρ<sub>т</sub> &lt; ρ<sub>ж</sub>
                </span>
                <span className="text-sm text-stone-700">
                  Тело всплывает и плавает, погрузившись лишь частично
                </span>
              </div>

              <div className="p-4 bg-white border border-[#E6E4DC] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono font-bold text-emerald-700 text-base">
                  ρ<sub>т</sub> = ρ<sub>ж</sub>
                </span>
                <span className="text-sm text-stone-700">
                  Полностью погружённое тело находится в безразличном равновесии
                </span>
              </div>

              <div className="p-4 bg-white border border-[#E6E4DC] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono font-bold text-stone-900 text-base">
                  ρ<sub>т</sub> &gt; ρ<sub>ж</sub>
                </span>
                <span className="text-sm text-stone-700">
                  Тело тонет, опускаясь на дно, если нет внешней поддержки
                </span>
              </div>
            </div>

            <p>
              Именно поэтому материал сам по себе не всегда решает судьбу предмета. Стальной шар тонет, но стальной корабль полый: вместе с воздухом его средняя плотность оказывается меньше плотности воды.
            </p>
          </div>
        </div>
      </section>

      {/* Врезка: Тонкость, которую часто упускают */}
      <section className="my-16 bg-[#18181B] text-stone-100 p-8 md:p-12 rounded-sm shadow-sm">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-3">
            Тонкость, которую часто упускают
          </p>
          <h2 className="text-2xl md:text-3xl font-display text-white mb-5 leading-tight">
            На глубине сила не обязана становиться больше
          </h2>
          <p className="text-stone-300 leading-relaxed text-sm md:text-base">
            Если жидкость однородна, а полностью погружённое тело не сжимается, его вытесненный объём и плотность жидкости постоянны. Значит, сила Архимеда тоже постоянна. Давление на всё тело растёт, но разность давлений сверху и снизу (<strong>ΔP = ρ·g·Δh</strong>) остаётся неизменной на 1 метре и на 100 метрах глубины.
          </p>
        </div>
      </section>

      {/* 04 История */}
      <section className="py-20 border-b border-[#E6E4DC] grid md:grid-cols-12 gap-8 md:gap-12">
        <aside className="md:col-span-3">
          <div className="sticky top-24">
            <span className="text-3xl font-display text-stone-400 font-light block mb-1">04</span>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              История
            </p>
          </div>
        </aside>

        <div className="md:col-span-9 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-display text-stone-900 mb-6 leading-tight">
            Что скрывается за словом «Эврика»
          </h2>
          <div className="prose text-stone-700 leading-relaxed space-y-4 text-base">
            <p>
              Легенда рассказывает, что Архимед заметил вытеснение воды, принимая ванну, и выбежал на улицу с криком «Эврика!» («Нашёл!»). История красивая, хотя её детали появились в более позднем пересказе римского архитектора Витрувия.
            </p>
            <p>
              Гораздо важнее сам метод: измеряя объём вытесненной воды и сравнивая вес в воздухе и в воде, можно рассуждать о плотности и чистоте сложного предмета, не разрушая его. Так бытовое наблюдение превратилось в фундаментальный физический закон гидростатики.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
