/**
 * Type definitions for Archimedes Principle Interactive Lab
 */

export interface Fluid {
  id: string;
  name: string;
  density: number; // kg/m^3
  color: string;
  waterSurfaceColor: string;
  viscosityHint?: string;
}

export interface Material {
  id: string;
  name: string;
  density: number; // kg/m^3
  color: string;
  texture?: string;
  description: string;
}

export interface SimState {
  fluidId: string;
  customFluidDensity: number;
  materialId: string;
  mass: number; // kg
  volume: number; // Liters
  submergedPercent: number; // 0 to 100
  isAutoEquilibrium: boolean;
}

export interface CrownState {
  goldRatio: number; // 0.4 to 1.0 (e.g. 0.7 = 70% gold, 30% silver)
  totalMass: number; // grams (1000g)
  isSubmerged: boolean;
  activeApparatus: 'overflow' | 'balance';
}

export interface ShipState {
  isHollow: boolean;
  steelMassTons: number;
  hullVolumeM3: number;
  cargoTons: number;
  waterSalinity: 'fresh' | 'ocean' | 'deadsea';
}
