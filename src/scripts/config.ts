const COLORS = [
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
]

export const config = {
  app: {
    showFps: true,
  },
  boids: {
    count: 20,
    minSize: 30,
    maxSize: 60,
    awarenessFactor: 10,
    colors: COLORS,
  },
}
