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

This Canvas experiment combines wandering, alignment, cohesion, and separation. A boid seeks the pointer when it comes within range.

## How it works

[`App`](src/scripts/App.ts) creates the canvas and boids, initializes the managers and UI, and connects GUI and page visibility changes to [`Engine`](src/scripts/engine/Engine.ts). The engine coordinates two phases: update boid state, then draw the latest state.

[`Loop`](src/scripts/engine/Loop.ts) uses `requestAnimationFrame` to decide how many physics updates are due and whether a draw is due. The loop handles timing; it does not calculate steering or touch the canvas.

### Update

For each due physics update, `Engine` reads the current boid entities from the store as a snapshot. [`stepBoids()`](src/scripts/engine/utils/stepBoids.ts) calculates each boid's next velocity and position from that **same input snapshot**, using the pointer target, nearby boids, steering forces, and friction.

It then returns a new collection which `Engine` publishes to the store in one operation.

A boid therefore cannot react to another boid's new position until the next physics update. If several updates are due in one browser frame, each update starts from the collection published by the previous one.

### Steering and flocking

The flocking behaviours follow [Craig Reynolds' steering model](https://www.red3d.com/cwr/steer/gdc99/). Each boid reacts to neighbours within its own behaviour radii:

- **Alignment** returns the average neighbour velocity minus the boid's velocity. This matches both heading and speed.
- **Cohesion** returns the offset from the boid to the neighbours' average position. The pull naturally becomes smaller near that position.
- **Separation** sums directions away from neighbours, with each unit direction divided by distance. Closer neighbours produce stronger pushes. Coincident positions are ignored to avoid dividing by zero.

Alignment and cohesion use a `fieldOfViewDegrees` setting of `300`, measured around the velocity direction. Boids directly behind fall outside that field, allowing leading boids to take different paths. At rest, a boid considers neighbours in every direction. Separation always checks every direction so neighbours approaching from behind still cause a push away.

The behaviours return unweighted vectors. [`combineSteering()`](src/scripts/engine/utils/combineSteering.ts) applies the weights from [`Boid/config.ts`](src/scripts/actors/Boid/config.ts), adds any existing acceleration, and limits the result to `maxSteeringForce` before movement is calculated.

| Behaviour  | Weight |
| ---------- | -----: |
| Alignment  |    0.5 |
| Cohesion   |  0.005 |
| Separation |     32 |
| Wander     |    0.1 |
| Seek       |      1 |

These are settings for this project. Each weight scales a vector with a different natural magnitude: cohesion starts with a position offset, for example, while separation uses inverse distance. The final combined force is capped at `0.5` per fixed update.

Speed-based drag is added after steering. The resulting acceleration changes velocity, velocity is limited to the boid's maximum speed, and velocity then changes position. Acceleration is cleared for the next update.

Alignment, cohesion, separation, and wander run together by default. When the mouse is present and inside a boid's seeking radius, seek replaces wander for that boid. Its wander angle is retained until wandering resumes. A boid can stop near the pointer only when it is already moving slowly and its combined neighbour steering is zero.

Groups form, merge, and split through these local interactions. Stronger separation maintains space within a flock, while limited perception and persistent wander allow members to take different paths. Soft steering can still permit brief overlaps during crossings. Each boid uses its own speed limit. Boids wrap after their whole body leaves the canvas, using logical canvas bounds updated on resize. Neighbour distances are measured directly between their current positions.

### Wander

[`wander()`](src/scripts/behaviours/wander/wander.ts) implements the two-dimensional circle construction from [Reynolds' wander description](https://www.red3d.com/cwr/steer/Wander.html).

Each boid stores a `wanderAngle`, representing a point on a unit circle. Each wandering update samples an offset uniformly within a unit disk, scales it by `wander.rate`, adds it to the previous point, and projects the point back onto the circle. The updated angle becomes the next update's starting point. This memory makes successive steering directions related.

The circle centre lies `√2` units along the boid's velocity direction. The circle point, scaled by `wander.strength`, is added to that centre to produce the steering vector. These are steering-vector units. With the default strength of `1`, the circle stays ahead of a moving boid. At rest, the remembered circle point supplies the initial direction.

`wander.rate` defaults to `0.15` and controls how quickly the point changes. `wander.strength` controls how far it sits from the circle centre, while the wander weight controls its contribution alongside the flocking forces. Wander keeps contributing while neighbours are present. Random offsets come from `Math.random()`, so paths vary between runs.

### Drawing

When a draw is due, `Engine` clears the canvas and asks each `Boid` actor to draw.

The actors look up their latest entities in the store, so drawing uses the completed physics state. Drawing does not advance physics. There is no interpolation between physics states; a draw shows the latest published state.

### Timing

It's important to understand that the update loop and drawing loop are completely separate.

Physics runs in fixed 1/60-second updates. Browser animation callbacks can arrive at uneven intervals, so the loop saves leftover time until another full update is due. The GUI's `maxFps` setting caps **drawing only**; changing it does not change the physics update rate. At a steady 30 FPS draw rate, there are typically two physics updates between draws.

After a slow or suspended browser frame, the loop allows at most five physics updates at once and drops excess elapsed time rather than trying to replay a long pause. When the page is hidden, it stops requesting frames. When the page becomes visible, it restarts with a fresh clock. Boid velocities are applied once per fixed update, rather than scaled by each browser frame's elapsed time.

Neighbour searches currently scan the flock for each boid, so their cost grows roughly with the square of the boid count. A spatial grid would be a useful later change for much larger flocks.

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

Population, size, and trait multipliers are configured in [`src/scripts/config.ts`](src/scripts/config.ts). Reload the page after changing these settings so the boid actors are created with the new traits.

Development output and cache use `.parcel-dev` and `.parcel-cache-dev`. Production builds write to `dist` and use `.parcel-cache`.

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
