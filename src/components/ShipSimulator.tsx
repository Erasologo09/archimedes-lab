import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShipState } from '../types/physics';
import { SHIP_SALINITY_DENSITIES } from '../data/physicsData';
import { playWaterPlop, playTactileClick } from '../utils/audio';

interface ShipSimulatorProps {
  state: ShipState;
  onChange: (updater: (prev: ShipState) => ShipState) => void;
}

export const ShipSimulator: React.FC<ShipSimulatorProps> = ({ state, onChange }) => {
  const [showPressureVectors, setShowPressureVectors] = useState(true);
  const currentEnv = SHIP_SALINITY_DENSITIES[state.waterSalinity];
  const fluidDensity = currentEnv.density; // kg/m^3

  // Masses
  const steelMassKg = state.steelMassTons * 1000;
  const cargoMassKg = state.isHollow ? state.cargoTons * 1000 : 0;
  const totalMassKg = steelMassKg + cargoMassKg;

  // Solid steel volume vs Hull volume
  const solidSteelVolumeM3 = steelMassKg / 7800; // m^3
  const effectiveHullVolumeM3 = state.isHollow ? state.hullVolumeM3 : solidSteelVolumeM3;

  // Average density of vessel
  const averageDensity = Math.round(totalMassKg / effectiveHullVolumeM3);

  // Maximum buoyant force vessel can generate
  const maxDisplacementKg = effectiveHullVolumeM3 * fluidDensity;
  const isOverloaded = totalMassKg > maxDisplacementKg;

  // Submerged percentage
  const submergedRatio = isOverloaded
    ? 1.0
    : Math.min(1.0, totalMassKg / maxDisplacementKg);
  const submergedPercent = Math.round(submergedRatio * 100);
  const reserveBuoyancyPercent = Math.max(0, 100 - submergedPercent);

  // Draft in meters
  const hullHeightMeters = 8.0;
  const draftMeters = Number((submergedRatio * hullHeightMeters).toFixed(2));

  // Visual layout
  const hullHeightPx = 145;
  const waterLevelY = 160;

  const hullTopY = isOverloaded
    ? waterLevelY + 35
    : waterLevelY - hullHeightPx * (1 - submergedRatio);

  const handleSalinityChange = (salinity: 'fresh' | 'ocean' | 'deadsea') => {
    playTactileClick();
    onChange((prev) => ({ ...prev, waterSalinity: salinity }));
  };

  const handleCargoChange = (tons: number) => {
    onChange((prev) => ({ ...prev, cargoTons: tons }));
  };

  const addCargoBox = () => {
    playWaterPlop(1.2);
    onChange((prev) => ({ ...prev, cargoTons: Math.min(600, prev.cargoTons + 50) }));
  };

  const removeCargoBox = () => {
    playTactileClick();
    onChange((prev) => ({ ...prev, cargoTons: Math.max(0, prev.cargoTons - 50) }));
  };

  return (
    <section id="ship-lab" className="py-20 border-b border-[#E6E4DC] max-w-6xl mx-auto px-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-emerald-800 font-medium mb-2">
          Интерактивный опыт 3: Судостроение
        </p>
        <h2 className="text-3xl md:text-5xl font-display text-stone-900 leading-tight mb-3">
          Почему стальной корабль не тонет?
        </h2>
        <p className="text-stone-600 text-sm md:text-base leading-relaxed">
          Стальной брусок плотнее воды почти в 8 раз (7800 кг/м³) и мгновенно идёт ко дну. Исследуйте, как полая форма корпуса и воздух в трюме уменьшают среднюю плотность судна ниже плотности воды.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Hull Cross-Section Visualizer */}
        <div className="lg:col-span-7 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Разрез корпуса в воде и ватерлиния
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Водоём:</span>
              <select
                aria-label="Выбор солёности воды"
                value={state.waterSalinity}
                onChange={(e) => handleSalinityChange(e.target.value as any)}
                className="text-xs font-medium border border-stone-300 bg-stone-50 rounded-xs px-2.5 py-1 cursor-pointer focus:outline-hidden"
              >
                <option value="fresh">Пресная река (1000 кг/м³)</option>
                <option value="ocean">Океан Атлантика (1025 кг/м³)</option>
                <option value="deadsea">Мёртвое море (1240 кг/м³)</option>
              </select>
            </div>
          </div>

          {/* Graphical Ship Basin */}
          <div className="relative w-full h-[370px] bg-gradient-to-b from-sky-50/70 to-blue-50/40 border border-stone-300 rounded-sm overflow-hidden select-none">
            {/* Animated water fill */}
            <div
              className="absolute left-0 right-0 bottom-0 bg-blue-500/30 border-t-2 border-blue-500 transition-all duration-300"
              style={{ top: `${waterLevelY}px` }}
            >
              <div className="absolute left-3 top-2 text-[10px] font-mono text-blue-950 font-semibold bg-white/80 px-2 py-0.5 rounded shadow-2xs">
                Ватерлиния: ρ = {fluidDensity} кг/м³
              </div>
            </div>

            {/* Dynamic Ship Hull */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-[320px] z-10"
              animate={{
                top: hullTopY,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              style={{
                height: `${hullHeightPx}px`,
              }}
            >
              {state.isHollow ? (
                /* Hollow Cargo Ship Hull */
                <div className="relative w-full h-full">
                  {/* Outer Steel Hull Wall */}
                  <div className="w-full h-full bg-stone-800 rounded-b-[48px] border-4 border-stone-900 shadow-xl relative overflow-hidden flex flex-col justify-between p-2">
                    {/* Air Compartment (Hold) */}
                    <div className="w-full h-[88px] bg-amber-50/95 rounded-b-2xl border border-stone-600 flex items-center justify-around px-2 relative">
                      {/* Cargo Crates */}
                      {state.cargoTons > 0 && (
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {Array.from({
                            length: Math.min(6, Math.ceil(state.cargoTons / 60)),
                          }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0.5, y: -20 }}
                              animate={{ scale: 1, y: 0 }}
                              className="w-7 h-7 bg-red-800 border border-red-950 rounded-xs flex items-center justify-center text-[10px] text-white font-mono font-bold shadow-xs"
                            >
                              📦
                            </motion.div>
                          ))}
                        </div>
                      )}
                      <div className="text-[10px] font-mono text-stone-800 bg-white/90 px-2 py-0.5 rounded shadow-2xs font-medium">
                        Трюм (воздух): {state.cargoTons} т груза
                      </div>
                    </div>

                    {/* Plimsoll Mark on Hull Wall */}
                    <div className="absolute right-4 top-14 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-white font-mono text-[9px]">
                      <span>⦵ Марка Плимсоля</span>
                    </div>

                    {/* Hull bottom plate info */}
                    <div className="text-center text-[10px] font-mono text-stone-300">
                      Стальная обшивка ({state.steelMassTons} т)
                    </div>

                    {/* Hydrostatic Water Pressure Arrows against bottom & sides */}
                    {showPressureVectors && (
                      <div className="absolute bottom-1 left-4 right-4 flex justify-around pointer-events-none">
                        <span className="text-blue-400 text-xs font-bold animate-pulse">↑</span>
                        <span className="text-blue-400 text-xs font-bold animate-pulse">↑</span>
                        <span className="text-blue-400 text-xs font-bold animate-pulse">↑</span>
                        <span className="text-blue-400 text-xs font-bold animate-pulse">↑</span>
                        <span className="text-blue-400 text-xs font-bold animate-pulse">↑</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Solid Steel Block */
                <div className="w-52 mx-auto h-32 bg-stone-700 border-4 border-stone-950 rounded-xs shadow-xl flex flex-col items-center justify-center text-white">
                  <span className="font-mono text-xs font-bold">Сплошной брусок стали</span>
                  <span className="text-[10px] font-mono text-stone-300">
                    7800 кг/м³ (без полостей)
                  </span>
                  <span className="text-[10px] text-red-300 mt-2 font-semibold bg-red-950/80 px-2 py-0.5 rounded">
                    Тонет камнем на дно!
                  </span>
                </div>
              )}
            </motion.div>

            {/* Overload Alert overlay */}
            {isOverloaded && (
              <div className="absolute inset-0 bg-red-950/40 backdrop-blur-2xs flex items-center justify-center pointer-events-none z-30">
                <div className="bg-red-900 text-white font-display px-5 py-3 text-sm rounded-xs shadow-xl border border-red-700 text-center">
                  <div className="font-bold text-base mb-1">⚠ Катастрофическая перегрузка!</div>
                  <div className="text-xs font-sans font-normal opacity-90">
                    Вес превысил максимальное водоизмещение. Судно затонуло.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Indicators Bar */}
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 bg-stone-50 rounded-xs border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block font-sans">
                Осадка судна
              </span>
              <span className="text-sm font-bold text-stone-900">
                {isOverloaded ? 'Затоплен' : `${draftMeters} м`}
              </span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xs border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block font-sans">
                Запас плавучести
              </span>
              <span
                className={`text-sm font-bold ${
                  reserveBuoyancyPercent < 15 ? 'text-red-700' : 'text-emerald-700'
                }`}
              >
                {reserveBuoyancyPercent}%
              </span>
            </div>
            <div className="p-2.5 bg-stone-50 rounded-xs border border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase block font-sans">
                Средняя плотность
              </span>
              <span className="text-sm font-bold text-stone-900">
                {averageDensity} кг/м³
              </span>
            </div>
          </div>
        </div>

        {/* Right: Structural Controls & Cargo Configuration */}
        <div className="lg:col-span-5 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-base font-semibold text-stone-900">
              Конструкция корпуса судна
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Сравните поведение монолитного металла и полого корабля:
            </p>
          </div>

          {/* Geometry Mode Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">Форма металла:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  onChange((prev) => ({ ...prev, isHollow: true }));
                }}
                className={`text-xs py-2 px-3 rounded-xs border text-left cursor-pointer transition-colors ${
                  state.isHollow
                    ? 'border-blue-700 bg-blue-50/80 font-semibold text-blue-950 shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                🚢 Полый корпус (судно)
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  onChange((prev) => ({ ...prev, isHollow: false }));
                }}
                className={`text-xs py-2 px-3 rounded-xs border text-left cursor-pointer transition-colors ${
                  !state.isHollow
                    ? 'border-stone-900 bg-stone-900 text-white font-medium shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                ⬛ Сплошной слиток стали
              </button>
            </div>
          </div>

          {/* Cargo & Hull Sliders */}
          {state.isHollow ? (
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-700 font-medium">Масса стального корпуса:</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {state.steelMassTons} тонн
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={250}
                  step={10}
                  value={state.steelMassTons}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    onChange((prev) => ({ ...prev, steelMassTons: v }));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-700 font-medium">Общий объём трюма:</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {state.hullVolumeM3} м³
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={50}
                  value={state.hullVolumeM3}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    onChange((prev) => ({ ...prev, hullVolumeM3: v }));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Cargo controls */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-stone-700 font-medium">Полезный груз (контейнеры):</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={removeCargoBox}
                      disabled={state.cargoTons <= 0}
                      className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs text-xs font-mono disabled:opacity-30 cursor-pointer"
                    >
                      -50 т
                    </button>
                    <button
                      type="button"
                      onClick={addCargoBox}
                      disabled={state.cargoTons >= 600}
                      className="px-2 py-0.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-mono disabled:opacity-30 cursor-pointer"
                    >
                      +50 т
                    </button>
                    <span className="font-mono font-bold text-blue-700 ml-1">
                      {state.cargoTons} т
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={600}
                  step={20}
                  value={state.cargoTons}
                  onChange={(e) => handleCargoChange(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-600">Стрелки давления воды на дно:</span>
                <button
                  type="button"
                  onClick={() => setShowPressureVectors(!showPressureVectors)}
                  className="text-xs font-mono text-blue-700 hover:underline cursor-pointer"
                >
                  {showPressureVectors ? 'Скрыть стрелки' : 'Показать стрелки'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-xs leading-relaxed">
              У сплошного бруска нет воздушной полости. Его объём равен только объёму самого металла ({solidSteelVolumeM3.toFixed(2)} м³). 
              Плотность равна 7800 кг/м³. Выталкивающая сила воды в 7.8 раз меньше его веса, поэтому он не может плавать.
            </div>
          )}

          {/* Plimsoll Mark & Law of Flotation Summary */}
          <div className="p-4 bg-[#F4F3EE] border border-[#E6E4DC] text-xs text-stone-700 rounded-xs space-y-2">
            <div className="font-bold text-stone-900">
              Закон плавания судов:
            </div>
            <p className="leading-relaxed">
              Судно плавает, пока его суммарная средняя плотность (сталь корпуса + воздух в каютах и трюмах + груз) меньше плотности забортной воды ({fluidDensity} кг/м³).
            </p>
            <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
              Грузовая марка Плимсоля на борту показывает предельную безопасную осадку в пресной и солёной воде разных широт.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
