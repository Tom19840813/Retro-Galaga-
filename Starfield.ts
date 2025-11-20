import { CANVAS_WIDTH, CANVAS_HEIGHT, STAR_COUNT, STAR_SPEED_BASE } from '../constants';

interface Star {
  x: number;
  y: number;
  z: number; // Depth (speed factor)
  size: number;
}

export class Starfield {
  private stars: Star[] = [];

  constructor() {
    for (let i = 0; i < STAR_COUNT; i++) {
      this.stars.push(this.createStar());
    }
  }

  private createStar(): Star {
    return {
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      z: Math.random() * 1.5 + 0.5, // Speed multiplier
      size: Math.random() > 0.9 ? 2 : 1
    };
  }

  update(dt: number) {
    this.stars.forEach(star => {
      star.y += STAR_SPEED_BASE * star.z * dt;
      
      // Wrap around
      if (star.y > CANVAS_HEIGHT) {
        star.y = 0;
        star.x = Math.random() * CANVAS_WIDTH;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FFFFFF';
    this.stars.forEach(star => {
      const opacity = star.z / 2; // Fainter if slower/further
      ctx.globalAlpha = opacity;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1.0;
  }
}