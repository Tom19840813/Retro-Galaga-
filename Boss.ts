
import { Entity, EntityType, Rect, Vector2 } from '../types';
import { BOSS_HP, BOSS_SIZE, BOSS_SPEED, CANVAS_WIDTH, COLORS, PROJECTILE_SPEED } from '../constants';
import { Projectile } from './Projectile';
import { soundManager } from './SoundManager';
import { lerp } from './Utils';

export class Boss implements Entity {
  pos: Vector2;
  size: Vector2 = { x: BOSS_SIZE, y: BOSS_SIZE };
  vel: Vector2 = { x: BOSS_SPEED, y: 0 };
  active: boolean = true;
  
  hp: number;
  maxHp: number;
  
  private attackTimer: number = 0;
  private moveTimer: number = 0;
  private hitFlashTimer: number = 0;

  constructor() {
    this.pos = { 
      x: CANVAS_WIDTH / 2 - BOSS_SIZE / 2, 
      y: -100 // Start above screen
    };
    this.maxHp = BOSS_HP;
    this.hp = this.maxHp;
  }

  update(dt: number, playerPos: Vector2 = { x: 0, y: 0 }): Projectile[] {
    const projectiles: Projectile[] = [];
    if (!this.active) return projectiles;

    this.moveTimer += dt;
    this.hitFlashTimer -= dt;

    // Entrance Logic
    if (this.pos.y < 100) {
      this.pos.y = lerp(this.pos.y, 100, dt * 2);
    } else {
      // Figure-8 Movement Pattern
      this.pos.x = (CANVAS_WIDTH / 2 - BOSS_SIZE / 2) + Math.sin(this.moveTimer * 0.8) * (CANVAS_WIDTH / 3);
      this.pos.y = 100 + Math.sin(this.moveTimer * 1.5) * 30;
    }

    // Attack Logic
    this.attackTimer -= dt;
    if (this.attackTimer <= 0 && this.pos.y >= 50) {
      this.attackTimer = 1.5; // Cooldown
      
      const attackType = Math.random();
      
      if (attackType > 0.5) {
        // Spread Shot
        [-0.3, 0, 0.3].forEach(angle => {
          const p = new Projectile(
            this.pos.x + this.size.x / 2, 
            this.pos.y + this.size.y, 
            EntityType.PROJECTILE_ENEMY
          );
          p.vel.x = Math.sin(angle) * 200;
          projectiles.push(p);
        });
      } else {
        // Aimed Burst
        const p = new Projectile(
          this.pos.x + this.size.x / 2, 
          this.pos.y + this.size.y, 
          EntityType.PROJECTILE_ENEMY
        );
        // Calculate direction to player
        const dx = (playerPos.x + 16) - (this.pos.x + this.size.x/2);
        const dy = playerPos.y - this.pos.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len > 0) {
          p.vel.x = (dx/len) * 300;
          p.vel.y = (dy/len) * 300;
        } else {
          p.vel.y = 300; // Default downward if somehow directly on top (unlikely)
        }
        projectiles.push(p);
      }
      
      soundManager.playShoot();
    }

    return projectiles;
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    this.hitFlashTimer = 0.1; // Flash white for 0.1s
    if (this.hp <= 0) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;

    // Draw Boss
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#FFFFFF' : COLORS.ENEMY_BOSS;
    
    // Main Body
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    
    // "Wings" or Side Cannons
    ctx.fillStyle = this.hitFlashTimer > 0 ? '#FFFFFF' : '#880000';
    ctx.fillRect(this.pos.x - 10, this.pos.y + 10, 10, 40);
    ctx.fillRect(this.pos.x + this.size.x, this.pos.y + 10, 10, 40);

    // Core (Eye)
    ctx.fillStyle = '#FFFF00';
    const eyeSize = 20;
    ctx.fillRect(
      this.pos.x + this.size.x / 2 - eyeSize / 2, 
      this.pos.y + this.size.y / 2 - eyeSize / 2, 
      eyeSize, 
      eyeSize
    );

    // Health Bar
    const hpPercent = this.hp / this.maxHp;
    const barWidth = this.size.x + 20;
    ctx.fillStyle = '#330000';
    ctx.fillRect(this.pos.x - 10, this.pos.y - 15, barWidth, 6);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(this.pos.x - 10, this.pos.y - 15, barWidth * hpPercent, 6);
  }

  getBounds(): Rect {
    return {
      x: this.pos.x - 10, // Include wings in hitbox
      y: this.pos.y,
      width: this.size.x + 20,
      height: this.size.y
    };
  }
}
