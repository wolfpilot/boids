const parseHexColor = (color: string): number[] | null => {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return null

  return [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16))
}

const toHexColor = (channels: number[]): string =>
  `#${channels
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`

const clampAmount = (amount: number): number => Math.min(1, Math.max(0, amount))

export const darkenHexColor = (color: string, amount: number): string => {
  const channels = parseHexColor(color)
  if (!channels) return color

  const factor = 1 - clampAmount(amount)
  return toHexColor(channels.map((channel) => channel * factor))
}

export const lightenHexColor = (color: string, amount: number): string => {
  const channels = parseHexColor(color)
  if (!channels) return color

  const factor = clampAmount(amount)
  return toHexColor(
    channels.map((channel) => channel + (255 - channel) * factor)
  )
}

export const saturateHexColor = (color: string, amount: number): string => {
  const channels = parseHexColor(color)
  if (!channels) return color

  const min = Math.min(...channels)
  const max = Math.max(...channels)
  const chroma = max - min

  if (chroma === 0) return color

  const lightness = (max + min) / 2
  const maximumChroma = 255 - Math.abs(2 * lightness - 255)
  const nextChroma = chroma + (maximumChroma - chroma) * clampAmount(amount)
  const scale = nextChroma / chroma

  return toHexColor(
    channels.map((channel) => lightness + (channel - lightness) * scale)
  )
}
