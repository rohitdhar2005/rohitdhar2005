import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Sagittarius major stars: [name, x, y, z, magnitude (1=brightest)]
const STARS = [
  // The Teapot asterism + key stars
  { name: 'Kaus Australis', pos: [-0.6, -1.1, 0.1], mag: 1.0 },   // ε Sgr - brightest
  { name: 'Kaus Meridionalis', pos: [-0.3, -0.3, 0.0], mag: 0.75 }, // δ Sgr
  { name: 'Kaus Borealis', pos: [0.1,  0.45, 0.05], mag: 0.7 },    // λ Sgr
  { name: 'Al Nasl',       pos: [-1.05, 0.2, 0.0], mag: 0.65 },    // γ Sgr
  { name: 'Nunki',         pos: [1.1,  -0.15, 0.2], mag: 0.8 },    // σ Sgr
  { name: 'Ascella',       pos: [0.65, -0.9, 0.15], mag: 0.6 },    // ζ Sgr
  { name: 'Albaldah',      pos: [0.8,  0.9,  0.1], mag: 0.55 },    // π Sgr
  { name: 'Arkab Pri',     pos: [1.5, -0.85, 0.25], mag: 0.5 },    // β¹ Sgr
  { name: 'Polis',         pos: [-0.1,  1.2, 0.0], mag: 0.5 },     // μ Sgr
  { name: 'Tau Sgr',       pos: [0.35, -1.3, 0.1], mag: 0.45 },    // τ Sgr
  { name: 'Phi Sgr',       pos: [0.0, -0.65, 0.0], mag: 0.4 },     // φ Sgr
  { name: 'Eta Sgr',       pos: [-1.3, -0.55, -0.1], mag: 0.4 },   // η Sgr
]

// Constellation lines (pairs of star indices)
const LINES = [
  [0, 10], // Kaus Australis — Phi Sgr
  [10, 1], // Phi Sgr — Kaus Meridionalis
  [1, 2],  // Kaus Meridionalis — Kaus Borealis
  [2, 8],  // Kaus Borealis — Polis
  [1, 3],  // Kaus Meridionalis — Al Nasl
  [3, 11], // Al Nasl — Eta Sgr
  [11, 0], // Eta Sgr — Kaus Australis
  [0, 9],  // Kaus Australis — Tau Sgr
  [9, 5],  // Tau Sgr — Ascella
  [5, 4],  // Ascella — Nunki
  [4, 6],  // Nunki — Albaldah
  [6, 2],  // Albaldah — Kaus Borealis
  [4, 7],  // Nunki — Arkab
  [5, 10], // Ascella — Phi Sgr
]

// Floating background stars (sparkle field)
function StarField() {
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2 - 1.5
    }
    return arr
  }, [])

  const matRef = useRef()
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.opacity = 0.35 + Math.sin(clock.getElapsedTime() * 1.2) * 0.15
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.04}
        color="#c8b8ff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// One glowing constellation star
function ConstellationStar({ position, magnitude }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const radius = 0.045 + magnitude * 0.04

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const twinkle = 0.85 + Math.sin(t * 2.1 + phase) * 0.15
    if (meshRef.current) {
      meshRef.current.scale.setScalar(twinkle)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.18 + magnitude * 0.22 * twinkle
    }
  })

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 3.5, 16, 16]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
      {/* Core star */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#d8c8ff"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// Constellation lines drawn with LineSegments
function ConstellationLines() {
  const geometry = useMemo(() => {
    const points = []
    LINES.forEach(([a, b]) => {
      points.push(new THREE.Vector3(...STARS[a].pos))
      points.push(new THREE.Vector3(...STARS[b].pos))
    })
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  const matRef = useRef()
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.opacity = 0.28 + Math.sin(clock.getElapsedTime() * 0.6) * 0.06
    }
  })

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color="#7c5cfc"
        transparent
        opacity={0.3}
        linewidth={1}
      />
    </lineSegments>
  )
}

// Label sprites for star names
function StarLabel({ position, name }) {
  return null // keep scene clean; remove this component to add labels back
}

// Root scene group with slow rotation
function SagittariusScene() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04
      groupRef.current.rotation.x = Math.sin(t * 0.025) * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <ConstellationLines />
      {STARS.map((star) => (
        <ConstellationStar
          key={star.name}
          position={star.pos}
          magnitude={star.mag}
        />
      ))}
    </group>
  )
}

export default function PlanetCanvas() {
  return (
    <div style={{
      position: 'absolute',
      right: '3%',
      top: '3%',
      width: 370,
      height: 370,
      zIndex: 1,
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 55%, rgba(60,30,120,0.55) 0%, rgba(10,5,30,0.85) 70%)',
      boxShadow: '0 0 60px rgba(124, 58, 237, 0.3), inset 0 0 40px rgba(80, 20, 180, 0.15)',
      border: '1px solid rgba(124, 58, 237, 0.25)',
    }}>
      {/* Sagittarius label */}
      <div style={{
        position: 'absolute',
        bottom: '14%',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(196, 170, 255, 0.7)',
        fontSize: '11px',
        fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        fontWeight: 500,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        ♐ Sagittarius
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[2, 3, 4]} intensity={0.4} color="#9d7aff" />
        <StarField />
        <SagittariusScene />
      </Canvas>
    </div>
  )
}
