
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;

export const PLAYER_SPEED = 300;
export const PLAYER_SIZE = 32;
export const PLAYER_COOLDOWN = 0.2; // Seconds

export const ENEMY_SIZE = 24;
export const ENEMY_SPEED = 100;
export const ENEMY_DIVE_SPEED = 250;

export const BOSS_SIZE = 64;
export const BOSS_HP = 50;
export const BOSS_SPEED = 80;
export const BOSS_WAVE_INTERVAL = 3; // Boss appears every X waves

export const PROJECTILE_SPEED = 500;
export const PROJECTILE_SIZE = 4;

export const STAR_COUNT = 100;
export const STAR_SPEED_BASE = 50;

export const COLORS = {
  PLAYER: '#00FFFF',
  PLAYER_BULLET: '#FFFF00',
  ENEMY_BASIC: '#FF0055',
  ENEMY_DIVER: '#AA00FF',
  ENEMY_BOSS: '#FF0000',
  ENEMY_BULLET: '#FF5500',
  TEXT: '#FFFFFF'
};

// Key codes
export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  FIRE: ' ' // Space
};
