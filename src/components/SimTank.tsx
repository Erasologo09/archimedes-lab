import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimState } from '../types/physics';
import { FLUID_PRESETS, MATERIAL_PRESETS, G_CONST } from '../data/physicsData';
import { playWaterPlop, playTactileClick } from '../utils/audio';

interface SimTankProps {
  state: SimState;
  onChange: (updater: (prev: SimState) => SimState) => void;
  onReset: () => void;
}

export const SimTank: React.FC<SimTankProps> = ({ state, onChange, onReset }) => {
  const currentFluid =
    FLUID_PRESETS.find((f) => f.id === state.fluidId) || FLUID_PRESETS[0];
  const fluidDensity =
    state.fluidId === 'custom' ? state.customFluidDensity : currentFluid.density;

  const currentMaterial =
    MATERIAL_PRESETS.find((m) => m.id === state.materialId) || MATERIAL_PRESETS[0];

  // Body calculations
  const bodyDensity = Math.round(state.mass / (state.volume / 1000)); // kg/m^3
  const isLighterThanFluid = bodyDensity < fluidDensity;
  const isNeutral = Math.abs(bodyDensity - fluidDensity) < 10;

  // Determine equilibrium submerged fraction (0 to 1)
  const equilibriumFraction = Math.min(1, Math.max(0, bodyDensity / fluidDensity));

  // Effective submerged percentage
  const effectiveSubmerged = state.isAutoEquilibrium
    ? Math.round(equilibriumFraction * 100)
    : state.submergedPercent;

  const submergedVolumeLiters = (state.volume * effectiveSubmerged) / 100;
  const submergedVolumeM3 = submergedVolumeLiters / 1000;

  // Forces
  const archimedesForce = fluidDensity * G_CONST * submergedVolumeM3;
  const gravityForce = state.mass * G_CONST;
  const netForce = archimedesForce - gravityForce; // Upward is positive

  // Status calculation
  let statusText = 'Тело плавает в равновесии';
  let statusClass = 'text-blue-900 bg-blue-50 border-blue-200';

  if (state.isAutoEquilibrium) {
    if (bodyDensity > fluidDensity) {
      statusText = 'Тело тонет: покоится на дне';
      statusClass = 'text-amber-950 bg-amber-50 border-amber-300';
    } else if (isNeutral) {
      statusText = 'Тело зависло во взвешенном состоянии';
      statusClass = 'text-emerald-950 bg-emerald-50 border-emerald-300';
    } else {
      statusText = `Тело плавает: погружено на ${Math.round(equilibriumFraction * 100)}%`;
      statusClass = 'text-blue-900 bg-blue-50 border-blue-300';
    }
  } else {
    if (Math.abs(netForce) < 0.1) {
      statusText = 'Силы скомпенсированы (равновесие)';
      statusClass = 'text-blue-900 bg-blue-50 border-blue-300';
    } else if (netForce > 0) {
      statusText = 'Выталкивание преобладает: тело стремится вверх';
      statusClass = 'text-indigo-950 bg-indigo-50 border-indigo-300';
    } else {
      statusText = 'Тяжесть преобладает: тело стремится вниз';
      statusClass = 'text-stone-900 bg-stone-100 border-stone-300';
    }
  }

  // Visual tank coordinates
  const tankHeight = 360;
  const objectHeightPx = 76;
  const waterRisePx = Math.min(28, (submergedVolumeLiters / 4) * 28);
  const waterSurfaceY = 100 - waterRisePx;

  // Target object Y
  let targetObjectY: number;
  if (state.isAutoEquilibrium) {
    if (bodyDensity > fluidDensity) {
      targetObjectY = tankHeight - objectHeightPx - 10;
    } else if (isNeutral) {
      targetObjectY = waterSurfaceY + (tankHeight - 10 - waterSurfaceY - objectHeightPx) * 0.45;
    } else {
      targetObjectY = waterSurfaceY - objectHeightPx * (1 - equilibriumFraction);
    }
  } else {
    const subFrac = effectiveSubmerged / 100;
    targetObjectY = waterSurfaceY - objectHeightPx * (1 - subFrac);
    if (subFrac === 1) {
      targetObjectY = waterSurfaceY + 20;
    }
  }

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const startDragYRef = useRef(0);
  const startPercentRef = useRef(effectiveSubmerged);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startDragYRef.current = e.clientY;
    startPercentRef.current = state.submergedPercent;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    playTactileClick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - startDragYRef.current;
    // Drag down increases submersion
    const deltaPercent = (deltaY / 120) * 100;
    const newPercent = Math.min(100, Math.max(10, Math.round(startPercentRef.current + deltaPercent)));

    if (newPercent !== state.submergedPercent) {
      onChange((prev) => ({
        ...prev,
        isAutoEquilibrium: false,
        submergedPercent: newPercent,
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignored
      }
      playWaterPlop();
    }
  };

  // Vector lengths
  const maxForceForScale = Math.max(1, Math.max(archimedesForce, gravityForce));
  const vectorUpLength = Math.min(100, Math.max(20, (archimedesForce / maxForceForScale) * 95));
  const vectorDownLength = Math.min(100, Math.max(20, (gravityForce / maxForceForScale) * 95));

  // Pressures
  const depthTopMeters = Math.max(0, (targetObjectY - waterSurfaceY) / 220);
  const depthBottomMeters = Math.max(0, (targetObjectY + objectHeightPx - waterSurfaceY) / 220);
  const pTopPa = Math.round(fluidDensity * G_CONST * depthTopMeters);
  const pBottomPa = Math.round(fluidDensity * G_CONST * depthBottomMeters);

  const handleMaterialSelect = (matId: string) => {
    playTactileClick();
    const mat = MATERIAL_PRESETS.find((m) => m.id === matId);
    if (!mat) return;
    if (mat.id === 'custom') {
      onChange((prev) => ({ ...prev, materialId: 'custom' }));
    } else {
      const vol = 1.5;
      const mass = Number(((mat.density * (vol / 1000))).toFixed(2));
      onChange((prev) => ({
        ...prev,
        materialId: mat.id,
        volume: vol,
        mass: Math.max(0.1, mass),
      }));
      playWaterPlop(1.1);
    }
  };

  return (
    <section id="simulator" className="py-20 border-b border-[#E6E4DC] max-w-6xl mx-auto px-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-blue-700 font-medium mb-2">
          Интерактивный опыт 1
        </p>
        <h2 className="text-3xl md:text-5xl font-display text-stone-900 leading-tight mb-3">
          Гидростатический бассейн
        </h2>
        <p className="text-stone-600 text-sm md:text-base leading-relaxed">
          Перетаскивайте тело курсором или регулируйте ползунки. Векторы сил, уровень вытеснения и распределение гидростатического давления пересчитываются мгновенно с живой физической анимацией.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Dynamic Visual Physics Tank */}
        <div className="lg:col-span-6 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Живая схема сил и давления
            </span>
            <span className="text-xs text-stone-400 font-mono">
              g = 9.81 м/с²
            </span>
          </div>

          {/* Interactive Tank Canvas */}
          <div className="relative w-full h-[380px] bg-gradient-to-b from-stone-50 to-stone-100/60 border-2 border-stone-300 rounded-b-md overflow-hidden select-none">
            {/* Water / Fluid Container with animated wave top */}
            <motion.div
              className="absolute left-0 right-0 bottom-0 overflow-hidden"
              animate={{
                top: waterSurfaceY,
                backgroundColor: currentFluid.color,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              {/* Animated wave surface highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-2 opacity-90"
                style={{ backgroundColor: currentFluid.waterSurfaceColor }}
              />

              {/* Gentle underwater caustic beams */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />

              {/* Ambient water bubbles rising */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
                <div className="absolute bottom-8 left-3/4 w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                <div className="absolute bottom-16 left-1/2 w-1 h-1 rounded-full bg-white/70" />
              </div>

              {/* Surface markers */}
              <div className="absolute left-3 top-2 text-[10px] text-stone-700/80 font-mono font-medium">
                Уровень жидкости: h = 0
              </div>
              <div className="absolute left-3 bottom-2 text-[10px] text-stone-700/80 font-mono">
                Дно резервуара
              </div>
            </motion.div>

            {/* Draggable & Floating Physical Body */}
            <motion.div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              animate={{
                top: targetObjectY,
              }}
              transition={{
                type: 'spring',
                stiffness: state.isAutoEquilibrium ? 180 : 320,
                damping: 22,
              }}
              className="absolute left-1/2 -translate-x-1/2 w-36 rounded-xs border-2 border-stone-900 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing active:scale-102 z-20 transition-transform"
              style={{
                height: `${objectHeightPx}px`,
                backgroundColor: currentMaterial.color,
              }}
            >
              {/* Drag indicator hint */}
              <div className="absolute -top-6 text-[10px] font-mono text-stone-400 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none whitespace-nowrap">
                ↕ Потяните для погружения
              </div>

              <span className="text-white font-mono font-bold text-xs tracking-wider drop-shadow-sm pointer-events-none">
                V = {state.volume.toFixed(1)} л
              </span>
              <span className="text-white/95 text-[10px] font-mono drop-shadow-sm pointer-events-none">
                m = {state.mass.toFixed(1)} кг
              </span>

              {/* Force Vector UP: Archimedes */}
              <motion.div
                className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none mb-1 z-30"
                animate={{ height: vectorUpLength }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              >
                <div className="text-[11px] font-mono font-bold text-blue-700 whitespace-nowrap bg-white/95 border border-blue-200 px-1.5 py-0.5 rounded shadow-xs mb-1">
                  ↑ F<sub>А</sub> = {archimedesForce.toFixed(1)} Н
                </div>
                <div
                  className="w-1 bg-blue-600 rounded-full shadow-xs"
                  style={{ height: `${Math.max(4, vectorUpLength - 24)}px` }}
                />
              </motion.div>

              {/* Force Vector DOWN: Gravity (mg) */}
              <motion.div
                className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none mt-1 z-30"
                animate={{ height: vectorDownLength }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              >
                <div
                  className="w-1 bg-stone-900 rounded-full shadow-xs"
                  style={{ height: `${Math.max(4, vectorDownLength - 24)}px` }}
                />
                <div className="text-[11px] font-mono font-bold text-stone-900 whitespace-nowrap bg-white/95 border border-stone-200 px-1.5 py-0.5 rounded shadow-xs mt-1">
                  mg = {gravityForce.toFixed(1)} Н ↓
                </div>
              </motion.div>
            </motion.div>

            {/* Live Hydrostatic Pressure HUD */}
            <div className="absolute right-3 top-3 bg-white/90 backdrop-blur-xs border border-stone-200 p-2.5 text-[10px] font-mono rounded shadow-xs space-y-1 z-30">
              <div className="text-stone-500 font-semibold border-b border-stone-200 pb-0.5 uppercase tracking-wider">
                Давление столба:
              </div>
              <div className="text-stone-700">
                P<sub>верх</sub> ≈ {pTopPa} Па
              </div>
              <div className="text-blue-700 font-semibold">
                P<sub>низ</sub> ≈ {pBottomPa} Па
              </div>
              <div className="text-[9px] text-stone-500 pt-0.5 border-t border-stone-100">
                ΔP = {(pBottomPa - pTopPa)} Па (толкает вверх)
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Динамическое состояние:</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${statusClass}`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Right: Controls Deck */}
        <div className="lg:col-span-6 bg-white border border-[#E6E4DC] p-6 rounded-sm shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-base font-semibold text-stone-900">
              Параметры эксперимента
            </h3>
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onReset();
              }}
              className="text-xs font-medium text-stone-500 hover:text-stone-900 hover:underline cursor-pointer"
            >
              Сбросить к исходным
            </button>
          </div>

          {/* Fluid Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 flex justify-between">
              <span>Среда (жидкость):</span>
              <span className="font-mono text-blue-700 font-bold">{fluidDensity} кг/м³</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {FLUID_PRESETS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onChange((prev) => ({ ...prev, fluidId: f.id }));
                  }}
                  className={`text-xs py-2 px-2.5 rounded-xs border text-left transition-all cursor-pointer truncate ${
                    state.fluidId === f.id
                      ? 'border-blue-600 bg-blue-50/80 font-semibold text-blue-950 shadow-2xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                  title={`${f.name}: ${f.density} кг/м³`}
                >
                  {f.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Material Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 flex justify-between">
              <span>Образец / Материал:</span>
              <span className="font-mono text-stone-600 font-medium">{currentMaterial.name}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {MATERIAL_PRESETS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMaterialSelect(m.id)}
                  className={`text-xs py-1.5 px-2 rounded-xs border transition-all cursor-pointer truncate text-center ${
                    state.materialId === m.id
                      ? 'border-stone-900 bg-stone-900 text-white font-medium shadow-2xs'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                  title={`${m.name} (${m.density} кг/м³)`}
                >
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            {/* Mass */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Масса тела:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {state.mass.toFixed(1)} кг
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={4.0}
                step={0.1}
                value={state.mass}
                onChange={(e) => {
                  const m = parseFloat(e.target.value);
                  onChange((prev) => ({
                    ...prev,
                    mass: m,
                    materialId: 'custom',
                  }));
                }}
                className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Volume */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-700 font-medium">Полный объём тела:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {state.volume.toFixed(1)} л
                </span>
              </div>
              <input
                type="range"
                min={0.3}
                max={3.0}
                step={0.1}
                value={state.volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onChange((prev) => ({
                    ...prev,
                    volume: v,
                    materialId: 'custom',
                  }));
                }}
                className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Submersion mode */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700">Режим погружения:</span>
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onChange((prev) => ({
                      ...prev,
                      isAutoEquilibrium: !prev.isAutoEquilibrium,
                    }));
                  }}
                  className="text-xs text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  {state.isAutoEquilibrium
                    ? 'Включить ручное удержание'
                    : 'Включить свободное плавание'}
                </button>
              </div>

              {!state.isAutoEquilibrium ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600">Погружённая часть объёма:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {state.submergedPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={state.submergedPercent}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        submergedPercent: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                  />
                </div>
              ) : (
                <div className="p-2.5 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-xs flex items-center justify-between">
                  <span>Равновесие в среде:</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {bodyDensity > fluidDensity
                      ? '100% (лежит на дне)'
                      : `${Math.round(equilibriumFraction * 100)}% погружено`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Numerical Readout */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xs text-center font-mono">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-sans">
                Сила Архимеда
              </span>
              <span className="text-sm md:text-base font-bold text-blue-700">
                {archimedesForce.toFixed(1)} Н
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-sans">
                Вес тела (mg)
              </span>
              <span className="text-sm md:text-base font-bold text-stone-900">
                {gravityForce.toFixed(1)} Н
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-sans">
                Плотность тела
              </span>
              <span className="text-sm md:text-base font-bold text-stone-900">
                {bodyDensity} кг/м³
              </span>
            </div>
          </div>

          {/* Real-time editorial physics note */}
          <p className="text-xs text-stone-600 bg-blue-50/50 p-3 rounded-xs border-l-2 border-blue-500">
            {isLighterThanFluid
              ? `Для свободного плавания телу достаточно погрузить примерно ${Math.round(
                  equilibriumFraction * 100
                )}% своего объёма. Масса вытесненной жидкости (${(
                  submergedVolumeLiters * (fluidDensity / 1000)
                ).toFixed(2)} кг) в точности равна массе тела.`
              : isNeutral
              ? 'Плотности тела и жидкости совпали: тело находится в состоянии безразличного равновесия на любой глубине.'
              : 'Плотность тела превышает плотность среды: выталкивающей силы недостаточно для удержания веса, поэтому тело опускается на дно.'}
          </p>
        </div>
      </div>
    </section>
  );
};
