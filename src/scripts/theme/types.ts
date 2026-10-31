export const ThemeNames = {
  default: "Default",
  theFirebird: "The Firebird",
} as const
export type ThemeNameTypes = (typeof ThemeNames)[keyof typeof ThemeNames]

export interface Theme {
  name: ThemeNameTypes
  url: string
  canvas: string
  boids: string[]
}
