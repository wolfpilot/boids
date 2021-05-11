import { BoidsStore } from "./boids.store"
import { BoidsQuery } from "./boids.query"

export { BoidsStore, BoidsQuery }

export const boidsStore = new BoidsStore()
export const boidsQuery = new BoidsQuery(boidsStore)
