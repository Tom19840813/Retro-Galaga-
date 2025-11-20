
import { Enemy, EnemyState } from './Enemy';
import { Boss } from './Boss';
import { Vector2 } from '../types';
import { CANVAS_WIDTH, ENEMY_SIZE, BOSS_WAVE_INTERVAL } from '../constants';
import { Projectile } from './Projectile';

export class Swarm {
  enemies: Enemy[] = [];
  boss: Boss | null = null;
  
  private wave: number = 0;
  private attackTimer: number = 0;
  private attackInterval: number = 2; // Seconds between attacks

  constructor() {
    this.startWave(1);
  }

  startWave(waveNum: number) {
    this.wave = waveNum;
    this.enemies = [];
    this.boss = null;
    
    // Check for Boss Wave
    if (waveNum % BOSS_WAVE_INTERVAL === 0) {
      this.boss = new Boss();
      return;
    }

    // Standard Wave Generation
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

  update(dt: number, time: number, playerPos: Vector2): Projectile[] {
    let newProjectiles: Projectile[] = [];

    if (this.boss) {
        // Boss Logic
        const bossShots = this.boss.update(dt, playerPos);
        newProjectiles = [...newProjectiles, ...bossShots];
        
        if (!this.boss.active) {
            this.boss = null; // Boss defeated
        }
    } else {
        // Standard Swarm Logic
        this.enemies.forEach(e => e.update(dt, playerPos, time));

        // Attack logic
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
            this.attackTimer = this.attackInterval + Math.random(); 
            
            const gridEnemies = this.enemies.filter(e => e.state === EnemyState.GRID);
            if (gridEnemies.length > 0) {
                const attacker = gridEnemies[Math.floor(Math.random() * gridEnemies.length)];
                attacker.startDive();
            }
        }
        
        // Cleanup dead
        this.enemies = this.enemies.filter(e => e.active);
    }

    return newProjectiles;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.boss) {
        this.boss.draw(ctx);
    } else {
        this.enemies.forEach(e => e.draw(ctx));
    }
  }

  isEmpty(): boolean {
    // Wave is empty if no enemies AND no boss
    return this.enemies.length === 0 && this.boss === null;
  }
}
