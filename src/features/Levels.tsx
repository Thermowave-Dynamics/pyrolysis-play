import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Card } from '../components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Info, ShieldCheck, Zap, Recycle, Leaf, Flame, Thermometer, Package, Wind, Snowflake, 
  Droplets, Trash2, Trophy, BarChart3, Globe, RotateCcw, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

type OutputType = 'fuel' | 'gas' | 'char';

interface Block {
  id: number;
  type: OutputType;
  x: number;
}

// ===== START SCREEN =====
const StartScreen: React.FC = () => {
  const { setCurrentLevel } = useGameState();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
        <Zap className="w-24 h-24 text-primary relative z-10 glow-red" />
      </motion.div>

      <div className="space-y-4 max-w-lg">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to <span className="text-primary">Pyrolysis Simulator</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Experience the future of waste-to-energy. Learn how Microwave-Assisted Pyrolysis transforms waste into valuable resources through a series of interactive challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl text-left">
        <div className="p-4 rounded-xl glass border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Educational</span>
          </div>
          <p className="text-xs text-muted-foreground">Learn the science of thermal decomposition without oxygen.</p>
        </div>
        <div className="p-4 rounded-xl glass border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Innovative</span>
          </div>
          <p className="text-xs text-muted-foreground">Discover why microwave technology is a game-changer for heating.</p>
        </div>
        <div className="p-4 rounded-xl glass border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Sustainable</span>
          </div>
          <p className="text-xs text-muted-foreground">See how circular waste recovery helps protect our planet.</p>
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => setCurrentLevel('input')}
        className="neo-button bg-primary text-primary-foreground hover:bg-primary/90 min-w-[240px] h-14 text-lg font-bold group"
      >
        <Play className="w-5 h-5 mr-2 fill-current group-hover:translate-x-1 transition-transform" />
        START MISSION
      </Button>

      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-4">
        Average completion time: 3-5 minutes
      </p>
    </div>
  );
};

