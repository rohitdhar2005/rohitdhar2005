import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './SkillsSection.module.css'

const CATS = [
  { label: 'Languages',  color: '#7c3aed', skills: ['C','Python','JavaScript','HTML','CSS'] },
  { label: 'Frameworks', color: '#0ea5e9', skills: ['React','Node.js','Express.js','OpenCV'] },
  { label: 'Databases',  color: '#10b981', skills: ['MongoDB','MySQL'] },
  { label: 'Dev Tools',  color: '#f59e0b', skills: ['AWS','GitHub','Postman','VS Code','Jupyter'] },
  { label: 'AI & Data',  color: '#ec4899', skills: ['ML','Data Analysis','Preprocessing','Deployment'] },
  { label: 'Platforms',  color: '#f97316', skills: ['LeetCode','Code360'] },
  { label: 'Soft Skills',color: '#6366f1', skills: ['Problem Solving','Teamwork','Communication','Adaptability'] },
]

export default function SkillsSection() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    bubbles: [],
    gravity: true,
    mouse: { x: -999, y: -999, dragIdx: -1, prevX: 0, prevY: 0 },
    running: true,
  })
  const [gravLabel, setGravLabel] = useState(true)

  // Build bubble array
  function makeBubbles(W, H, rain) {
    const arr = []
    let id = 0
    for (const cat of CATS) {
      for (const skill of cat.skills) {
        const r = Math.max(32, Math.min(48, skill.length * 4 + 18))
        arr.push({
          id: id++,
          x: r + 12 + Math.random() * Math.max(1, W - r * 2 - 24),
          y: rain
            ? -(r + Math.random() * 400)
            : r + 12 + Math.random() * Math.max(1, H - r * 2 - 24),
          vx: (Math.random() - 0.5) * 3,
          vy: rain ? 1 + Math.random() * 2 : (Math.random() - 0.5) * 3,
          r, skill, color: cat.color, cat: cat.label, dragging: false,
        })
      }
    }
    return arr
  }

  // Exposed actions via ref so buttons don't cause re-mount
  const actionsRef = useRef({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const st = stateRef.current
    st.running = true

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    st.bubbles = makeBubbles(canvas.width, canvas.height, true)

    // Actions
    actionsRef.current.rain = () => {
      st.bubbles = makeBubbles(canvas.width, canvas.height, true)
    }
    actionsRef.current.scatter = () => {
      for (const b of st.bubbles) {
        b.vx = (Math.random() - 0.5) * 24
        b.vy = (Math.random() - 0.5) * 24
      }
    }
    actionsRef.current.toggleGravity = () => {
      st.gravity = !st.gravity
      setGravLabel(st.gravity)
      if (!st.gravity) {
        for (const b of st.bubbles) { b.vx *= 0.3; b.vy *= 0.3 }
      }
    }

    // Mouse / touch
    function getXY(e) {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches ? e.touches[0] : e
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }

    function onPointerDown(e) {
      e.preventDefault()
      const { x, y } = getXY(e)
      const m = st.mouse
      m.x = x; m.y = y; m.prevX = x; m.prevY = y
      // Find topmost bubble under pointer
      for (let i = st.bubbles.length - 1; i >= 0; i--) {
        const b = st.bubbles[i]
        const dx = b.x - x, dy = b.y - y
        if (dx * dx + dy * dy < b.r * b.r) {
          m.dragIdx = i
          b.dragging = true
          return
        }
      }
      // Push wave on empty area
      for (const b of st.bubbles) {
        const dx = b.x - x, dy = b.y - y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0 && dist < 180) {
          const force = ((180 - dist) / 180) * 16
          b.vx += (dx / dist) * force
          b.vy += (dy / dist) * force
        }
      }
    }

    function onPointerMove(e) {
      const { x, y } = getXY(e)
      const m = st.mouse
      m.prevX = m.x; m.prevY = m.y
      m.x = x; m.y = y
      if (m.dragIdx >= 0) {
        const b = st.bubbles[m.dragIdx]
        if (b) {
          b.x = x; b.y = y
          b.vx = (x - m.prevX) * 0.9
          b.vy = (y - m.prevY) * 0.9
        }
      }
    }

    function onPointerUp() {
      const m = st.mouse
      if (m.dragIdx >= 0) {
        const b = st.bubbles[m.dragIdx]
        if (b) b.dragging = false
        m.dragIdx = -1
      }
    }

    canvas.addEventListener('mousedown', onPointerDown)
    canvas.addEventListener('mousemove', onPointerMove)
    canvas.addEventListener('mouseup', onPointerUp)
    canvas.addEventListener('mouseleave', onPointerUp)
    canvas.addEventListener('touchstart', onPointerDown, { passive: false })
    canvas.addEventListener('touchmove', onPointerMove, { passive: false })
    canvas.addEventListener('touchend', onPointerUp)
    window.addEventListener('resize', resize)

    // --- PHYSICS + RENDER LOOP ---
    const GRAVITY = 0.15
    const DAMP = 0.992
    const BOUNCE = 0.5
    const PAD = 12

    function tick() {
      if (!st.running) return
      const W = canvas.width, H = canvas.height
      const bubbles = st.bubbles
      const m = st.mouse

      ctx.clearRect(0, 0, W, H)

      // Physics
      for (const b of bubbles) {
        if (b.dragging) continue
        if (st.gravity) b.vy += GRAVITY
        b.vx *= DAMP
        b.vy *= DAMP
        b.x += b.vx
        b.y += b.vy

        // Wall bounce
        const minX = b.r + PAD, maxX = W - b.r - PAD
        const minY = b.r + PAD, maxY = H - b.r - PAD
        if (b.x < minX) { b.x = minX; b.vx = Math.abs(b.vx) * BOUNCE }
        if (b.x > maxX) { b.x = maxX; b.vx = -Math.abs(b.vx) * BOUNCE }
        if (b.y < minY) { b.y = minY; b.vy = Math.abs(b.vy) * BOUNCE }
        if (b.y > maxY) { b.y = maxY; b.vy = -Math.abs(b.vy) * BOUNCE }
      }

      // Collisions
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i], b = bubbles[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const distSq = dx * dx + dy * dy
          const minDist = a.r + b.r
          if (distSq < minDist * minDist && distSq > 0.01) {
            const dist = Math.sqrt(distSq)
            const nx = dx / dist, ny = dy / dist
            const overlap = minDist - dist
            if (!a.dragging) { a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5 }
            if (!b.dragging) { b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5 }
            const relV = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
            if (relV < 0) {
              const imp = relV * BOUNCE
              if (!a.dragging) { a.vx += imp * nx; a.vy += imp * ny }
              if (!b.dragging) { b.vx -= imp * nx; b.vy -= imp * ny }
            }
          }
        }
      }

      // Hover detection
      let hovIdx = -1
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]
        const dx = b.x - m.x, dy = b.y - m.y
        if (dx * dx + dy * dy < b.r * b.r) { hovIdx = i; break }
      }

      // Draw
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i]
        const hovered = i === hovIdx
        const scale = hovered ? 1.1 : 1
        const R = b.r * scale

        // Outer glow
        const glow = ctx.createRadialGradient(b.x, b.y, R * 0.3, b.x, b.y, R * 2)
        glow.addColorStop(0, b.color + '44')
        glow.addColorStop(1, b.color + '00')
        ctx.beginPath()
        ctx.arc(b.x, b.y, R * 2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Body gradient
        const body = ctx.createRadialGradient(b.x - R * 0.3, b.y - R * 0.3, R * 0.05, b.x, b.y, R)
        body.addColorStop(0, b.color + 'ee')
        body.addColorStop(1, b.color + '77')
        ctx.beginPath()
        ctx.arc(b.x, b.y, R, 0, Math.PI * 2)
        ctx.fillStyle = body
        ctx.fill()

        // Border
        ctx.strokeStyle = hovered ? '#ffffff' : (b.color + 'aa')
        ctx.lineWidth = hovered ? 2.5 : 1.2
        ctx.stroke()

        // Shine highlight
        const shine = ctx.createRadialGradient(b.x - R * 0.25, b.y - R * 0.35, 0, b.x, b.y - R * 0.15, R * 0.55)
        shine.addColorStop(0, 'rgba(255,255,255,0.3)')
        shine.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.arc(b.x, b.y, R, 0, Math.PI * 2)
        ctx.fillStyle = shine
        ctx.fill()

        // Label
        const fontSize = Math.max(9, Math.min(12, R * 0.36))
        ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = 'rgba(0,0,0,0.7)'
        ctx.shadowBlur = 4
        ctx.fillText(b.skill, b.x, b.y)
        ctx.shadowBlur = 0

        // Category tooltip on hover
        if (hovered) {
          ctx.font = '600 10px "JetBrains Mono", monospace'
          ctx.fillStyle = b.color
          ctx.fillText(b.cat, b.x, b.y - R - 10)
        }
      }

      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)

    return () => {
      st.running = false
      canvas.removeEventListener('mousedown', onPointerDown)
      canvas.removeEventListener('mousemove', onPointerMove)
      canvas.removeEventListener('mouseup', onPointerUp)
      canvas.removeEventListener('mouseleave', onPointerUp)
      canvas.removeEventListener('touchstart', onPointerDown)
      canvas.removeEventListener('touchmove', onPointerMove)
      canvas.removeEventListener('touchend', onPointerUp)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className={styles.section} id="skills">
      <motion.div className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Skills</h2>
          <div className={styles.controls}>
            <button className={styles.btn} onClick={() => actionsRef.current.rain?.()}>🌧 Rain</button>
            <button className={styles.btn} onClick={() => actionsRef.current.scatter?.()}>💥 Scatter</button>
            <button
              className={`${styles.btn} ${gravLabel ? styles.active : ''}`}
              onClick={() => actionsRef.current.toggleGravity?.()}
            >
              {gravLabel ? '🌍 Gravity ON' : '🌌 Float Mode'}
            </button>
          </div>
        </div>
        <p className={styles.subtitle}>drag to throw · click to push · scatter to explode</p>
      </motion.div>

      <div className={styles.wrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.hint}>🖱 Drag &amp; throw bubbles · Click empty space to push</div>
      </div>

      <div className={styles.legend}>
        {CATS.map(c => (
          <div key={c.label} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: c.color }} />
            <span className={styles.legendLabel}>{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
