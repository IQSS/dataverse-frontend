import { ReactNode } from 'react'

interface CanvasFixedHeight {
  height: number
  children: ReactNode
}

export function CanvasFixedHeight({ height, children }: CanvasFixedHeight) {
  return <div style={{ height: height }}>{children}</div>
}
