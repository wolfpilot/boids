import { IVector } from "../geometry/Vector";
import { IBoid } from "../actors/Boid/Boid";
import {
  subtract,
  multiply,
  normalize,
  limitMagnitude,
} from "../utils/vectorHelpers";

interface IOptions {
  target: IVector;
  source: IBoid;
  maxSteeringForce: number;
  maxSpeed: number;
}

export const seek = ({
  target,
  source,
  maxSteeringForce,
  maxSpeed,
}: IOptions) => {
  const targetLocation = subtract(target, source.state.location);
  const normTargetDirection = normalize(targetLocation);

  // Assume that the actor will desire to head towards its target at max speed
  const desired = multiply(normTargetDirection, maxSpeed);

  // Assign a force that allows only a certain amount of maneuverability
  const seekVector = subtract(desired, source.state.velocity);
  const seek = limitMagnitude(seekVector, maxSteeringForce);

  return seek;
};
