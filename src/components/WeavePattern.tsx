import { useRef, useEffect } from 'react'
import p5 from 'p5'

interface WeavePatternProps {
  zoom: number
}

const WeavePattern: React.FC<WeavePatternProps> = ({ zoom }) => {
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
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
      }

      p.draw = () => {
        p.background(240)
        
        const threadSize = zoomRef.current
        const warpCount = Math.ceil(p.width / threadSize) + 2
        const weftCount = Math.ceil(p.height / threadSize) + 2
        
        p.stroke(0)
        p.strokeWeight(3)
        
        for (let row = 0; row < weftCount; row++) {
          for (let col = 0; col < warpCount; col++) {
            if ((row + col) % 2 === 0) {
              // Warp thread (vertical) goes over weft thread (horizontal)
              // Draw weft thread segments
              p.line(
                col * threadSize, 
                row * threadSize + threadSize/2,
                col * threadSize + threadSize/3, 
                row * threadSize + threadSize/2
              )
              p.line(
                col * threadSize + 2*threadSize/3, 
                row * threadSize + threadSize/2,
                (col + 1) * threadSize, 
                row * threadSize + threadSize/2
              )
              
              // Draw full warp thread
              p.line(
                col * threadSize + threadSize/2, 
                row * threadSize,
                col * threadSize + threadSize/2, 
                (row + 1) * threadSize
              )
            } else {
              // Weft thread (horizontal) goes over warp thread (vertical)
              // Draw warp thread segments
              p.line(
                col * threadSize + threadSize/2, 
                row * threadSize,
                col * threadSize + threadSize/2, 
                row * threadSize + threadSize/3
              )
              p.line(
                col * threadSize + threadSize/2, 
                row * threadSize + 2*threadSize/3,
                col * threadSize + threadSize/2, 
                (row + 1) * threadSize
              )
              
              // Draw full weft thread
              p.line(
                col * threadSize, 
                row * threadSize + threadSize/2,
                (col + 1) * threadSize, 
                row * threadSize + threadSize/2
              )
            }
          }
        }
      }
    }

    p5InstanceRef.current = new p5(sketch, containerRef.current)

    return () => {
      p5InstanceRef.current?.remove()
    }
  }, [])

  // Update zoom when it changes
  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.redraw()
    }
  }, [zoom])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default WeavePattern