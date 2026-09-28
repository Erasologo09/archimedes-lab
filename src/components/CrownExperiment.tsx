import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CrownState } from '../types/physics';
import { playWaterPlop, playBalanceChime, playTactileClick } from '../utils/audio';

interface CrownExperimentProps {
  state: CrownState;
  onChange: (updater: (prev: CrownState) => CrownState) => void;
}

export const CrownExperiment: React.FC<CrownExperimentProps> = ({ state, onChange }) => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<'crown' | 'gold_bar'>('crown');

  // Physical constants
  const DENSITY_GOLD = 19.32; // g/cm^3
  const DENSITY_SILVER = 10.49; // g/cm^3

  // Total mass is 1000g
  const totalMass = 1000;
  const goldMass = totalMass * state.goldRatio;
  const silverMass = totalMass * (1 - state.goldRatio);

  // Volumes in cm^3 (mL)
  const volPureGold = totalMass / DENSITY_GOLD; // ~51.76 cm^3
  const volCrownGoldPart = goldMass / DENSITY_GOLD;
  const volCrownSilverPart = silverMass / DENSITY_SILVER;
  const volCrownTotal = volCrownGoldPart + volCrownSilverPart;

  const currentVol = selectedSpecimen === 'crown' ? volCrownTotal : volPureGold;
  const averageCrownDensity = totalMass / volCrownTotal;
  const extraVolumeDisplaced = volCrownTotal - volPureGold;
  const isPure = state.goldRatio >= 0.99;

  // Hydrostatic scale tilt angle
  const buoyancyDiffGrams = state.isSubmerged ? (volCrownTotal - volPureGold) : 0;
  const tiltDegrees = state.isSubmerged ? Math.min(18, buoyancyDiffGrams * 0.9) : 0;

  const handleToggleSubmerge = () => {
    const nextSubmerged = !state.isSubmerged;
    onChange((prev) => ({ ...prev, isSubmerged: nextSubmerged }));
    if (nextSubmerged) {
      playWaterPlop(0.9);
      if (state.activeApparatus === 'balance') {
        setTimeout(() => playBalanceChime(), 400);
      }
    } else {
      playTactileClick();
    }
  };

  const handleSelectApparatus = (app: 'overflow' | 'balance') => {
    playTactileClick();
    onChange((prev) => ({ ...prev, activeApparatus: app }));
  };

  return (
    <section id="crown-lab" className="py-20 border-b border-[#E6E4DC] max-w-6xl mx-auto px-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-amber-700 font-medium mb-2">
          Интерактивный опыт 2: Историческая реконструкция
        </p>
        <h2 className="text-3xl md:text-5xl font-display text-stone-900 leading-tight mb-3">
          «Эврика!»: Загадка царской короны
        </h2>
        <p className="text-stone-600 text-sm md:text-base leading-relaxed">
          Царь Гиерон заподозрил ювелира в краже золота. Масса короны строго равна 1000 граммам, как и слиток чистого золота. Проверьте состав короны методом Архимеда, не разрушая реликвию.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Apparatus Visualization */}
        <div className="lg:col-span-7 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs flex flex-col">
          {/* Apparatus Selector Tabs */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Прибор Архимеда
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSelectApparatus('overflow')}
                className={`text-xs px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                  state.activeApparatus === 'overflow'
                    ? 'bg-stone-900 text-white font-medium shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                1. Переливной сосуд
              </button>
              <button
                type="button"
                onClick={() => handleSelectApparatus('balance')}
                className={`text-xs px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                  state.activeApparatus === 'balance'
                    ? 'bg-stone-900 text-white font-medium shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                2. Гидростатические весы
              </button>
            </div>
          </div>

          {/* Apparatus 1: Overflow Eureka Vessel */}
          {state.activeApparatus === 'overflow' && (
            <div className="relative w-full h-[370px] bg-gradient-to-b from-stone-50 to-stone-100/50 border border-stone-200 rounded-sm p-4 flex items-center justify-around select-none overflow-hidden">
              {/* Main Tank with Overflow Spout */}
              <div className="relative w-52 h-64 bg-stone-100 border-2 border-stone-400 rounded-b-md flex flex-col justify-end overflow-visible shadow-xs">
                {/* Spout on right side */}
                <div className="absolute -right-7 top-10 w-8 h-3.5 bg-stone-300 border-t-2 border-b-2 border-stone-400 -rotate-12 z-10" />

                {/* Water inside vessel */}
                <div className="w-full bg-blue-400/40 border-t-2 border-blue-500 transition-all duration-500" style={{ height: '215px' }}>
                  {/* Overflow stream if submerged */}
                  {state.isSubmerged && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 140 }}
                      className="absolute -right-8 top-13 w-1.5 bg-blue-500/80 rounded-full z-20 shadow-xs"
                    />
                  )}
                </div>

                {/* Submerged Object (Crown or Gold Bar) */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                  animate={{
                    bottom: state.isSubmerged ? 25 : 185,
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                >
                  {/* Suspension Wire */}
                  <div className="w-0.5 h-32 bg-stone-400 mb-0.5" />

                  {selectedSpecimen === 'crown' ? (
                    <div className="w-16 h-12 rounded-t-lg bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-2 border-amber-600 flex items-center justify-center shadow-md text-stone-900 text-xs font-bold text-center leading-none">
                      👑<br />Корона
                    </div>
                  ) : (
                    <div className="w-14 h-9 bg-gradient-to-b from-yellow-400 to-amber-600 border-2 border-amber-700 flex items-center justify-center shadow-md text-stone-900 text-[11px] font-mono font-bold">
                      Слиток Au
                    </div>
                  )}
                </motion.div>

                <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-500 font-medium">
                  Сосуд до краёв
                </div>
              </div>

              {/* Measuring Cylinder for Displaced Water */}
              <div className="relative w-24 h-64 flex flex-col items-center justify-end">
                <div className="w-16 h-52 bg-white/90 border-2 border-stone-400 rounded-b-sm relative flex flex-col justify-end overflow-hidden shadow-2xs">
                  {/* Graduated tick lines */}
                  <div className="absolute left-1 top-2 bottom-2 flex flex-col justify-between text-[8px] font-mono text-stone-400 pointer-events-none select-none">
                    <span>100 см³</span>
                    <span>80 см³</span>
                    <span>60 см³</span>
                    <span>40 см³</span>
                    <span>20 см³</span>
                    <span>0 см³</span>
                  </div>

                  {/* Displaced Water Fill with Spring Animation */}
                  <motion.div
                    className="w-full bg-blue-500/60 border-t-2 border-blue-600"
                    animate={{
                      height: state.isSubmerged ? `${(currentVol / 100) * 190}px` : '0px',
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[10px] text-stone-500 uppercase block font-medium">
                    Мензурка
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {state.isSubmerged ? `${currentVol.toFixed(1)} см³` : '0 см³'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Apparatus 2: Hydrostatic Balance */}
          {state.activeApparatus === 'balance' && (
            <div className="relative w-full h-[370px] bg-gradient-to-b from-stone-50 to-stone-100/50 border border-stone-200 rounded-sm p-4 flex flex-col items-center justify-between select-none overflow-hidden">
              {/* Balance Beam pivot */}
              <div className="relative w-full h-48 flex flex-col items-center pt-3">
                {/* Central Fulcrum Stand */}
                <div className="w-3 h-32 bg-stone-600 rounded-t-sm shadow-xs" />
                <div className="w-20 h-3 bg-stone-700 rounded-sm shadow-xs" />

                {/* Rotating Beam with Spring Dynamics */}
                <motion.div
                  className="absolute top-4 w-76 h-2.5 bg-stone-800 rounded-full origin-center flex items-center justify-between px-1 shadow-md"
                  animate={{
                    rotate: tiltDegrees,
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-stone-300 border border-stone-900" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                </motion.div>

                {/* Left Pan (Crown) */}
                <motion.div
                  className="absolute top-6 left-12 flex flex-col items-center"
                  animate={{
                    y: tiltDegrees * 1.6,
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                >
                  <div className="w-0.5 h-22 bg-stone-400" />
                  <div className="w-14 h-9 rounded-t-lg bg-amber-400 border border-amber-600 flex items-center justify-center text-xs font-bold shadow-xs">
                    👑 Корона
                  </div>
                  <span className="text-[9px] font-mono text-stone-600 mt-1">
                    1000 г
                  </span>
                </motion.div>

                {/* Right Pan (Pure Gold Ingot) */}
                <motion.div
                  className="absolute top-6 right-12 flex flex-col items-center"
                  animate={{
                    y: -tiltDegrees * 1.6,
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                >
                  <div className="w-0.5 h-22 bg-stone-400" />
                  <div className="w-14 h-7 bg-yellow-500 border border-amber-700 flex items-center justify-center text-[10px] font-mono font-bold shadow-xs">
                    Слиток Au
                  </div>
                  <span className="text-[9px] font-mono text-stone-600 mt-1">
                    1000 г
                  </span>
                </motion.div>
              </div>

              {/* Water basins below pans */}
              <div className="w-full flex justify-between px-6 pb-2">
                <div className="w-28 h-20 bg-blue-100/60 border border-blue-300 rounded-b-sm flex items-center justify-center text-[10px] text-blue-700 font-mono text-center p-1">
                  {state.isSubmerged ? 'Вода (выталкивание короны)' : 'Сухой сосуд'}
                </div>
                <div className="w-28 h-20 bg-blue-100/60 border border-blue-300 rounded-b-sm flex items-center justify-center text-[10px] text-blue-700 font-mono text-center p-1">
                  {state.isSubmerged ? 'Вода (выталкивание золота)' : 'Сухой сосуд'}
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {state.activeApparatus === 'overflow' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setSelectedSpecimen('crown');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                      selectedSpecimen === 'crown'
                        ? 'border-amber-600 bg-amber-50 font-semibold text-amber-900 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Погружать корону
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setSelectedSpecimen('gold_bar');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xs border transition-colors cursor-pointer ${
                      selectedSpecimen === 'gold_bar'
                        ? 'border-yellow-600 bg-yellow-50 font-semibold text-yellow-900 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Погружать слиток Au
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleSubmerge}
              className={`text-xs font-semibold px-4 py-2 rounded-xs transition-colors cursor-pointer shadow-xs ${
                state.isSubmerged
                  ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {state.isSubmerged ? 'Извлечь из воды ↑' : 'Погрузить в воду ↓'}
            </button>
          </div>
        </div>

        {/* Right: Gold Content Controls & Physics Calculations */}
        <div className="lg:col-span-5 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs space-y-5">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="text-base font-semibold text-stone-900">
              Состав царской короны (1000 г)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Регулируйте долю золота, подмешанного мастером:
            </p>
          </div>

          {/* Slider for Gold Ratio */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-amber-800">
                Золото: {Math.round(state.goldRatio * 100)}% ({Math.round(goldMass)} г)
              </span>
              <span className="text-stone-500">
                Серебро: {Math.round((1 - state.goldRatio) * 100)}% ({Math.round(silverMass)} г)
              </span>
            </div>
            <input
              type="range"
              min={0.4}
              max={1.0}
              step={0.05}
              value={state.goldRatio}
              onChange={(e) => {
                const ratio = parseFloat(e.target.value);
                onChange((prev) => ({ ...prev, goldRatio: ratio }));
              }}
              className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Physical Parameters Comparison */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-600">Объём слитка чистого золота:</span>
                <span className="font-mono font-bold text-stone-900">
                  {volPureGold.toFixed(1)} см³
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Объём короны ювелира:</span>
                <span className="font-mono font-bold text-amber-700">
                  {volCrownTotal.toFixed(1)} см³
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-1">
                <span className="text-stone-600">Разница вытесненного объёма:</span>
                <span className="font-mono font-bold text-blue-700">
                  +{extraVolumeDisplaced.toFixed(1)} см³ воды
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Средняя плотность короны:</span>
                <span className="font-mono font-bold text-stone-900">
                  {averageCrownDensity.toFixed(2)} г/см³
                </span>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div
            className={`p-4 rounded-xs border text-xs leading-relaxed ${
              isPure
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
              {isPure ? '✓ Корона из чистого золота' : '⚠ Обман ювелира доказан!'}
            </div>
            {isPure ? (
              <p>
                Корона вытеснила ровно столько же воды, сколько и слиток чистого золота ({volPureGold.toFixed(1)} см³). На гидростатических весах в воде обе чаши остались в строгом равновесии.
              </p>
            ) : (
              <p>
                Серебро имеет меньшую плотность (10,5 против 19,3 г/см³), поэтому при той же массе в 1000 г корона имеет объём больше на{' '}
                <strong>{extraVolumeDisplaced.toFixed(1)} см³</strong>. Вода выталкивает её сильнее, и весы в воде перевешивают в сторону чистого золота!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