// ===== FEEDSTOCK LEVEL =====
const FeedstockLevel: React.FC = () => {
  const { plasticRatio, biomassRatio, setRatios, setCurrentLevel } = useGameState();
  const [particles, setParticles] = useState<{ id: number; type: 'plastic' | 'biomass'; left: number; top: number }[]>([]);

  useEffect(() => {
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

        <div className="relative aspect-square md:aspect-auto md:h-full flex items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-[4/5] bg-secondary/30 border-2 border-white/10 rounded-b-[40px] overflow-hidden">
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
            
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>
          
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

// ===== HEATING LEVEL =====
const HeatingLevel: React.FC = () => {
  const { setCurrentLevel, setHeatingScore } = useGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heatingProgress, setHeatingProgress] = useState(0);
  const [uniformity, setUniformity] = useState(1);
  const [grid, setGrid] = useState<number[]>(new Array(100).fill(0));
  const mousePos = useRef({ x: -1, y: -1 });
  const [isDone, setIsDone] = useState(false);

  // Lock scrolling on mobile until heating is complete
  useEffect(() => {
    if (!isDone) {
      document.body.style.overflow = 'hidden';
      // Prevent touchmove defaults as a secondary measure
      const preventDefault = (e: TouchEvent) => {
        if (e.target === canvasRef.current) {
          e.preventDefault();
        }
      };
      document.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('touchmove', preventDefault);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cellSize = canvas.width / 10;
      let totalHeat = 0;
      let variance = 0;

      grid.forEach((heat, i) => {
        const x = i % 10;
        const y = Math.floor(i / 10);
        
        const hue = 40 - (heat * 40);
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

      if (mousePos.current.x !== -1) {
        ctx.beginPath();
        ctx.arc(mousePos.current.x, mousePos.current.y, cellSize * 1.5, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          mousePos.current.x, mousePos.current.y, 0,
          mousePos.current.x, mousePos.current.y, cellSize * 1.5
        );
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
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
              newGrid[idx] = Math.min(newGrid[idx] + power, 1.1);
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
            className="rounded-xl border-4 border-white/5 cursor-crosshair glow-red transition-all touch-none"
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
          "MAP enables precise, volumetric heating without combustion, reaching target temperatures faster and more uniformly than traditional methods."
        </p>
      </div>
    </div>
  );
};

// ===== SORTING LEVEL =====
const Bin: React.FC<{ type: OutputType; icon: React.ReactNode; label: string; color: string }> = ({ icon, label, color }) => (
  <div className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${color} h-32 gap-2`}>
    <div className="animate-bounce-slow">{icon}</div>
    <span className="text-[10px] font-mono font-bold uppercase text-center">{label}</span>
  </div>
);

const SortingLevel: React.FC = () => {
  const { setCurrentLevel, setSortingScore, plasticRatio } = useGameState();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [sortedCount, setSortedCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [nextId, setNextId] = useState(0);
  const totalToSort = 15;

  useEffect(() => {
    if (sortedCount + mistakes < totalToSort && blocks.length < 3) {
      const timer = setTimeout(() => {
        const types: OutputType[] = ['fuel', 'gas', 'char'];
        let type: OutputType;
        const roll = Math.random() * 100;
        if (roll < plasticRatio * 0.7 + 10) {
          type = 'fuel';
        } else if (roll < 80) {
          type = 'gas';
        } else {
          type = 'char';
        }

        const newBlock: Block = {
          id: nextId,
          type,
          x: -100,
        };
        setBlocks(prev => [...prev, newBlock]);
        setNextId(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [blocks, sortedCount, mistakes, plasticRatio, nextId]);

  const handleSort = (blockId: number, target: OutputType) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    if (block.type === target) {
      setSortedCount(prev => prev + 1);
      toast.success(`Correct! Captured ${target}`, { duration: 800 });
    } else {
      setMistakes(prev => prev + 1);
      toast.error(`Incorrect sorting! That was ${block.type}`, { duration: 1200 });
    }
    setBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const isDone = sortedCount + mistakes >= totalToSort;

  useEffect(() => {
    if (isDone) {
      const score = Math.max(0, (sortedCount - mistakes * 0.5) / totalToSort);
      setSortingScore(score);
    }
  }, [isDone]);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-blue-400 w-6 h-6" />
          Level 3: Output Sorting
        </h2>
        <p className="text-muted-foreground text-sm">
          Drag the pyrolysis outputs into their correct containment bins. Efficiency depends on recovery accuracy.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between py-8">
        <div className="grid grid-cols-3 gap-4 w-full">
          <Bin 
            type="fuel" 
            icon={<Droplets className="w-6 h-6 text-yellow-500" />} 
            label="Liquid Fuel" 
            color="border-yellow-500/50 bg-yellow-500/10"
          />
          <Bin 
            type="gas" 
            icon={<Wind className="w-6 h-6 text-purple-500" />} 
            label="Syngas" 
            color="border-purple-500/50 bg-purple-500/10"
          />
          <Bin 
            type="char" 
            icon={<Trash2 className="w-6 h-6 text-gray-500" />} 
            label="Biochar" 
            color="border-gray-500/50 bg-gray-500/10"
          />
        </div>

        <div className="relative w-full h-48 bg-white/5 border-y border-white/10 flex items-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
          </div>

          <div className="flex gap-12 px-12 items-center">
            <AnimatePresence>
              {blocks.map((block) => (
                <motion.div
                  key={block.id}
                  layoutId={block.id.toString()}
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(_, info) => {
                    if (info.point.y < 450) {
                      const screenWidth = window.innerWidth;
                      const x = info.point.x;
                      if (x < screenWidth / 3) handleSort(block.id, 'fuel');
                      else if (x < (screenWidth * 2) / 3) handleSort(block.id, 'gas');
                      else handleSort(block.id, 'char');
                    }
                  }}
                  className={`w-20 h-20 rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center border-2 shadow-xl glass transition-colors ${
                    block.type === 'fuel' ? 'border-yellow-500/50 text-yellow-500' : 
                    block.type === 'gas' ? 'border-purple-500/50 text-purple-500' : 
                    'border-gray-500/50 text-gray-500'
                  }`}
                >
                  {block.type === 'fuel' && <Droplets className="w-8 h-8" />}
                  {block.type === 'gas' && <Wind className="w-8 h-8" />}
                  {block.type === 'char' && <Trash2 className="w-8 h-8" />}
                  <span className="text-[8px] font-mono mt-1 uppercase font-bold">{block.type}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-8 text-xs font-mono uppercase">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Recovered</span>
            <span className="text-xl font-bold text-primary">{sortedCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Remaining</span>
            <span className="text-xl font-bold">{totalToSort - sortedCount - mistakes}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Losses</span>
            <span className="text-xl font-bold text-destructive">{mistakes}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {isDone ? (
          <Button 
            size="lg" 
            onClick={() => setCurrentLevel('cooling')}
            className="neo-button bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
          >
            COOL SYNGAS
          </Button>
        ) : (
          <p className="text-[10px] font-mono uppercase text-muted-foreground animate-pulse">
            Drag items to the top bins...
          </p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs">
          "Pyrolysis is the thermal decomposition of materials in an oxygen-free environment. It breaks down complex polymers into valuable oils, gases, and solid carbon (biochar)."
        </p>
      </div>
    </div>
  );
};

// ===== COOLING LEVEL =====
const CoolingLevel: React.FC = () => {
  const { setCurrentLevel, setCoolingScore } = useGameState();
  const [coolingPower, setCoolingPower] = useState(0);
  const [temperature, setTemperature] = useState(100);
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTemperature(prev => {
        const target = 100 - coolingPower;
        return prev + (target - prev) * 0.05;
      });

      setLiquidLevel(prev => {
        if (temperature > 15 && temperature < 45) {
          const currentEfficiency = 1 - Math.abs(temperature - 30) / 15;
          setEfficiency(prevEff => prevEff * 0.9 + currentEfficiency * 0.1);
          return Math.min(prev + currentEfficiency * 0.5, 100);
        }
        return prev;
      });
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [coolingPower, temperature]);

  useEffect(() => {
    if (liquidLevel >= 100 && !isDone) {
      setIsDone(true);
      setCoolingScore(efficiency);
    }
  }, [liquidLevel, efficiency, isDone]);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Snowflake className="text-cyan-400 w-6 h-6" />
          Level 4: Syngas Cooling
        </h2>
        <p className="text-muted-foreground text-sm">
          Condense the hot syngas into liquid fuel by managing the cooling intensity. Balance is key to maximizing recovery.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full h-24 bg-white/5 border border-white/10 rounded-full flex items-center overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ x: [0, 400], opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "linear"
                  }}
                  className="absolute w-4 h-4 rounded-full blur-md"
                  style={{ 
                    backgroundColor: `hsl(${280 - (100 - temperature) * 1.5}, 100%, 70%)`,
                    left: -20
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {coolingPower > 10 && Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute h-full w-[2px] bg-cyan-400/30"
                  style={{ left: `${20 + i * 15}%` }}
                />
              ))}
            </div>

            {temperature < 50 && temperature > 10 && (
              <div className="absolute right-12 inset-y-0 flex flex-col justify-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, 20], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <Droplets className="w-3 h-3 text-yellow-500 fill-current" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="w-32 h-48 relative border-2 border-white/20 rounded-xl overflow-hidden glass">
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-yellow-500/80 shadow-[0_-10px_20px_rgba(234,179,8,0.3)]"
              animate={{ height: `${liquidLevel}%` }}
              transition={{ type: "spring", damping: 20 }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono font-bold uppercase mix-blend-difference">
                Fuel Recovery
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-2xl glass space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                  <Snowflake className="w-4 h-4" /> Cooling Power
                </label>
                <span className="font-mono text-lg">{coolingPower}%</span>
              </div>
              <Slider 
                value={[coolingPower]} 
                onValueChange={(val) => setCoolingPower(val[0])}
                max={100} 
                step={1}
                className="[&_.relative]:bg-cyan-900/30 [&_.bg-primary]:bg-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase">Gas Temp</span>
                <div className="flex items-center gap-2">
                  <Thermometer className={`w-4 h-4 ${temperature > 50 ? 'text-red-500' : 'text-cyan-400'}`} />
                  <span className="text-lg font-mono font-bold">{Math.round(temperature)}°</span>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase">Efficiency</span>
                <span className={`text-lg font-mono font-bold ${efficiency > 0.8 ? 'text-primary' : 'text-yellow-500'}`}>
                  {Math.round(efficiency * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-xs space-y-2">
              <p>
                Cooling too <strong className="text-red-400">slowly</strong> results in gas loss as it escapes the system.
              </p>
              <p>
                Cooling too <strong className="text-cyan-400">fast</strong> can trap impurities or lead to inefficient condensation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        {isDone ? (
          <Button 
            size="lg" 
            onClick={() => setCurrentLevel('results')}
            className="neo-button bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
          >
            VIEW FINAL RESULTS
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-mono uppercase text-muted-foreground animate-pulse">
              Adjust cooling to target the condensation sweet spot...
            </p>
            {temperature > 40 && <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">TOO HOT</span>}
            {temperature < 20 && <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">TOO COLD</span>}
            {temperature >= 20 && temperature <= 40 && <span className="text-[10px] text-primary font-bold uppercase tracking-widest animate-ping">OPTIMAL</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== RESULTS LEVEL =====
const MetricItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] font-mono uppercase text-muted-foreground">
      <span>{label}</span>
      <span>{Math.round(value * 100)}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-primary/60"
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  </div>
);

const OutputProgress: React.FC<{ label: string; value: number; color: string; icon?: React.ReactNode }> = ({ label, value, color, icon }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-mono uppercase">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-bold">{value}%</span>
    </div>
    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, type: "spring" }}
      />
    </div>
  </div>
);

const ResultsLevel: React.FC = () => {
  const { 
    plasticRatio, 
    biomassRatio, 
    heatingScore, 
    sortingScore, 
    coolingScore, 
    resetGame 
  } = useGameState();

  const finalScore = Math.round(((heatingScore + sortingScore + coolingScore) / 3) * 100);
  
  const baseFuelYield = plasticRatio * 0.7 + biomassRatio * 0.2;
  const baseGasYield = plasticRatio * 0.2 + biomassRatio * 0.4;
  const baseCharYield = plasticRatio * 0.1 + biomassRatio * 0.4;
  
  const efficiencyMultiplier = (finalScore / 100);
  
  const fuelYield = Math.round(baseFuelYield * efficiencyMultiplier);
  const gasYield = Math.round(baseGasYield * efficiencyMultiplier);
  const charYield = Math.round(baseCharYield * efficiencyMultiplier);
  const losses = 100 - (fuelYield + gasYield + charYield);

  return (
    <div className="flex-1 flex flex-col gap-8 animate-fade-in">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="inline-flex p-4 rounded-full bg-primary/20 mb-2"
        >
          <Trophy className="w-12 h-12 text-primary glow-red" />
        </motion.div>
        <h2 className="text-4xl font-bold tracking-tighter">Process Complete</h2>
        <p className="text-muted-foreground font-mono uppercase text-xs tracking-[0.2em]">
          Final Efficiency Rating: <span className="text-primary">{finalScore}%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-bold uppercase text-xs tracking-widest">Input Composition</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Recycle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Plastic</span>
              </div>
              <div className="text-2xl font-mono font-bold">{plasticRatio}%</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Biomass</span>
              </div>
              <div className="text-2xl font-mono font-bold">{biomassRatio}%</div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <MetricItem label="Heating Efficiency" value={heatingScore} />
            <MetricItem label="Sorting Recovery" value={sortingScore} />
            <MetricItem label="Condensation Quality" value={coolingScore} />
          </div>
        </Card>

        <Card className="glass p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Droplets className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-bold uppercase text-xs tracking-widest">Resource Recovery</h3>
          </div>

          <div className="space-y-6">
            <OutputProgress label="Liquid Fuel" value={fuelYield} color="bg-yellow-500" icon={<Droplets className="w-4 h-4" />} />
            <OutputProgress label="Syngas" value={gasYield} color="bg-purple-500" icon={<Wind className="w-4 h-4" />} />
            <OutputProgress label="Biochar" value={charYield} color="bg-gray-500" icon={<Trash2 className="w-4 h-4" />} />
            <OutputProgress label="Process Losses" value={losses} color="bg-red-900/40" />
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <Globe className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-[10px] font-mono uppercase text-green-400 font-bold">Environmental Impact</p>
                <p className="text-xs font-medium">Significant carbon reduction through circular waste recovery.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={resetGame}
          className="neo-button border-white/10 hover:bg-white/5"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          TRY DIFFERENT INPUTS
        </Button>
        <Button 
          size="lg" 
          className="neo-button bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => window.open('https://pmc.ncbi.nlm.nih.gov/articles/PMC7117841/', '_blank')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          LEARN HOW THIS WORKS
        </Button>
      </div>
    </div>
  );
};

// ===== EXPORT ALL LEVELS =====
export { StartScreen, FeedstockLevel, HeatingLevel, SortingLevel, CoolingLevel, ResultsLevel };
