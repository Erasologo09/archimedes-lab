import { Fluid, Material } from '../types/physics';

export const FLUID_PRESETS: Fluid[] = [
  {
    id: 'water',
    name: 'Вода (пресная)',
    density: 1000,
    color: 'rgba(122, 173, 235, 0.45)',
    waterSurfaceColor: '#60a5fa',
    viscosityHint: 'Стандартная среда при 4°C',
  },
  {
    id: 'seawater',
    name: 'Морская вода',
    density: 1030,
    color: 'rgba(74, 155, 222, 0.52)',
    waterSurfaceColor: '#38bdf8',
    viscosityHint: 'Повышенная плотность за счёт растворённых солей',
  },
  {
    id: 'oil',
    name: 'Масло растительное',
    density: 850,
    color: 'rgba(234, 179, 8, 0.35)',
    waterSurfaceColor: '#facc15',
    viscosityHint: 'Легче воды, поэтому плавает на её поверхности',
  },
  {
    id: 'glycerin',
    name: 'Глицерин',
    density: 1260,
    color: 'rgba(168, 85, 247, 0.28)',
    waterSurfaceColor: '#c084fc',
    viscosityHint: 'Густая плотная жидкость, сильное выталкивание',
  },
  {
    id: 'alcohol',
    name: 'Спирт (этанол)',
    density: 790,
    color: 'rgba(147, 197, 253, 0.25)',
    waterSurfaceColor: '#93c5fd',
    viscosityHint: 'Малая плотность, поэтому многие плавающие в воде тела здесь тонут',
  },
  {
    id: 'mercury',
    name: 'Ртуть (жидкий металл)',
    density: 13600,
    color: 'rgba(156, 163, 175, 0.75)',
    waterSurfaceColor: '#cbd5e1',
    viscosityHint: 'Колоссальная плотность: даже стальной шар плавает на поверхности!',
  },
];

export const MATERIAL_PRESETS: Material[] = [
  {
    id: 'custom',
    name: 'Произвольное тело',
    density: 800,
    color: '#3b82f6',
    description: 'Настраиваемые масса и объём',
  },
  {
    id: 'cork',
    name: 'Пробка',
    density: 240,
    color: '#d97706',
    description: 'Очень лёгкий пористый материал, вытесняет минимум',
  },
  {
    id: 'pine',
    name: 'Сосна (дерево)',
    density: 500,
    color: '#b45309',
    description: 'Погружается ровно наполовину в пресной воде',
  },
  {
    id: 'oak',
    name: 'Дуб (плотное дерево)',
    density: 720,
    color: '#78350f',
    description: 'Погружается примерно на 72% объёма',
  },
  {
    id: 'ice',
    name: 'Лёд',
    density: 917,
    color: '#7dd3fc',
    description: 'Около 90% айсберга скрыто под водой!',
  },
  {
    id: 'aluminum',
    name: 'Алюминий',
    density: 2700,
    color: '#94a3b8',
    description: 'Легкий металл, но в 2.7 раза плотнее воды: тонет',
  },
  {
    id: 'steel',
    name: 'Сталь / Железо',
    density: 7800,
    color: '#475569',
    description: 'Тяжелый металл, быстро идёт ко дну',
  },
  {
    id: 'gold',
    name: 'Золото',
    density: 19300,
    color: '#eab308',
    description: 'Один из самых плотных металлов на Земле',
  },
];

export const G_CONST = 9.81; // m/s^2

export const SHIP_SALINITY_DENSITIES = {
  fresh: { name: 'Пресная вода (река / озеро)', density: 1000 },
  ocean: { name: 'Океаническая вода (Атлантика)', density: 1025 },
  deadsea: { name: 'Сверхсолёная вода (Мёртвое море)', density: 1240 },
};
