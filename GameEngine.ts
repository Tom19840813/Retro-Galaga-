import { CanvasHTMLAttributes } from 'react';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  COLORS 
} from '../constants';
import { GameState, EntityType } from '../types';
import { Player } from './Player';
import { Projectile } from './Projectile';
import { Swarm } from './Swarm';
import { InputManager } from './InputManager';
import { Starfield } from './Starfield';
import { checkCollision } from './Utils';
import { ParticleSystem } from './ParticleSystem';
import { soundManager } from './SoundManager';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number = 0;
  private lastTime: number = 0;
  
  // Game State
  public state: GameState = GameState.MENU;
  public score: number = 0;
  public lives: number = 3;
  public wave: number = 1;
  
  // Entities
  private player: Player;
  private projectiles: Projectile[] = [];
  private swarm: Swarm;
  private starfield: Starfield;
  private particles: ParticleSystem;
  private input: InputManager;

  // Callbacks for UI updates
  private onScoreUpdate: (score: number) => void;
  private onLivesUpdate: (lives: number) => void;
  private onGameOver: (score: number) => void;

  constructor(
    canvas: HTMLCanvasElement, 
    onScore: (s: number) => void, 
    onLives: (l: number) => void,
    onOver: (s: number) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    
    this.onScoreUpdate = onScore;
    this.onLivesUpdate = onLives;
    this.onGameOver = onOver;

    this.input = new InputManager();
    this.player = new Player(this.input);
    this.swarm = new Swarm();
    this.starfield = new Starfield();
    this.particles = new ParticleSystem();

    // Initial render
    this.draw();
  }

  public start() {
    if (this.state === GameState.PLAYING) return;
    
    soundManager.init(); // Ensure audio context is resumed
    this.resetGame();
    this.state = GameState.PLAYING;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private resetGame() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.onScoreUpdate(0);
    this.onLivesUpdate(3);
    
    this.projectiles = [];
    this.particles.clear();
    this.player.reset();
    this.swarm.startWave(1);
  }

  private loop = (time: number) => {
    if (this.state !== GameState.PLAYING) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1); // Cap dt to avoid large jumps
    this.lastTime = time;

    this.update(dt, time / 1000);
    this.draw();

    this.animationId = requestAnimationFrame(this.loop);
  };

  private update(dt: number, totalTime: number) {
    this.starfield.update(dt);
    this.particles.update(dt);

    // Update Player
    const newProj = this.player.update(dt);
    if (newProj) this.projectiles.push(newProj);

    // Update Swarm
    this.swarm.update(dt, totalTime, this.player.pos);

    // Check Wave Clear
    if (this.swarm.isEmpty()) {
      this.wave++;
      this.swarm.startWave(this.wave);
    }

    // Update Projectiles
    this.projectiles.forEach(p => p.update(dt));
    this.projectiles = this.projectiles.filter(p => p.active);

    // Collisions
    this.checkCollisions();
  }

  private checkCollisions() {
    const playerBounds = this.player.getBounds();

    // 1. Player Bullets hitting Enemies
    const playerBullets = this.projectiles.filter(p => p.type === EntityType.PROJECTILE_PLAYER);
    
    playerBullets.forEach(bullet => {
      const bBounds = bullet.getBounds();
      
      for (const enemy of this.swarm.enemies) {
        if (checkCollision(bBounds, enemy.getBounds())) {
          // Hit!
          bullet.active = false;
          enemy.active = false;
          
          // Effect
          this.particles.createExplosion(enemy.pos, COLORS.ENEMY_BASIC);
          soundManager.playExplosion();
          
          // Score
          const pts = enemy.state === 2 ? 200 : 100; // More points for diving enemies
          this.score += pts;
          this.onScoreUpdate(this.score);
          break; // Bullet destroys one enemy
        }
      }
    });

    // 2. Enemy body hitting Player
    if (this.player.active) {
      for (const enemy of this.swarm.enemies) {
        if (checkCollision(playerBounds, enemy.getBounds())) {
          this.handlePlayerHit();
          enemy.active = false;
          break;
        }
      }
    }
  }

  private handlePlayerHit() {
    this.lives--;
    this.onLivesUpdate(this.lives);
    this.player.active = false;
    this.particles.createExplosion(this.player.pos, COLORS.PLAYER, 50); // Big explosion
    soundManager.playExplosion();

    if (this.lives > 0) {
      // Respawn delay
      setTimeout(() => {
        this.player.reset();
      }, 2000);
    } else {
      this.state = GameState.GAME_OVER;
      this.onGameOver(this.score);
    }
  }

  private draw() {
    // Clear background
    this.ctx.fillStyle = '#050505';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.starfield.draw(this.ctx);
    this.player.draw(this.ctx);
    this.swarm.draw(this.ctx);
    this.projectiles.forEach(p => p.draw(this.ctx));
    this.particles.draw(this.ctx);
  }

  public destroy() {
    cancelAnimationFrame(this.animationId);
    this.input.destroy();
  }
}