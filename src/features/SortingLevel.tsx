import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, Flame, Droplets, Wind, Info } from 'lucide-react';
import { toast } from 'sonner';

type OutputType = 'fuel' | 'gas' | 'char';

interface Block {
  id: number;
  type: OutputType;
  x: number;
}

export const SortingLevel: React.FC = () => {
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
        // Bias types based on plastic ratio
        // High plastic -> more fuel
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
        {/* Bins */}
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

        {/* Conveyor Belt */}
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
                    // Lowered hitbox to align better with visual bins
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

        {/* Stats */}
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
          “Pyrolysis is the thermal decomposition of materials in an oxygen-free environment. It breaks down complex polymers into valuable oils, gases, and solid carbon (biochar).”
        </p>
      </div>
    </div>
  );
};

const Bin: React.FC<{ type: OutputType; icon: React.ReactNode; label: string; color: string }> = ({ icon, label, color }) => (
  <div className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${color} h-32 gap-2`}>
    <div className="animate-bounce-slow">{icon}</div>
    <span className="text-[10px] font-mono font-bold uppercase text-center">{label}</span>
  </div>
);
