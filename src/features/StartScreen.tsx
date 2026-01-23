import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Play, Info, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const StartScreen: React.FC = () => {
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
        <Zap className="w-24 h-24 text-primary relative z-10 glow-cyan" />
      </motion.div>

      <div className="space-y-4 max-w-lg">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to <span className="text-primary">Pyrolysis Play</span>
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
