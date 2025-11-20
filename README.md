# Galactic Defender 🚀

A high-performance, retro-style arcade space shooter built with **React 19**, **TypeScript**, and **HTML5 Canvas**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.0-61DAFB)

## 🎮 Features

*   **Custom Game Engine**: Built from scratch using HTML5 Canvas API (no external game libraries).
*   **High Performance**: Optimized 60 FPS game loop with delta-time physics.
*   **Retro Aesthetics**: Pixel-perfect rendering, CRT scanline shaders, and particle effects.
*   **Procedural Audio**: synthesized sound effects using the Web Audio API (no external assets required).
*   **Classic Gameplay**:
    *   Smooth player physics with inertia.
    *   Bézier curve enemy entry patterns.
    *   Formations, dive-bomb attacks, and progressive difficulty waves.

## 🛠️ Tech Stack

*   **Core**: React 19, TypeScript
*   **Rendering**: HTML5 Canvas 2D Context
*   **Styling**: Tailwind CSS
*   **Architecture**: Component-Entity-System (CES) inspired OOP class structure.

## 🕹️ Controls

*   **Arrow Left / Right**: Move Ship
*   **Spacebar**: Fire Laser
*   **Start Button**: Insert Coin / Begin Game

## 🚀 Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```text
src/
├── game/           # Game Engine Logic
│   ├── GameEngine.ts   # Main loop & state management
│   ├── Player.ts       # Player physics & input
│   ├── Enemy.ts        # AI & pathfinding
│   ├── Swarm.ts        # Wave management
│   └── ...
├── assets/         # (Generated procedurally in code)
├── types.ts        # Shared interfaces
└── App.tsx         # React UI layer
```