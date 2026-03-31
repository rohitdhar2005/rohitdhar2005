import { useRef, useEffect } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const starsRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate stars
    const count = 200
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
    }))

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouse)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const dx = (mx - cx) / cx
      const dy = (my - cy) / cy

      starsRef.current.forEach((s) => {
        const px = s.x + dx * s.speed * 15
        const py = s.y + dy * s.speed * 15
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
