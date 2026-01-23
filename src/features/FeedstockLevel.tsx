import React, { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import { Info, Leaf, Recycle, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

export const FeedstockLevel: React.FC = () => {
  const { plasticRatio, biomassRatio, setRatios, setCurrentLevel } = useGameState();
  const [particles, setParticles] = useState<{ id: number; type: 'plastic' | 'biomass'; left: number; top: number }[]>([]);

  useEffect(() => {
    // Generate some initial particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      type: Math.random() * 100 < plasticRatio ? 'plastic' : 'biomass' as 'plastic' | 'biomass',
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, [plasticRatio]);

  return (
    <div className="flex-1 flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="text-primary w-6 h-6" />
          Level 1: Feedstock Input
        </h2>
        <p className="text-muted-foreground text-sm">
          Select your waste composition. Different inputs affect the final output yields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-1">
        {/* Controls */}
        <div className="flex flex-col gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-blue-400">
                  <Recycle className="w-4 h-4" /> Plastic Waste
                </label>
                <span className="font-mono text-lg">{plasticRatio}%</span>
              </div>
              <Slider 
                value={[plasticRatio]} 
                onValueChange={(val) => setRatios(val[0])}
                max={100} 
                step={1}
                className="[&_.relative]:bg-blue-900/30 [&_.bg-primary]:bg-blue-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-green-400">
                  <Leaf className="w-4 h-4" /> Biological Waste
                </label>
                <span className="font-mono text-lg">{biomassRatio}%</span>
              </div>
              <Slider 
                value={[biomassRatio]} 
                onValueChange={(val) => setRatios(100 - val[0])}
                max={100} 
                step={1}
                className="[&_.relative]:bg-green-900/30 [&_.bg-primary]:bg-green-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <div className="text-xs space-y-2">
              <p>
                <strong className="text-blue-400">Plastic</strong> results in higher liquid fuel recovery but less char.
              </p>
              <p>
                <strong className="text-green-400">Biomass</strong> produces more biochar and syngas, with lower liquid fuel.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Hopper */}
        <div className="relative aspect-square md:aspect-auto md:h-full flex items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-[4/5] bg-secondary/30 border-2 border-white/10 rounded-b-[40px] overflow-hidden">
            {/* Liquid/Particles simulation */}
            <div className="absolute inset-0 flex flex-wrap content-start p-4 gap-2 opacity-80">
              {particles.map((p) => (
                <div 
                  key={p.id}
                  className={`w-3 h-3 rounded-full blur-[1px] transition-colors duration-500 ${
                    p.type === 'plastic' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                  }`}
                  style={{
                    transform: `translate(${Math.sin(p.id) * 10}px, ${Math.cos(p.id) * 10}px)`
                  }}
                />
              ))}
            </div>
            
            {/* Overlay Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>
          
          {/* Hopper Base */}
          <div className="absolute -bottom-4 w-12 h-8 bg-muted border border-white/10 clip-path-hopper" />
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          onClick={() => setCurrentLevel('heating')}
          className="neo-button bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
        >
          START PROCESS
        </Button>
      </div>
    </div>
  );
};
