import { Vector } from "@ts/geometry"

interface ArrowOptions {
  ctx: CanvasRenderingContext2D
  origin: Vector
  displacement: Vector
  color: string
  lineWidth: number
  headSize: number
}

export const drawArrow = ({
  ctx,
  origin,
  displacement,
  color,
  lineWidth,
  headSize,
}: ArrowOptions): void => {
  const length = Math.hypot(displacement.x, displacement.y)

  if (length === 0) return

  const endX = origin.x + displacement.x
  const endY = origin.y + displacement.y
  const arrowSize = Math.min(headSize, length / 2)
  const directionX = displacement.x / length
  const directionY = displacement.y / length
  const headBaseX = endX - directionX * arrowSize
  const headBaseY = endY - directionY * arrowSize
  const halfHeadWidth = arrowSize / 2
  const sideX = -directionY * halfHeadWidth
  const sideY = directionX * halfHeadWidth

  ctx.save()
  ctx.beginPath()

  ctx.moveTo(origin.x, origin.y)
  ctx.lineTo(endX, endY)
  ctx.moveTo(headBaseX + sideX, headBaseY + sideY)
  ctx.lineTo(endX, endY)
  ctx.lineTo(headBaseX - sideX, headBaseY - sideY)

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color

  ctx.stroke()
  ctx.restore()
}
