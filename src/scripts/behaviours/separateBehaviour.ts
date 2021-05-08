import Vector from "../geometry/Vector";
import { IBoid } from "../actors/Boid/Boid";
import {
  add,
  subtract,
  multiply,
  normalize,
  mag,
} from "../utils/vectorHelpers";

interface IOptions {
  boids: IBoid[];
  source: IBoid;
  separationAreaSize: number;
  maxSpeed: number;
}

// Keep a distance from neighbouring boids
export const separate = ({
  boids,
  source,
  separationAreaSize,
  maxSpeed,
}: IOptions): Vector => {
  let separate = new Vector(0, 0);

  // Get all other boids that can be found in the designated surrounding area
  const neighbours = boids.filter((boid: IBoid) => {
    const nLocation = subtract(boid.state.location, source.state.location);
    const nDistance = mag(nLocation);

    if (nDistance > 0 && nDistance < separationAreaSize + boid.size) {
      return boid;
    }
  });

  // Check if any neighbors are found within the acceptable vicinity
  if (neighbours.length === 0) {
    return separate;
  }

  // Calculate the forces necessary to separate this from other boids
  neighbours.forEach((boid: IBoid) => {
    let desired = subtract(source.state.location, boid.state.location);

    // Compute directional unit vector
    desired = normalize(desired);

    // Scale force proportionally to distance & radius
    desired = multiply(desired, maxSpeed);
    // desired.scale utils.map distSq, radiiSq, 0, 0, agent.maxSpeed

    separate = add(separate, desired);
  });

  return separate;
};
