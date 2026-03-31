import { useState, useEffect, useRef } from 'react'
import styles from './LoadingScreen.module.css'

const LOADING_LINES = [
  '> initializing portfolio...',
  '> loading skills.js',
  '> compiling projects...',
  '> connecting constellations...',
  '> rohit.dhar.ready()',
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef(null)

  // Constellation animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    let running = true

    // Generate star positions
    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }))

    // A few constellation lines
    const conLines = []
    for (let i = 0; i < 12; i++) {
      const a = Math.floor(Math.random() * stars.length)
      let b = Math.floor(Math.random() * stars.length)
      while (b === a) b = Math.floor(Math.random() * stars.length)
      conLines.push([a, b])
    }

    function draw(t) {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Lines
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.12)'
      ctx.lineWidth = 0.8
      for (const [a, b] of conLines) {
        ctx.beginPath()
        ctx.moveTo(stars[a].x, stars[a].y)
        ctx.lineTo(stars[b].x, stars[b].y)
        ctx.stroke()
      }

      // Stars
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * twinkle, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196, 181, 253, ${0.4 + twinkle * 0.6})`
        ctx.fill()
      }

      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)

    return () => { running = false }
  }, [])

  // Progress + text lines
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 1.2 + Math.random() * 2.5
        if (next >= 100) {
          clearInterval(interval)
          return 100
        }
        return next
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const threshold = (lineIdx + 1) * (100 / LOADING_LINES.length)
    if (progress >= threshold && lineIdx < LOADING_LINES.length - 1) {
      setLineIdx(i => i + 1)
    }
  }, [progress, lineIdx])

  // Fade out when done
  useEffect(() => {
    if (progress >= 100) {
      const t1 = setTimeout(() => setFadeOut(true), 400)
      const t2 = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 1200)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [progress, onComplete])

  if (!visible) return null

  return (
    <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ''}`}>
      <canvas ref={canvasRef} className={styles.bgCanvas} />

      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <img src="/proflie.jpg" alt="Rohit Dhar" className={styles.logo} />
        </div>

        {/* Terminal lines */}
        <div className={styles.terminal}>
          {LOADING_LINES.slice(0, lineIdx + 1).map((line, i) => (
            <div
              key={i}
              className={`${styles.line} ${i === lineIdx ? styles.typing : ''}`}
            >
              {line}
              {i === lineIdx && <span className={styles.cursor}>▌</span>}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.barWrap}>
          <div className={styles.bar} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className={styles.percent}>{Math.min(Math.round(progress), 100)}%</div>
      </div>
    </div>
  )
}
