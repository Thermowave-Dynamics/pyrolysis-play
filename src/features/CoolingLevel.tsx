import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Wind, Snowflake, Droplets, Thermometer, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const CoolingLevel: React.FC = () => {
  const { setCurrentLevel, setCoolingScore } = useGameState();
  const [coolingPower, setCoolingPower] = useState(0); // 0-100
  const [temperature, setTemperature] = useState(100);
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      // Temperature decreases based on cooling power
      // Ideal cooling power is 70
      setTemperature(prev => {
        const target = 100 - coolingPower;
        return prev + (target - prev) * 0.05;
      });

      // Liquid level increases when temperature is in the sweet spot (20-40)
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
        {/* Condensation Simulation */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full h-24 bg-white/5 border border-white/10 rounded-full flex items-center overflow-hidden">
            {/* Gas flow */}
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

            {/* Cooling Rays */}
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

            {/* Droplets appearing in sweet spot */}
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

          {/* Recovery Tank */}
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

        {/* Controls */}
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
