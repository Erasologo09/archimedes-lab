import { SimState, CrownState, ShipState } from '../types/physics';
import { FLUID_PRESETS, MATERIAL_PRESETS, G_CONST } from '../data/physicsData';

interface ContextState {
  sim: SimState;
  crown: CrownState;
  ship: ShipState;
}

export async function askPhysicsAssistant(
  question: string,
  context: ContextState
): Promise<string> {
  const currentFluid =
    FLUID_PRESETS.find((f) => f.id === context.sim.fluidId) || FLUID_PRESETS[0];
  const fluidDensity =
    context.sim.fluidId === 'custom'
      ? context.sim.customFluidDensity
      : currentFluid.density;
  const currentMaterial =
    MATERIAL_PRESETS.find((m) => m.id === context.sim.materialId) ||
    MATERIAL_PRESETS[0];

  const objDensity = Math.round((context.sim.mass / (context.sim.volume / 1000))); // kg/m^3
  const submergedVolM3 = (context.sim.volume / 1000) * (context.sim.submergedPercent / 100);
  const archimedesForce = fluidDensity * G_CONST * submergedVolM3;
  const gravityForce = context.sim.mass * G_CONST;

  const normalizedQ = question.trim().toLowerCase();

  // If user asks about the ship
  if (
    normalizedQ.includes('корабл') ||
    normalizedQ.includes('плава') ||
    normalizedQ.includes('сталь') ||
    normalizedQ.includes('плимсол')
  ) {
    const totalMass = context.ship.steelMassTons + context.ship.cargoTons;
    const avgDensity = Math.round((totalMass * 1000) / context.ship.hullVolumeM3);
    return `Корабль держится на воде благодаря воздуху в трюме! 
Плотность сплошной стали: 7800 кг/м³ (она камнем идёт на дно). Но корпус судна полый. 
При массе стали ${context.ship.steelMassTons} т и грузе ${context.ship.cargoTons} т, общий объём трюма составляет ${context.ship.hullVolumeM3} м³. 
Средняя плотность корабля с грузом равна: ρ = m / V = (${totalMass} · 1000 кг) / ${context.ship.hullVolumeM3} м³ = ${avgDensity} кг/м³. 
Поскольку ${avgDensity} кг/м³ ${avgDensity < 1025 ? '< 1025 кг/м³ (плотность морской воды), корабль плавает с запасом плавучести!' : '> 1025 кг/м³, судно перегружено и тонет!'}`;
  }

  // If user asks about depth
  if (normalizedQ.includes('глубин') || normalizedQ.includes('давлен')) {
    return `Распространённое заблуждение: «на глубине сила Архимеда растёт, потому что давление выше».
На самом деле выталкивающая сила F_А = ρ_ж · g · V_погр зависит ТОЛЬКО от плотности жидкости и вытесненного объёма тела. 
Да, гидростатическое давление p = ρgh растёт с глубиной, но оно растёт ОДИНАКОВО и для верхней грани тела, и для нижней. Разность сил давления (снизу минус сверху), которая и толкает тело вверх, остаётся строго неизменной на любой глубине в несжимаемой воде!`;
  }

  // If user asks about oil or other fluids
  if (normalizedQ.includes('масл') || normalizedQ.includes('жидкост') || normalizedQ.includes('плотност')) {
    return `В растительном масле (плотность ~850 кг/м³) выталкивающая сила меньше, чем в воде (1000 кг/м³), ровно в 1000/850 ≈ 1.18 раза при том же погружённом объёме.
Поэтому любое плавающее тело в масле вынуждено погрузиться глубже, чтобы вытеснить бóльший объём жидкости и уравновесить силу тяжести. А тела с плотностью от 850 до 1000 кг/м³ (например, лёд или воск), которые плавают в воде, в масле сразу тонут!`;
  }

  // If user asks about the crown / Hiero
  if (
    normalizedQ.includes('корон') ||
    normalizedQ.includes('эврик') ||
    normalizedQ.includes('золот') ||
    normalizedQ.includes('серебр')
  ) {
    const goldPct = Math.round(context.crown.goldRatio * 100);
    const silverPct = 100 - goldPct;
    return `Суть задачи царя Гиерона:
Золото чрезвычайно плотное (19 300 кг/м³), а серебро вдвое легче (10 500 кг/м³). 
Если корона весит ровно 1000 граммов, но содержит ${silverPct}% серебра и ${goldPct}% золота, её объём заметно БОЛЬШЕ, чем у монолитного слитка чистого золота той же массы. 
Погрузив их в воду, Архимед увидел: корона с серебром вытесняет больше воды (в переливном сосуде), а на гидростатических весах выталкивающая сила Архимеда F_А сильнее приподнимает корону, наклоняя коромысло в сторону золотого слитка!`;
  }

  // If user asks about current simulator numbers
  if (
    normalizedQ.includes('мои') ||
    normalizedQ.includes('текущ') ||
    normalizedQ.includes('расчет') ||
    normalizedQ.includes('опыт') ||
    normalizedQ.includes('формул')
  ) {
    const stateText =
      archimedesForce > gravityForce + 0.1
        ? 'тело всплывает на поверхность (F_А > mg)'
        : Math.abs(archimedesForce - gravityForce) <= 0.1
        ? 'тело находится в гидростатическом равновесии (F_А = mg)'
        : 'тело тонет на дно (F_А < mg)';

    return `Анализ вашей текущей лаборатории:
• Среда: ${currentFluid.name} (ρ = ${fluidDensity} кг/м³)
• Образец: ${currentMaterial.name}, масса m = ${context.sim.mass.toFixed(2)} кг, объём V = ${context.sim.volume.toFixed(2)} л
• Плотность тела: ρ_т = ${objDensity} кг/м³
• Текущее погружение: ${context.sim.submergedPercent}% (V_погр = ${(submergedVolM3 * 1000).toFixed(2)} л)

Сила Архимеда: F_А = ρ_ж · g · V_погр = ${fluidDensity} · 9.81 · ${(submergedVolM3).toFixed(5)} = ${archimedesForce.toFixed(2)} Н.
Сила тяжести: F_тяж = m · g = ${context.sim.mass.toFixed(2)} · 9.81 = ${gravityForce.toFixed(2)} Н.
Результат: ${stateText}.`;
  }

  // Default deep physics breakdown
  return `Закон Архимеда формулируется просто: «На тело, погружённое в жидкость или газ, действует выталкивающая сила, направленная вертикально вверх и равная весу вытесненной жидкости: F_А = ρ_ж · g · V_погр».
В вашем опыте сейчас: F_А = ${archimedesForce.toFixed(1)} Н, а вес тела mg = ${gravityForce.toFixed(1)} Н. 
${
  objDensity < fluidDensity
    ? `Так как плотность тела (${objDensity} кг/м³) меньше плотности жидкости (${fluidDensity} кг/м³), при свободном плавании погрузится ровно ${Math.round((objDensity / fluidDensity) * 100)}% объёма.`
    : `Так как плотность тела (${objDensity} кг/м³) больше плотности жидкости (${fluidDensity} кг/м³), тело непременно опустится на дно.`
}`;
}
