import { Entity, EntityType, Rect, Vector2 } from '../types';
import { COLORS, PROJECTILE_SIZE, PROJECTILE_SPEED, CANVAS_HEIGHT } from '../constants';

export class Projectile implements Entity {
  pos: Vector2;
  size: Vector2 = { x: PROJECTILE_SIZE, y: PROJECTILE_SIZE * 2 };
  vel: Vector2;
  active: boolean = true;
  type: EntityType;

  constructor(x: number, y: number, type: EntityType) {
    this.pos = { x, y };
    this.type = type;
    
    // Direction based on type
    const speed = type === EntityType.PROJECTILE_PLAYER ? -PROJECTILE_SPEED : PROJECTILE_SPEED;
    this.vel = { x: 0, y: speed };
  }

  update(dt: number) {
    this.pos.y += this.vel.y * dt;

    // Screen bounds check
    if (this.pos.y < 0 || this.pos.y > CANVAS_HEIGHT) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.type === EntityType.PROJECTILE_PLAYER ? COLORS.PLAYER_BULLET : COLORS.ENEMY_BULLET;
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
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