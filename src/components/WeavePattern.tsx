import { useRef, useEffect } from 'react'
import p5 from 'p5'
import { WeaveType } from '../App'

interface WeavePatternProps {
  zoom: number
  weaveType: WeaveType
}

const WeavePattern: React.FC<WeavePatternProps> = ({ zoom, weaveType }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<p5 | null>(null)
  const zoomRef = useRef(zoom)

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.noLoop() // Don't continuously redraw
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
        p.redraw()
      }

      p.draw = () => {
        p.background(255)
        
        const threadSize = zoomRef.current
        const warpCount = Math.ceil(p.width / threadSize) + 2
        const weftCount = Math.ceil(p.height / threadSize) + 2
        
        // Thread properties
        const threadWidth = threadSize * 0.4
        const weaveHeight = threadSize * 0.25 // How much threads lift when going over
        
        // Determine if warp goes over weft based on weave pattern
        const isWarpOver = (row: number, col: number): boolean => {
          switch (weaveType) {
            case 'plain':
              return (row + col) % 2 === 0
            case 'twill':
              // 2/2 twill pattern - creates diagonal lines
              return ((row - col) % 4 === 0) || ((row - col) % 4 === 1)
            case 'satin':
              // 5-harness satin - creates long floats
              return (row + col * 3) % 5 === 0
            case 'basket':
              // 2x2 basket weave
              const basketRow = Math.floor(row / 2)
              const basketCol = Math.floor(col / 2)
              return (basketRow + basketCol) % 2 === 0
            default:
              return (row + col) % 2 === 0
          }
        }

        // Draw continuous weft threads (horizontal)
        for (let row = 0; row < weftCount; row++) {
          const y = row * threadSize
          
          p.push()
          p.strokeWeight(threadWidth)
          p.strokeCap(p.SQUARE)
          p.noFill()
          
          // Shadow
          p.stroke(0, 40)
          p.strokeWeight(threadWidth + 2)
          p.beginShape()
          for (let col = -1; col < warpCount; col++) {
            const x = col * threadSize + threadSize/2
            const goesOver = !isWarpOver(row, col)
            const yOffset = goesOver ? -weaveHeight : weaveHeight
            
            if (col === -1) {
              p.vertex(x - threadSize, y + yOffset + 1)
            }
            p.bezierVertex(
              x - threadSize/3, y + yOffset + 1,
              x + threadSize/3, y + yOffset + 1,
              x + threadSize/2, y + (goesOver ? -weaveHeight : weaveHeight) + 1
            )
          }
          p.endShape()
          
          // Main thread - darker blue
          p.stroke(20, 60, 120)
          p.strokeWeight(threadWidth)
          p.beginShape()
          for (let col = -1; col < warpCount; col++) {
            const x = col * threadSize + threadSize/2
            const goesOver = !isWarpOver(row, col)
            const yOffset = goesOver ? -weaveHeight : weaveHeight
            
            if (col === -1) {
              p.vertex(x - threadSize, y + yOffset)
            }
            p.bezierVertex(
              x - threadSize/3, y + yOffset,
              x + threadSize/3, y + yOffset,
              x + threadSize/2, y + (goesOver ? -weaveHeight : weaveHeight)
            )
          }
          p.endShape()
          p.pop()
        }
        
        // Draw continuous warp threads (vertical)
        for (let col = 0; col < warpCount; col++) {
          const x = col * threadSize
          
          p.push()
          p.strokeWeight(threadWidth)
          p.strokeCap(p.SQUARE)
          p.noFill()
          
          // Shadow
          p.stroke(0, 40)
          p.strokeWeight(threadWidth + 2)
          p.beginShape()
          for (let row = -1; row < weftCount; row++) {
            const y = row * threadSize + threadSize/2
            const goesOver = isWarpOver(row, col)
            const xOffset = goesOver ? -weaveHeight : weaveHeight
            
            if (row === -1) {
              p.vertex(x + xOffset + 1, y - threadSize)
            }
            p.bezierVertex(
              x + xOffset + 1, y - threadSize/3,
              x + xOffset + 1, y + threadSize/3,
              x + (goesOver ? -weaveHeight : weaveHeight) + 1, y + threadSize/2
            )
          }
          p.endShape()
          
          // Main thread - beige/cream color
          p.stroke(180, 160, 140)
          p.strokeWeight(threadWidth)
          p.beginShape()
          for (let row = -1; row < weftCount; row++) {
            const y = row * threadSize + threadSize/2
            const goesOver = isWarpOver(row, col)
            const xOffset = goesOver ? -weaveHeight : weaveHeight
            
            if (row === -1) {
              p.vertex(x + xOffset, y - threadSize)
            }
            p.bezierVertex(
              x + xOffset, y - threadSize/3,
              x + xOffset, y + threadSize/3,
              x + (goesOver ? -weaveHeight : weaveHeight), y + threadSize/2
            )
          }
          p.endShape()
          p.pop()
        }
      }
    }

    p5InstanceRef.current = new p5(sketch, containerRef.current)

    return () => {
      p5InstanceRef.current?.remove()
    }
  }, [weaveType]) // Recreate p5 instance when weaveType changes

  // Update when zoom changes
  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.redraw()
    }
  }, [zoom])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default WeavePattern