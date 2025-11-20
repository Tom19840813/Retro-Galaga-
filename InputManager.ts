import { KEYS } from '../constants';

export class InputManager {
  private keys: Set<string>;

  constructor() {
    this.keys = new Set();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key);
  };

  // For virtual buttons (Mobile)
  public setVirtualKey(key: string, isDown: boolean) {
    if (isDown) {
      this.keys.add(key);
    } else {
      this.keys.delete(key);
    }
  }

  public isDown(key: string): boolean {
    return this.keys.has(key);
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}