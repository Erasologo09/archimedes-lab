import React, { useState } from 'react';
import { playTactileClick } from '../utils/audio';

export const TheorySection: React.FC = () => {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const toggleTerm = (term: string) => {
    playTactileClick();
    setActiveTerm(activeTerm === term ? null : term);
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* 01 Наблюдение */}
      <section id="principle" className="py-20 border-b border-[#E6E4DC] grid md:grid-cols-12 gap-8 md:gap-12">
        <aside className="md:col-span-3">
          <div className="sticky top-24">
            <span className="text-3xl font-display text-stone-300 font-light block mb-1">01</span>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Наблюдение
            </p>
          </div>
        </aside>

        <div className="md:col-span-9 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-display text-stone-900 mb-6 leading-tight">
            Вода будто делает тело легче
          </h2>
          <div className="prose text-stone-700 leading-relaxed space-y-4 text-base">
            <p>
              Попробуйте поднять тяжёлый предмет под водой. Рука сразу почувствует: удерживать его проще. Масса предмета не изменилась, сила тяжести тоже никуда не исчезла. Просто к ней добавилась другая сила, направленная вверх.
            </p>
            <p>
              Она возникает в жидкостях и газах. Давление среды растёт с глубиной, поэтому нижняя поверхность тела получает более сильный толчок, чем верхняя. Боковые силы взаимно компенсируются, а их вертикальная разность даёт результирующую выталкивающую силу.
            </p>
            <blockquote className="my-6 pl-5 border-l-2 border-blue-600 font-display italic text-lg md:text-xl text-stone-900 py-1 bg-blue-50/40">
              «На погружённое тело действует выталкивающая сила, равная весу вытесненной им жидкости.»
            </blockquote>
            <p>
              Это и есть закон Архимеда. Слово <em>«вытесненной»</em> здесь главное: учитывается не весь объём тела, а только та его часть, которая находится в жидкости.
            </p>
          </div>
        </div>
      </section>

      {/* Формула в одной строке */}
      <section className="py-16 border-b border-[#E6E4DC]">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-stone-500 font-medium mb-3">
            Закон в одной строке
          </p>
          <div className="bg-[#F4F3EE] border border-[#E6E4DC] p-8 md:p-10 rounded-sm relative overflow-hidden">
            <div className="text-3xl md:text-5xl font-mono tracking-tight text-stone-900 mb-4 select-none flex items-center justify-center flex-wrap gap-2">
              <span className="font-semibold text-blue-700">F<sub className="text-xl md:text-2xl">А</sub></span>
              <span>=</span>
              <button
                type="button"
                onClick={() => toggleTerm('rho')}
                className={`transition-all underline decoration-dotted underline-offset-4 cursor-pointer px-2 py-0.5 rounded ${
                  activeTerm === 'rho'
                    ? 'bg-amber-200 text-amber-950 font-bold scale-105'
                    : 'hover:text-blue-700 hover:bg-stone-200/50'
                }`}
                title="Нажмите для описания плотности жидкости"
              >
                ρ<sub className="text-xl md:text-2xl">ж</sub>
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => toggleTerm('g')}
                className={`transition-all underline decoration-dotted underline-offset-4 cursor-pointer px-2 py-0.5 rounded ${
                  activeTerm === 'g'
                    ? 'bg-amber-200 text-amber-950 font-bold scale-105'
                    : 'hover:text-blue-700 hover:bg-stone-200/50'
                }`}
                title="Нажмите для описания ускорения свободного падения"
              >
                g
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => toggleTerm('v')}
                className={`transition-all underline decoration-dotted underline-offset-4 cursor-pointer px-2 py-0.5 rounded ${
                  activeTerm === 'v'
                    ? 'bg-amber-200 text-amber-950 font-bold scale-105'
                    : 'hover:text-blue-700 hover:bg-stone-200/50'
                }`}
                title="Нажмите для описания погружённого объёма"
              >
                V<sub className="text-xl md:text-2xl">погр</sub>
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Нажмите на переменную в формуле, чтобы подсветить её физическую роль:
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => toggleTerm('rho')}
            className={`p-5 rounded-sm border text-left transition-all cursor-pointer ${
              activeTerm === 'rho'
                ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-400'
                : 'border-[#E6E4DC] bg-white hover:border-stone-400'
            }`}
          >
            <div className="font-mono text-lg font-bold text-stone-900 mb-1">
              ρ<sub className="text-xs">ж</sub>
            </div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Плотность среды
            </div>
            <p className="text-sm text-stone-600 leading-snug">
              Измеряется в <strong>кг/м³</strong>. Чем плотнее среда (солёная вода, глицерин, ртуть), тем выше сила Архимеда при том же объёме.
            </p>
          </button>

          <button
            type="button"
            onClick={() => toggleTerm('g')}
            className={`p-5 rounded-sm border text-left transition-all cursor-pointer ${
              activeTerm === 'g'
                ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-400'
                : 'border-[#E6E4DC] bg-white hover:border-stone-400'
            }`}
          >
            <div className="font-mono text-lg font-bold text-stone-900 mb-1">g</div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Ускорение падения
            </div>
            <p className="text-sm text-stone-600 leading-snug">
              Константа <strong>≈ 9,81 м/с²</strong> на Земле. В невесомости выталкивающая сила равна нулю, так как нет градиента давления.
            </p>
          </button>

          <button
            type="button"
            onClick={() => toggleTerm('v')}
            className={`p-5 rounded-sm border text-left transition-all cursor-pointer ${
              activeTerm === 'v'
                ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-400'
                : 'border-[#E6E4DC] bg-white hover:border-stone-400'
            }`}
          >
            <div className="font-mono text-lg font-bold text-stone-900 mb-1">
              V<sub className="text-xs">погр</sub>
            </div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Погружённый объём
            </div>
            <p className="text-sm text-stone-600 leading-snug">
              Измеряется в <strong>м³</strong> или литрах. Значение имеет только та часть тела, которая реально вытесняет жидкость.
            </p>
          </button>
        </div>
      </section>

      {/* 02 Смысл формулы */}
      <section className="py-20 border-b border-[#E6E4DC] grid md:grid-cols-12 gap-8 md:gap-12">
        <aside className="md:col-span-3">
          <div className="sticky top-24">
            <span className="text-3xl font-display text-stone-300 font-light block mb-1">02</span>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Смысл формулы
            </p>
          </div>
        </aside>

        <div className="md:col-span-9 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-display text-stone-900 mb-6 leading-tight">
            Больше вытеснил, сильнее вытолкнуло
          </h2>
          <div className="prose text-stone-700 leading-relaxed space-y-4 text-base">
            <p>
              Плотная жидкость создаёт большую силу при том же объёме. Поэтому в солёной воде держаться на поверхности легче, чем в пресной, а в менее плотном масле то же тело погружается глубже.
            </p>
            <p>
              У свободно плавающего тела выталкивающая сила автоматически уравновешивает вес: <strong>F<sub className="text-xs">А</sub> = mg</strong>. Если тело притопить рукой, оно вытеснит больше жидкости и получит дополнительный толчок вверх. Если приподнять, вытеснит меньше, и сила тяжести вернёт его на место.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
