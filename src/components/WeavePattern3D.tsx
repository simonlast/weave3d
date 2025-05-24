import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { WeaveType } from '../App'

interface WeavePattern3DProps {
  zoom: number
  weaveType: WeaveType
  threadSpacing: number
  threadThickness: number
  weaveHeight: number
  gridSize: number
  weftColor: string
  warpColor: string
}

interface ThreadProps {
  points: THREE.Vector3[]
  color: string
  radius?: number
}

function Thread({ points, color, radius = 0.05 }: ThreadProps) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  
  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, radius, 8, false)
  }, [curve, radius])

  return (
    <mesh>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color={color}
        roughness={0.6}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

interface WeaveSceneProps {
  zoom: number
  weaveType: WeaveType
  threadSpacing: number
  threadThickness: number
  weaveHeight: number
  gridSize: number
  weftColor: string
  warpColor: string
}

function WeaveScene({ zoom, weaveType, threadSpacing, threadThickness, weaveHeight, gridSize, weftColor, warpColor }: WeaveSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  const isWarpOver = (row: number, col: number): boolean => {
    switch (weaveType) {
      case 'plain':
        return (row + col) % 2 === 0
      case 'twill':
        return (row + col) % 4 < 2
      case 'satin':
        return (row + col * 2) % 5 === 0
      case 'basket':
        const basketRow = Math.floor(row / 2)
        const basketCol = Math.floor(col / 2)
        return (basketRow + basketCol) % 2 === 0
      default:
        return false
    }
  }

  const threads = useMemo(() => {
    const weftThreads: JSX.Element[] = []
    const warpThreads: JSX.Element[] = []

    // Create weft threads (horizontal)
    for (let row = 0; row < gridSize; row++) {
      const points: THREE.Vector3[] = []
      
      for (let col = 0; col <= gridSize; col++) {
        const x = col * threadSpacing - gridSize * threadSpacing / 2
        const z = row * threadSpacing - gridSize * threadSpacing / 2
        const y = isWarpOver(row, col) ? -weaveHeight : weaveHeight
        
        points.push(new THREE.Vector3(x, y, z))
      }
      
      weftThreads.push(
        <Thread
          key={`weft-${row}`}
          points={points}
          color={weftColor}
          radius={threadThickness}
        />
      )
    }

    // Create warp threads (vertical)
    for (let col = 0; col < gridSize; col++) {
      const points: THREE.Vector3[] = []
      
      for (let row = 0; row <= gridSize; row++) {
        const x = col * threadSpacing - gridSize * threadSpacing / 2
        const z = row * threadSpacing - gridSize * threadSpacing / 2
        const y = isWarpOver(row, col) ? weaveHeight : -weaveHeight
        
        points.push(new THREE.Vector3(x, y, z))
      }
      
      warpThreads.push(
        <Thread
          key={`warp-${col}`}
          points={points}
          color={warpColor}
          radius={threadThickness}
        />
      )
    }

    return [...weftThreads, ...warpThreads]
  }, [weaveType, threadSpacing, threadThickness, weaveHeight, gridSize, weftColor, warpColor])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(zoom / 50)
    }
  })

  return (
    <group ref={groupRef}>
      {threads}
    </group>
  )
}

export function WeavePattern3D({ zoom, weaveType, threadSpacing, threadThickness, weaveHeight, gridSize, weftColor, warpColor }: WeavePattern3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 20, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={false}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
          touches={{
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          screenSpacePanning={true}
          zoomToCursor={true}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, 10, -5]} intensity={0.4} />
        <WeaveScene 
          zoom={zoom} 
          weaveType={weaveType}
          threadSpacing={threadSpacing}
          threadThickness={threadThickness}
          weaveHeight={weaveHeight}
          gridSize={gridSize}
          weftColor={weftColor}
          warpColor={warpColor}
        />
      </Canvas>
    </div>
  )
}