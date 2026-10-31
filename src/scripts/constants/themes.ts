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

export const THEMES: Theme[] = [
  {
    name: "Default",
    url: "",
    canvas: "#ffffff",
    boids: [
      "#f89a99",
      "#FD4365",
      "#ee6048",
      "#f89859",
      "#f8eac0",
      "#f8ca65",
      "#f8ba2d",
      "#f3ca85",
      "#c5eb9d",
      "#a4d5a3",
      "#bceae9",
      "#95d3d5",
      "#c2a4e7",
    ],
  },
]
