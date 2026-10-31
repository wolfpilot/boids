# Boids

A JS Canvas experiment with boids and simulated lifelike behaviours.

## Table of contents

- [How it works](#how-it-works)
- [Demo](#demo)
- [Getting started](#getting-started)
- [Resources](#resources)
- [License](#license)

## How it works

The core components are initialised by [`App`](src/scripts/App.ts):

- [`Engine`](src/scripts/engine/Engine.ts) runs physics updates from a shared boid snapshot, publishes the results, then draws the latest state.
- [`Canvas`](src/scripts/actors/Canvas/Canvas.ts) paints the background and keeps the canvas size and logical bounds in sync with the window.
- [`GUI`](src/scripts/interface/GUI.ts) provides live controls for rendering, pointer behaviour, themes, overlays and boid traits.

Two managers handle browser input:

- [`VisibilityManager`](src/scripts/managers/VisibilityManager.ts) reports when the page is hidden or visible so `App` can stop or restart the engine.
- [`PointerManager`](src/scripts/managers/PointerManager.ts) tracks mouse position and presence across the page, clearing it when the pointer leaves or the window loses focus.

### Behaviours

The following are based on Craig Reynolds concept of [boids](https://en.wikipedia.org/wiki/Boids), a combination of various algorithms meant to mimic artificial life as flocks of creatures. This idea can be continuously iterated upon to give the individuals various characteristics: big or small, fast or slow, curious, scared or simply meandering.

Currently the following behaviours have been implemented:

- **Align:** Match the velocity of nearby boids.
- **Cohere:** Steer toward the centre of nearby boids.
- **Separate:** Move away from close boids, with a stronger push at shorter distances.
- **Wander:** Follow a gently changing direction when no target is nearby.
- **Seek:** Steer toward a target and slow down on arrival.
- **Flee:** Steer away from a nearby target.

The GUI's pointer mode switches between seek or flee when the pointer enters a boid's range.

Outside said range, wandering takes over. Wander and target steering blend near the range edge, while align, cohere and separate are permanently activated.

### Individual and shared variation

Each boid starts with a random size, maximum speed, steering limit, heading, and wander angle. These differences give boids their own motion; live GUI multipliers can adjust their size-based traits later. The flocking rules also change together over time. Smooth cycles vary the alignment, cohesion, and separation ranges and strengths for every boid on each physics update.

When the page is hidden/unfocused, the physics pause and continue from there when it becomes visible/focused again.

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

Set the starting population, size range, boid multipliers, pointer mode, theme, and display defaults in [`src/scripts/config.ts`](src/scripts/config.ts). The GUI lets you change the FPS cap, pointer mode, theme, vector overlays and all boid multipliers while the simulation runs.

Changing the population or size range still requires a reload.

### How to deploy

```bash
# Build and deploy to GitHub Pages with pnpm
$ pnpm deploy
```

## Resources

### Documentation

- Craig Reynolds explanation of [boids behaviour](https://www.red3d.com/cwr/boids/)
- Craig Reynolds' [steering paper](https://www.red3d.com/cwr/steer/gdc99/) and [wander demonstration](https://www.red3d.com/cwr/steer/Wander.html) are the algorithmic references.
- Justin Windle's [Organis.ms](https://github.com/soulwire/organis.ms) is a coding reference.
- Timm Wong [overview](https://cs.stanford.edu/people/eroberts/courses/soco/projects/2008-09/modeling-natural-systems/boids.html) on boids

### Guides

- Original boids [demonstration](https://www.youtube.com/watch?v=86iQiV3-3IA) by Craig Reynolds
- [How do boids work?](https://youtu.be/QbUPfMXXQIY) by dante
- [Flocking Simulation](https://youtu.be/mhjuuHl6qHM) by The Coding Train

## License

This project is licensed under the [MIT License](LICENSE).
