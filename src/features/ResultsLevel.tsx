import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Trophy, 
  Recycle, 
  Leaf, 
  Droplets, 
  Wind, 
  Trash2, 
  BarChart3, 
  Globe,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultsLevel: React.FC = () => {
  const { 
    plasticRatio, 
    biomassRatio, 
    heatingScore, 
    sortingScore, 
    coolingScore, 
    resetGame 
  } = useGameState();

  const finalScore = Math.round(((heatingScore + sortingScore + coolingScore) / 3) * 100);
  
  // Calculate yields based on input and process efficiency
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
          <Trophy className="w-12 h-12 text-primary glow-cyan" />
        </motion.div>
        <h2 className="text-4xl font-bold tracking-tighter">Process Complete</h2>
        <p className="text-muted-foreground font-mono uppercase text-xs tracking-[0.2em]">
          Final Efficiency Rating: <span className="text-primary">{finalScore}%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Summary */}
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

        {/* Output Recovery */}
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
          onClick={() => window.open('https://en.wikipedia.org/wiki/Microwave-assisted_pyrolysis', '_blank')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          LEARN HOW THIS WORKS
        </Button>
      </div>
    </div>
  );
};

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
