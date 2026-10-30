import { BoidsStore } from "@stores/boids/boids.store"
import { BoidsQuery } from "@stores/boids/boids.query"

export { BoidsStore, BoidsQuery }

export const boidsStore = new BoidsStore()
export const boidsQuery = new BoidsQuery(boidsStore)
