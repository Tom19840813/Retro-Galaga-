
export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum GameState {
  MENU,
  PLAYING,
  GAME_OVER
}

export enum EntityType {
  PLAYER,
  ENEMY_BASIC,
  ENEMY_DIVER,
  ENEMY_BOSS,
  PROJECTILE_PLAYER,
  PROJECTILE_ENEMY
}

export interface Entity {
  pos: Vector2;
  size: Vector2;
  active: boolean;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  getBounds(): Rect;
}
