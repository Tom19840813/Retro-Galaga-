import { Entity, Rect, Vector2 } from '../types';
import { COLORS, ENEMY_SIZE, ENEMY_SPEED, ENEMY_DIVE_SPEED, CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';
import { getBezierPoint, distance, lerp } from './Utils';
import { soundManager } from './SoundManager';

export enum EnemyState {
  ENTERING,
  GRID,
  DIVING,
  RETURNING
}

export class Enemy implements Entity {
  pos: Vector2;
  size: Vector2 = { x: ENEMY_SIZE, y: ENEMY_SIZE };
  active: boolean = true;
  gridPos: Vector2; // Target position in the formation
  
  state: EnemyState = EnemyState.ENTERING;
  
  // Pathing variables
  private pathT: number = 0;
  private pathP0: Vector2 = { x: 0, y: 0 };
  private pathP1: Vector2 = { x: 0, y: 0 };
  private pathP2: Vector2 = { x: 0, y: 0 };
  
  // Animation
  private timeOffset: number;

  constructor(gridX: number, gridY: number) {
    this.gridPos = { x: gridX, y: gridY };
    this.pos = { x: -50, y: -50 }; // Start offscreen
    this.timeOffset = Math.random() * Math.PI * 2;
    
    // Initialize Entry Path
    // Random side entry
    const startX = Math.random() > 0.5 ? -50 : CANVAS_WIDTH + 50;
    this.pathP0 = { x: startX, y: 100 };
    this.pathP1 = { x: CANVAS_WIDTH / 2, y: 400 }; // Swoop down
    this.pathP2 = { ...this.gridPos };
  }

  update(dt: number, playerPos: Vector2 = { x: 0, y: 0 }, time: number = 0) {
    if (!this.active) return;

    switch (this.state) {
      case EnemyState.ENTERING:
        this.pathT += dt * 0.8; // Entry speed
        if (this.pathT >= 1) {
          this.pathT = 1;
          this.state = EnemyState.GRID;
        }
        this.pos = getBezierPoint(this.pathP0, this.pathP1, this.gridPos, this.pathT);
        break;

      case EnemyState.GRID:
        // Hover motion
        const hoverX = Math.sin(time * 2 + this.timeOffset) * 10;
        const hoverY = Math.cos(time * 1.5 + this.timeOffset) * 5;
        
        // Lerp towards grid pos + hover
        this.pos.x = lerp(this.pos.x, this.gridPos.x + hoverX, dt * 5);
        this.pos.y = lerp(this.pos.y, this.gridPos.y + hoverY, dt * 5);
        break;

      case EnemyState.DIVING:
        // Simple homing towards predicted player pos or straight line
        const dirX = playerPos.x - this.pos.x;
        const dirY = playerPos.y - this.pos.y;
        const len = Math.sqrt(dirX * dirX + dirY * dirY);
        
        if (len > 0) {
          this.pos.x += (dirX / len) * ENEMY_DIVE_SPEED * dt;
          this.pos.y += (dirY / len) * ENEMY_DIVE_SPEED * dt;
        }

        // If missed and went off screen, deactivate (or return in v2)
        if (this.pos.y > CANVAS_HEIGHT + 50) {
            // Teleport back to top and return to grid
            this.pos.y = -50;
            this.state = EnemyState.ENTERING;
            this.pathT = 0;
            this.pathP0 = { x: this.pos.x, y: -50 };
            this.pathP1 = { x: CANVAS_WIDTH/2, y: 0 };
            this.pathP2 = { ...this.gridPos };
        }
        break;
    }
  }

  startDive() {
    if (this.state === EnemyState.GRID) {
      this.state = EnemyState.DIVING;
      soundManager.playEnemyDive();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;

    ctx.fillStyle = this.state === EnemyState.DIVING ? COLORS.ENEMY_DIVER : COLORS.ENEMY_BASIC;
    
    // Draw bug-like shape
    const x = this.pos.x;
    const y = this.pos.y;
    const w = this.size.x;
    const h = this.size.y;

    ctx.beginPath();
    ctx.arc(x + w/2, y + h/2, w/2, 0, Math.PI * 2); // Body
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + w/2 - 6, y + h/2 - 2, 4, 4);
    ctx.fillRect(x + w/2 + 2, y + h/2 - 2, 4, 4);

    // Wings (animated)
    if (Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.strokeStyle = this.state === EnemyState.DIVING ? COLORS.ENEMY_DIVER : COLORS.ENEMY_BASIC;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + h/2);
        ctx.lineTo(x - 6, y);
        ctx.moveTo(x + w, y + h/2);
        ctx.lineTo(x + w + 6, y);
        ctx.stroke();
    }
  }

  getBounds(): Rect {
    return {
      x: this.pos.x,
      y: this.pos.y,
      width: this.size.x,
      height: this.size.y
    };
  }
}