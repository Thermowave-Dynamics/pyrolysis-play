import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { StartScreen, FeedstockLevel, HeatingLevel, SortingLevel, CoolingLevel, ResultsLevel } from './Levels';
import { Progress } from '../components/ui/progress';
import { TooltipProvider } from '../components/ui/tooltip';

export const GameContainer: React.FC = () => {
  const { currentLevel } = useGameState();

  const getProgress = () => {
    switch (currentLevel) {
      case 'start': return 0;
      case 'input': return 20;
      case 'heating': return 40;
      case 'sorting': return 60;
      case 'cooling': return 80;
      case 'results': return 100;
      default: return 0;
    }
  };

  const renderLevel = () => {
    switch (currentLevel) {
      case 'start': return <StartScreen />;
      case 'input': return <FeedstockLevel />;
      case 'heating': return <HeatingLevel />;
      case 'sorting': return <SortingLevel />;
      case 'cooling': return <CoolingLevel />;
      case 'results': return <ResultsLevel />;
      default: return <StartScreen />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background overflow-hidden relative">
        {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-4xl flex flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-primary glow-red">
              PYROLYSIS SIMULATOR
            </h1>
            <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">
              Microwave-Assisted Pyrolysis System v1.0
            </p>
          </div>
          
          <div className="w-full md:w-64 flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono uppercase text-muted-foreground">
              <span>Process Stage</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-1 bg-white/5" />
          </div>
        </div>

        {/* Game Area */}
        <main className="glass rounded-3xl p-6 md:p-10 min-h-[500px] flex flex-col animate-fade-in">
          {renderLevel()}
        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase">
          <p>© 2026 Thermowave Dynamics</p>
          <p>“This experience is a simplified representation of MAP technology for educational purposes.”</p>
        </footer>
      </div>
    </div>
    </TooltipProvider>
  );
};