import { motion } from 'framer-motion'
import styles from './FooterSection.module.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function SmallPlanet() {
  const meshRef = useRef()
  const ringRef = useRef()
  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (meshRef.current) meshRef.current.rotation.y = t * 0.2
    if (ringRef.current) ringRef.current.rotation.z = t * 0.06
  })
  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#c8a882" roughness={0.8} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.5, 0.14, 2, 60]} />
        <meshStandardMaterial color="#8a7565" roughness={0.9} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

export default function FooterSection() {
  const socials = [
    { name: 'GitHub', href: 'https://github.com/rohitdhar2005' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rohit-dhar18' },
    { name: 'Gmail', href: 'mailto:rohit.dhar18@gmail.com' },
  ]

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.planetWrap}>
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 4, 4]} intensity={1.2} color="#e8d8f8" />
          <pointLight position={[-2, -2, 2]} intensity={0.3} color="#7c3aed" />
          <SmallPlanet />
        </Canvas>
      </div>

      <div className={styles.socials}>
        {socials.map((s) => (
          <motion.a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            whileHover={{ y: -3 }}
          >
            {s.name}
          </motion.a>
        ))}
      </div>

      <motion.a
        href="/Rohit_Resume.pdf"
        download="Rohit_Dhar_Resume.pdf"
        className={styles.downloadBtn}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className={styles.dollar}>$</span>
        <span>./download_resume.sh</span>
      </motion.a>

      <p className={styles.hint}>Click to download my resume.*</p>

      <p className={styles.copy}>© 2025 Rohit Dhar. Built with React + Three.js + Framer Motion.</p>
    </footer>
  )
}
