import { THEMES } from "./constants"
import { Theme, ThemeNameTypes } from "./types"

export const getTheme = (name: ThemeNameTypes): Theme => {
  const theme = THEMES.find((entry) => entry.name === name)

  if (!theme) {
    throw new Error(`Unknown theme: ${name}`)
  }

  return theme
}
