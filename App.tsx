import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameState } from './types';
import { KEYS } from './constants';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameEngine | null>(null);
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize game engine
    const game = new GameEngine(
      canvasRef.current,
      setScore,
      setLives,
      (finalScore) => setGameState(GameState.GAME_OVER)
    );
    
    gameRef.current = game;

    return () => {
      game.destroy();
    };
  }, []);

  const handleStart = () => {
    if (gameRef.current) {
      gameRef.current.start();
      setGameState(GameState.PLAYING);
      setLives(3);
      setScore(0);
    }
  };

  // Virtual Key Handlers
  const handleVirtualKey = (key: string, isDown: boolean) => {
    if (gameRef.current) {
      gameRef.current.input.setVirtualKey(key, isDown);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center scanlines overflow-hidden touch-none select-none">
      
      {/* Game Container - Responsive with aspect ratio */}
      <div className="relative w-full h-full max-w-[600px] max-h-[800px] aspect-[3/4] bg-black border-4 border-neutral-700 shadow-2xl rounded-lg overflow-hidden">
        
        {/* UI Overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between pointer-events-none z-20 text-white text-shadow-sm">
          <div className="flex flex-col">
            <span className="text-red-500 text-[10px] sm:text-xs mb-1">1UP</span>
            <span className="text-lg sm:text-xl tracking-widest">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-blue-500 text-[10px] sm:text-xs mb-1">LIVES</span>
            <div className="flex gap-2">
               {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                 <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400 rounded-sm clip-triangle"></div>
               ))}
            </div>
          </div>
        </div>

        {/* Canvas - Scales with CSS to fit container */}
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full z-10 object-contain"
        />

        {/* Menu Overlay */}
        {gameState === GameState.MENU && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 text-white px-4">
            <h1 className="text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-red-600 mb-8 animate-pulse font-bold text-center leading-tight">
              GALACTIC<br/>DEFENDER
            </h1>
            <button 
              onClick={handleStart}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded border-b-4 border-blue-800 active:border-0 active:translate-y-1 transition-all uppercase tracking-widest text-sm sm:text-base"
            >
              Insert Coin (Start)
            </button>
            <p className="mt-8 text-neutral-500 text-[10px] sm:text-xs text-center max-w-xs">
              Arrows to Move • Space to Fire<br/>
              <span className="block mt-2 text-neutral-600">Mobile: On-screen controls</span>
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 text-white">
            <h2 className="text-red-500 text-2xl sm:text-3xl mb-4">GAME OVER</h2>
            <p className="text-yellow-400 text-lg sm:text-xl mb-8">FINAL SCORE: {score}</p>
            <button 
              onClick={handleStart}
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Mobile Controls Overlay - Always rendered but only useful on touch */}
        {gameState === GameState.PLAYING && (
          <div className="absolute bottom-4 left-0 w-full px-4 flex justify-between z-40 opacity-60 sm:opacity-0 sm:pointer-events-none transition-opacity duration-500 hover:opacity-100">
             {/* D-Pad */}
             <div className="flex gap-4">
                <button 
                  className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center active:bg-white/40"
                  onTouchStart={(e) => { e.preventDefault(); handleVirtualKey(KEYS.LEFT, true); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleVirtualKey(KEYS.LEFT, false); }}
                  onMouseDown={() => handleVirtualKey(KEYS.LEFT, true)}
                  onMouseUp={() => handleVirtualKey(KEYS.LEFT, false)}
                  onMouseLeave={() => handleVirtualKey(KEYS.LEFT, false)}
                >
                  ◀
                </button>
                <button 
                  className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center active:bg-white/40"
                  onTouchStart={(e) => { e.preventDefault(); handleVirtualKey(KEYS.RIGHT, true); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleVirtualKey(KEYS.RIGHT, false); }}
                  onMouseDown={() => handleVirtualKey(KEYS.RIGHT, true)}
                  onMouseUp={() => handleVirtualKey(KEYS.RIGHT, false)}
                  onMouseLeave={() => handleVirtualKey(KEYS.RIGHT, false)}
                >
                  ▶
                </button>
             </div>

             {/* Fire Button */}
             <button 
                className="w-20 h-20 bg-red-500/30 rounded-full border-2 border-red-400/50 flex items-center justify-center active:bg-red-500/50"
                onTouchStart={(e) => { e.preventDefault(); handleVirtualKey(KEYS.FIRE, true); }}
                onTouchEnd={(e) => { e.preventDefault(); handleVirtualKey(KEYS.FIRE, false); }}
                onMouseDown={() => handleVirtualKey(KEYS.FIRE, true)}
                onMouseUp={() => handleVirtualKey(KEYS.FIRE, false)}
                onMouseLeave={() => handleVirtualKey(KEYS.FIRE, false)}
              >
                <div className="w-12 h-12 bg-red-400/50 rounded-full"></div>
             </button>
          </div>
        )}
        
        <style>{`
          .clip-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          .text-shadow-sm {
            text-shadow: 2px 2px 0px #000;
          }
        `}</style>
      </div>
    </div>
  );
};

export default App;