import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TheorySection } from './components/TheorySection';
import { SimTank } from './components/SimTank';
import { CrownExperiment } from './components/CrownExperiment';
import { ShipSimulator } from './components/ShipSimulator';
import { ConclusionsSection } from './components/ConclusionsSection';
import { PhysicsAssistant } from './components/PhysicsAssistant';
import { Footer } from './components/Footer';
import { GithubExportModal } from './components/GithubExportModal';
import { SimState, CrownState, ShipState } from './types/physics';

export default function App() {
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  // Initial state matching the exact values in the reference:
  // Liquid: water 1000 kg/m3, Mass: 1.2 kg, Volume: 1.5 L, Submerged: 75%
  const [simState, setSimState] = useState<SimState>({
    fluidId: 'water',
    customFluidDensity: 1000,
    materialId: 'custom',
    mass: 1.2,
    volume: 1.5,
    submergedPercent: 75,
    isAutoEquilibrium: false,
  });

  const [crownState, setCrownState] = useState<CrownState>({
    goldRatio: 0.7, // 70% gold, 30% silver
    totalMass: 1000,
    isSubmerged: false,
    activeApparatus: 'overflow',
  });

  const [shipState, setShipState] = useState<ShipState>({
    isHollow: true,
    steelMassTons: 100,
    hullVolumeM3: 500,
    cargoTons: 250,
    waterSalinity: 'ocean',
  });

  const handleResetSim = () => {
    setSimState({
      fluidId: 'water',
      customFluidDensity: 1000,
      materialId: 'custom',
      mass: 1.2,
      volume: 1.5,
      submergedPercent: 75,
      isAutoEquilibrium: false,
    });
  };

  return (
    <div id="top" className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header onOpenGithub={() => setIsGithubModalOpen(true)} />

      <main>
        <Hero />
        <TheorySection />
        <SimTank
          state={simState}
          onChange={setSimState}
          onReset={handleResetSim}
        />
        <CrownExperiment
          state={crownState}
          onChange={setCrownState}
        />
        <ShipSimulator
          state={shipState}
          onChange={setShipState}
        />
        <ConclusionsSection />
        <PhysicsAssistant
          sim={simState}
          crown={crownState}
          ship={shipState}
        />
      </main>

      <Footer onOpenGithub={() => setIsGithubModalOpen(true)} />

      <GithubExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
}
