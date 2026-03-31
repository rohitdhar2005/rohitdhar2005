import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const followerPos = useRef({ x: 0, y: 0 })
  const animRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.1
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.1
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPos.current.x - 20}px, ${followerPos.current.y - 20}px)`
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed', top: 0, left: 0, width: 8, height: 8,
        background: '#a855f7', borderRadius: '50%', pointerEvents: 'none',
        zIndex: 9999, transition: 'transform 0.05s linear',
      }} />
      <div ref={followerRef} style={{
        position: 'fixed', top: 0, left: 0, width: 40, height: 40,
        border: '1px solid rgba(168,85,247,0.5)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
      }} />
    </>
  )
}
