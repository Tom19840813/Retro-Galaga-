import { Enemy, EnemyState } from './Enemy';
import { Vector2 } from '../types';
import { CANVAS_WIDTH, ENEMY_SIZE } from '../constants';

export class Swarm {
  enemies: Enemy[] = [];
  private wave: number = 0;
  private attackTimer: number = 0;
  private attackInterval: number = 2; // Seconds between attacks

  constructor() {
    this.startWave(1);
  }

  startWave(waveNum: number) {
    this.wave = waveNum;
    this.enemies = [];
    
    const rows = 3 + Math.min(waveNum, 3); // Cap at 6 rows
    const cols = 8;
    const startX = (CANVAS_WIDTH - (cols * (ENEMY_SIZE + 15))) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const gx = startX + c * (ENEMY_SIZE + 15);
        const gy = 80 + r * (ENEMY_SIZE + 15);
        // Stagger creation slightly so they don't all appear at once
        setTimeout(() => {
             this.enemies.push(new Enemy(gx, gy));
        }, (r * cols + c) * 100);
      }
    }
    
    // Increase difficulty
    this.attackInterval = Math.max(0.5, 2.0 - (waveNum * 0.1));
  }

  update(dt: number, time: number, playerPos: Vector2) {
    // Update all enemies
    this.enemies.forEach(e => e.update(dt, playerPos, time));

    // Attack logic
    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
      this.attackTimer = this.attackInterval + Math.random(); // Randomize slightly
      
      // Pick a random eligible enemy to dive
      const gridEnemies = this.enemies.filter(e => e.state === EnemyState.GRID);
      if (gridEnemies.length > 0) {
        const attacker = gridEnemies[Math.floor(Math.random() * gridEnemies.length)];
        attacker.startDive();
      }
    }
    
    // Cleanup dead
    this.enemies = this.enemies.filter(e => e.active);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.enemies.forEach(e => e.draw(ctx));
  }

  isEmpty(): boolean {
    return this.enemies.length === 0;
  }
}