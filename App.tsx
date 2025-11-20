import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { GameState } from './types';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 scanlines">
      
      {/* Game Container (Arcade Cabinet Feel) */}
      <div className="relative bg-black border-4 border-neutral-700 shadow-2xl rounded-lg overflow-hidden">
        
        {/* UI Overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between pointer-events-none z-20 text-white text-shadow-sm">
          <div className="flex flex-col">
            <span className="text-red-500 text-xs mb-1">1UP</span>
            <span className="text-xl tracking-widest">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-blue-500 text-xs mb-1">LIVES</span>
            <div className="flex gap-2">
               {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                 <div key={i} className="w-4 h-4 bg-cyan-400 rounded-sm clip-triangle"></div>
               ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} className="block z-10" />

        {/* Menu Overlay */}
        {gameState === GameState.MENU && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 text-white">
            <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-red-600 mb-8 animate-pulse font-bold text-center">
              GALACTIC<br/>DEFENDER
            </h1>
            <button 
              onClick={handleStart}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded border-b-4 border-blue-800 active:border-0 active:translate-y-1 transition-all uppercase tracking-widest"
            >
              Insert Coin (Start)
            </button>
            <p className="mt-8 text-neutral-500 text-xs text-center">
              Arrows to Move • Space to Fire
            </p>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 text-white">
            <h2 className="text-red-500 text-3xl mb-4">GAME OVER</h2>
            <p className="text-yellow-400 text-xl mb-8">FINAL SCORE: {score}</p>
            <button 
              onClick={handleStart}
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
            >
              Try Again
            </button>
          </div>
        )}
        
        <style jsx>{`
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