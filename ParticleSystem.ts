import { Vector2 } from '../types';

class Particle {
  pos: Vector2;
  vel: Vector2;
  life: number;
  maxLife: number;
  color: string;
  size: number;

  constructor(pos: Vector2, color: string) {
    this.pos = { ...pos };
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 100 + 50;
    this.vel = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
    this.maxLife = Math.random() * 0.5 + 0.2;
    this.life = this.maxLife;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }

  update(dt: number) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.life -= dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    ctx.globalAlpha = 1.0;
  }
}

export class ParticleSystem {
  private particles: Particle[] = [];

  update(dt: number) {
    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(p => p.draw(ctx));
  }

  createExplosion(pos: Vector2, color: string, count: number = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(pos, color));
    }
  }

  clear() {
    this.particles = [];
  }
}