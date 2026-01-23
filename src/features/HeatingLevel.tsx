import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Flame, Thermometer, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const HeatingLevel: React.FC = () => {
  const { setCurrentLevel, setHeatingScore } = useGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatingProgress, setHeatingProgress] = useState(0);
  const [uniformity, setUniformity] = useState(1);
  const [grid, setGrid] = useState<number[]>(new Array(100).fill(0)); // 10x10 grid
  const mousePos = useRef({ x: -1, y: -1 });
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw reactor grid
      const cellSize = canvas.width / 10;
      let totalHeat = 0;
      let variance = 0;

      grid.forEach((heat, i) => {
        const x = i % 10;
        const y = Math.floor(i / 10);
        
        // Target color gradient: Orange (0.5) to Red (1.0)
        const hue = 40 - (heat * 40); // 40 (orange) to 0 (red)
        const lightness = 20 + (heat * 30);
        
        ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
        
        totalHeat += heat;
      });

      const avgHeat = totalHeat / grid.length;
      grid.forEach((heat) => {
        variance += Math.pow(heat - avgHeat, 2);
      });
      
      const newUniformity = 1 - Math.min(variance / 2, 0.9);
      setUniformity(newUniformity);
      setHeatingProgress(avgHeat * 100);

      // Draw Beam
      if (mousePos.current.x !== -1) {
        ctx.beginPath();
        ctx.arc(mousePos.current.x, mousePos.current.y, cellSize * 1.5, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          mousePos.current.x, mousePos.current.y, 0,
          mousePos.current.x, mousePos.current.y, cellSize * 1.5
        );
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Apply heat
        const gridX = Math.floor(mousePos.current.x / cellSize);
        const gridY = Math.floor(mousePos.current.y / cellSize);
        
        const newGrid = [...grid];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const gx = gridX + dx;
            const gy = gridY + dy;
            if (gx >= 0 && gx < 10 && gy >= 0 && gy < 10) {
              const idx = gy * 10 + gx;
              const dist = Math.sqrt(dx*dx + dy*dy);
              const power = Math.max(0, 0.02 * (1.5 - dist));
              newGrid[idx] = Math.min(newGrid[idx] + power, 1.1); // Allow slight overheating
            }
          }
        }
        setGrid(newGrid);
      }

      if (avgHeat < 1) {
        animationFrame = requestAnimationFrame(render);
      } else {
        setIsDone(true);
        setHeatingScore(newUniformity);
      }
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [grid]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    mousePos.current = { x, y };
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: -1, y: -1 };
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Flame className="text-orange-500 w-6 h-6" />
          Level 2: Microwave Heating
        </h2>
        <p className="text-muted-foreground text-sm">
          Use the microwave beam to heat the reactor chamber evenly. Volumetric heating is the key to efficiency!
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
        <div className="relative group">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="rounded-xl border-4 border-white/5 cursor-crosshair glow-cyan transition-all"
            style={{ imageRendering: 'pixelated' }}
          />
          
          <div className="absolute -top-4 -right-4 bg-background border border-white/10 rounded-lg p-2 flex items-center gap-2 animate-pulse">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-mono font-bold uppercase">Reactor Core</span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground">
              <span>Overall Heat</span>
              <span>{Math.round(heatingProgress)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${Math.min(heatingProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono uppercase text-muted-foreground">
              <span>Uniformity Score</span>
              <span>{Math.round(uniformity * 100)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full transition-all duration-300 ${uniformity > 0.8 ? 'bg-primary' : uniformity > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${uniformity * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {isDone ? (
          <Button 
            size="lg" 
            onClick={() => setCurrentLevel('sorting')}
            className="neo-button bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
          >
            PROCEED TO SORTING
          </Button>
        ) : (
          <p className="text-[10px] font-mono uppercase text-muted-foreground animate-pulse">
            Apply beam to begin heating...
          </p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3">
        <Zap className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs">
          “MAP enables precise, volumetric heating without combustion, reaching target temperatures faster and more uniformly than traditional methods.”
        </p>
      </div>
    </div>
  );
};
