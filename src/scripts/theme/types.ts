export const ThemeNames = {
  default: "Default",
  fruitStripeGum: "Fruit Stripe Gum",
  peachBlossoms: "Peach Blossoms",
  seaSalt: "Sea Salt",
  pavoReal4: "Pavo Real 4",
  aYearWithoutYou: "A Year Without You",
  nyx: "Nyx",
  rayOfLight: "Ray of Light",
  theFirebird: "The Firebird",
  electroRecall: "Electro Recall",
} as const
export type ThemeNameTypes = (typeof ThemeNames)[keyof typeof ThemeNames]

export interface Theme {
  name: ThemeNameTypes
  url: string
  canvas: string
  boids: string[]
}
