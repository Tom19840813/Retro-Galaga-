import { Entity, Rect, Vector2, EntityType } from '../types';
import { InputManager } from './InputManager';
import { Projectile } from './Projectile';
import { soundManager } from './SoundManager';
import { 
  CANVAS_WIDTH, 
  KEYS, 
  PLAYER_SPEED, 
  PLAYER_SIZE, 
  COLORS,
  PLAYER_COOLDOWN
} from '../constants';

export class Player implements Entity {
  pos: Vector2;
  size: Vector2 = { x: PLAYER_SIZE, y: PLAYER_SIZE };
  vel: Vector2 = { x: 0, y: 0 };
  active: boolean = true;
  
  private cooldownTimer: number = 0;
  private input: InputManager;

  constructor(input: InputManager) {
    this.input = input;
    this.pos = {
      x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2,
      y: 700
    };
  }

  update(dt: number): Projectile | null {
    if (!this.active) return null;

    // Movement Logic with inertia for retro feel
    let dir = 0;
    if (this.input.isDown(KEYS.LEFT)) dir = -1;
    if (this.input.isDown(KEYS.RIGHT)) dir = 1;

    // Smooth acceleration (Lerp velocity)
    const targetSpeed = dir * PLAYER_SPEED;
    this.vel.x = this.vel.x + (targetSpeed - this.vel.x) * 10 * dt;
    
    this.pos.x += this.vel.x * dt;

    // Bounds clamping
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x = 0;
    }
    if (this.pos.x > CANVAS_WIDTH - this.size.x) {
      this.pos.x = CANVAS_WIDTH - this.size.x;
      this.vel.x = 0;
    }

    // Shooting
    this.cooldownTimer -= dt;
    if (this.input.isDown(KEYS.FIRE) && this.cooldownTimer <= 0) {
      this.cooldownTimer = PLAYER_COOLDOWN;
      soundManager.playShoot();
      // Spawn projectile from center top of ship
      return new Projectile(
        this.pos.x + this.size.x / 2 - 2, 
        this.pos.y, 
        EntityType.PROJECTILE_PLAYER
      );
    }

    return null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;

    ctx.fillStyle = COLORS.PLAYER;
    // Draw a retro ship shape (triangle-ish)
    ctx.beginPath();
    ctx.moveTo(this.pos.x + this.size.x / 2, this.pos.y);
    ctx.lineTo(this.pos.x + this.size.x, this.pos.y + this.size.y);
    ctx.lineTo(this.pos.x + this.size.x / 2, this.pos.y + this.size.y - 8);
    ctx.lineTo(this.pos.x, this.pos.y + this.size.y);
    ctx.closePath();
    ctx.fill();

    // Engine flame
    if (Math.random() > 0.5) {
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(this.pos.x + this.size.x / 2 - 2, this.pos.y + this.size.y - 4, 4, 8);
    }
  }

  getBounds(): Rect {
    return {
      x: this.pos.x + 4, // slight hitbox reduction for fairness
      y: this.pos.y + 4,
      width: this.size.x - 8,
      height: this.size.y - 8
    };
  }

  reset() {
    this.pos.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
    this.vel.x = 0;
    this.active = true;
    this.cooldownTimer = 0;
  }
}