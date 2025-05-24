import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { WeaveType } from '../App'

interface WeavePattern3DProps {
  zoom: number
  weaveType: WeaveType
  threadSpacing: number
  threadThickness: number
  weaveHeight: number
  weftColor: string
  warpColor: string
  materialType?: 'cotton' | 'silk' | 'wool' | 'synthetic'
}

interface ThreadProps {
  points: THREE.Vector3[]
  color: string
  radius?: number
  materialType?: 'cotton' | 'silk' | 'wool' | 'synthetic'
}

function Thread({ points, color, radius = 0.05, materialType = 'cotton' }: ThreadProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])
  
  // Create geometry with higher resolution for better quality
  const geometry = useMemo(() => {
    const tubularSegments = 96
    const radialSegments = 10
    return new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false)
  }, [curve, radius])
  
  // Material properties for different thread types
  const materialProps = useMemo(() => {
    const materials = {
      cotton: { 
        roughness: 0.7, 
        metalness: 0.0, 
        sheen: 0.3,
        sheenRoughness: 0.8,
        sheenColor: new THREE.Color(color).multiplyScalar(1.1),
        clearcoat: 0,
        clearcoatRoughness: 0
      },
      silk: { 
        roughness: 0.2, 
        metalness: 0.05, 
        sheen: 0.9,
        sheenRoughness: 0.2,
        sheenColor: new THREE.Color(color).multiplyScalar(1.3),
        clearcoat: 0.3,
        clearcoatRoughness: 0.1
      },
      wool: { 
        roughness: 0.85, 
        metalness: 0.0, 
        sheen: 0.2,
        sheenRoughness: 0.9,
        sheenColor: new THREE.Color(color).multiplyScalar(1.05),
        clearcoat: 0,
        clearcoatRoughness: 0
      },
      synthetic: { 
        roughness: 0.3, 
        metalness: 0.1, 
        sheen: 0.7,
        sheenRoughness: 0.3,
        sheenColor: new THREE.Color(color).multiplyScalar(1.2),
        clearcoat: 0.5,
        clearcoatRoughness: 0.05
      }
    }
    return materials[materialType]
  }, [materialType, color])

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color={color}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        sheen={materialProps.sheen}
        sheenRoughness={materialProps.sheenRoughness}
        sheenColor={materialProps.sheenColor}
        clearcoat={materialProps.clearcoat}
        clearcoatRoughness={materialProps.clearcoatRoughness}
        envMapIntensity={1.2}
        side={THREE.DoubleSide}
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
  weftColor: string
  warpColor: string
  materialType?: 'cotton' | 'silk' | 'wool' | 'synthetic'
}

function WeaveScene({ zoom, weaveType, threadSpacing, threadThickness, weaveHeight, weftColor, warpColor, materialType = 'cotton' }: WeaveSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  
  // Calculate grid size based on viewport and zoom
  const gridSize = useMemo(() => {
    // Calculate visible area based on zoom
    const visibleWidth = viewport.width * (50 / zoom)
    const visibleHeight = viewport.height * (50 / zoom)
    
    // Calculate how many threads fit in the visible area
    const threadsX = Math.ceil(visibleWidth / threadSpacing) + 4 // Add padding
    const threadsY = Math.ceil(visibleHeight / threadSpacing) + 4
    
    // Use the larger dimension to ensure square grid that covers viewport
    return Math.max(threadsX, threadsY, 20) // Minimum 20 for quality
  }, [viewport.width, viewport.height, zoom, threadSpacing])
  
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
          materialType={materialType}
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
          materialType={materialType}
        />
      )
    }

    return [...weftThreads, ...warpThreads]
  }, [weaveType, threadSpacing, threadThickness, weaveHeight, gridSize, weftColor, warpColor, materialType])

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

export function WeavePattern3D({ zoom, weaveType, threadSpacing, threadThickness, weaveHeight, weftColor, warpColor, materialType = 'cotton' }: WeavePattern3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white' }}>
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
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
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <directionalLight position={[-5, 15, -5]} intensity={0.6} color="#ffeedd" />
        <directionalLight position={[0, 5, 10]} intensity={0.3} color="#ddeeff" />
        <fog attach="fog" args={['white', 30, 60]} />
        <WeaveScene 
          zoom={zoom} 
          weaveType={weaveType}
          threadSpacing={threadSpacing}
          threadThickness={threadThickness}
          weaveHeight={weaveHeight}
          weftColor={weftColor}
          warpColor={warpColor}
          materialType={materialType}
        />
      </Canvas>
    </div>
  )
}