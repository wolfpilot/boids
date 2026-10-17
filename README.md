# Boids

Just a fun little project exploring Boid simulations in JS Canvas.

## Table of contents

- [Intro](#intro)
- [How it works](#how-it-works)
- [Demo](#demo)
- [Getting started](#getting-started)
- [Resources](#resources)
- [License](#license)

## Intro

This Canvas experiment currently has three steering behaviours: seek the pointer, align with nearby boids, and separate from boids that get too close.

## How it works

[`App`](src/scripts/App.ts) creates the canvas and boids, initializes the managers and UI, and connects GUI and page visibility changes to [`Engine`](src/scripts/engine/Engine.ts). The engine coordinates two phases: update boid state, then draw the latest state.

[`Loop`](src/scripts/engine/Loop.ts) uses `requestAnimationFrame` to decide how many physics updates are due and whether a draw is due. The loop handles timing; it does not calculate steering or touch the canvas.

### Update

For each due physics update, `Engine` reads the current boid entities from the store as a snapshot. [`stepBoids()`](src/scripts/engine/utils/stepBoids.ts) calculates each boid's next velocity and position from that **same input snapshot**, using the pointer target, nearby boids, steering forces, and friction.

It then returns a new collection which `Engine` publishes to the store in one operation.

A boid therefore cannot react to another boid's new position until the next physics update. If several updates are due in one browser frame, each update starts from the collection published by the previous one.

### Drawing

When a draw is due, `Engine` clears the canvas and asks each `Boid` actor to draw.

The actors look up their latest entities in the store, so drawing uses the completed physics state. Drawing does not advance physics. There is no interpolation between physics states; a draw shows the latest published state.

### Timing

It's important to understand that the update loop and drawing loop are completely separate.

Physics runs in fixed 1/60-second updates. Browser animation callbacks can arrive at uneven intervals, so the loop saves leftover time until another full update is due. The GUI's `maxFps` setting caps **drawing only**; changing it does not change the physics update rate. At a steady 30 FPS draw rate, there are typically two physics updates between draws.

After a slow or suspended browser frame, the loop allows at most five physics updates at once and drops excess elapsed time rather than trying to replay a long pause. When the page is hidden, it stops requesting frames. When the page becomes visible, it restarts with a fresh clock. Boid velocities are applied once per fixed update, rather than scaled by each browser frame's elapsed time.

Neighbour searches currently scan the flock for each boid, so their cost grows roughly with the square of the boid count. The default flock has 20 boids; a spatial grid would be a useful later change for much larger flocks.

## Demo

- [https://wolfpilot.github.io/boids/](https://wolfpilot.github.io/boids/)

## Getting started

### Requirements

- Node.js 24
- [pnpm](https://pnpm.io/) 12

### Installation

```bash
$ git clone https://github.com/wolfpilot/boids.git
$ cd boids
$ pnpm install
```

### How to run

```bash
# Run a local server instance
$ pnpm start
```

### How to deploy

```bash
# Build and deploy to GitHub Pages with pnpm
$ pnpm deploy
```

## Resources

### Documentation

- Craig Reynolds explanation of [boids behaviour](https://www.red3d.com/cwr/boids/)
- Timm Wong [overview](https://cs.stanford.edu/people/eroberts/courses/soco/projects/2008-09/modeling-natural-systems/boids.html) on boids

### Guides

- Original boids [demonstration](https://www.youtube.com/watch?v=86iQiV3-3IA) by Craig Reynolds
- [How do boids work?](https://youtu.be/QbUPfMXXQIY) by dante
- [Flocking Simulation](https://youtu.be/mhjuuHl6qHM) by The Coding Train

## License

This project is licensed under the [MIT License](LICENSE).
