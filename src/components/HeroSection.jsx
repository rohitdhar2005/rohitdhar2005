import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'
import PlanetCanvas from './PlanetCanvas'

const techIcons = [
  { name: 'C', bg: '#555555', color: '#fff', icon: 'C' },
  { name: 'Python', bg: '#3776ab', color: '#fff', icon: 'Py' },
  { name: 'JavaScript', bg: '#f7df1e', color: '#000', icon: 'JS' },
  { name: 'HTML', bg: '#e34f26', color: '#fff', icon: 'HTML' },
  { name: 'CSS', bg: '#1572b6', color: '#fff', icon: 'CSS' },
  { name: 'React', bg: '#20232a', color: '#61dafb', icon: '⚛' },
  { name: 'Node.js', bg: '#339933', color: '#fff', icon: 'Node' },
  { name: 'Express.js', bg: '#000000', color: '#fff', icon: 'Ex' },
  { name: 'MongoDB', bg: '#47a248', color: '#fff', icon: 'MDB' },
  { name: 'MySQL', bg: '#4479a1', color: '#fff', icon: 'SQL' },
  { name: 'AWS', bg: '#ff9900', color: '#fff', icon: 'AWS' },
  { name: 'OpenCV', bg: '#5c3ee8', color: '#fff', icon: 'CV' },
  { name: 'Machine Learning', bg: '#ec4899', color: '#fff', icon: 'ML' },
  { name: 'GitHub', bg: '#181717', color: '#fff', icon: 'Git' },
]

const ROLES = [
  'AI Engineer',
  'Problem Solver',
  'Student @ UEM Jaipur',
  'Chess Player',
  'Cricket Player',
  'Full Stack Developer',
]

export default function HeroSection({ recruiterMode }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Typewriter effect
  useEffect(() => {
    const role = ROLES[roleIdx]
    let timer
    if (!deleting) {
      if (displayed.length < role.length) {
        timer = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80)
      } else {
        timer = setTimeout(() => setDeleting(true), 2000)
      }
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
      } else {
        setDeleting(false)
        setRoleIdx((roleIdx + 1) % ROLES.length)
      }
    }
    return () => clearTimeout(timer)
  }, [displayed, deleting, roleIdx])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause() } else { audio.play() }
    setPlaying(!playing)
  }

  return (
    <section className={styles.hero} id="hero">
      <PlanetCanvas />

      <div className={styles.content}>
        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Hi, I'm{' '}
          <span className={styles.accent}>Rohit</span>
          <br />
          <span className={styles.role}>
            {displayed}
            <span className={styles.caret}>|</span>
          </span>
        </motion.h1>

        <motion.div
          className={styles.profile}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <div className={styles.avatarWrap}>
            <img src="/proflie.jpg" alt="Rohit Dhar" className={styles.avatar} />
          </div>
          <div className={styles.info}>
            <h2 className={styles.name}>Rohit Dhar</h2>
            <p className={styles.desc}>B.Tech CSE (AI/ML) Student, UEM Jaipur.</p>
            {recruiterMode && (
              <motion.div
                className={styles.recruiterInfo}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
              >
                <p>📧 rohit.dhar18@gmail.com</p>
                <p>📞 8100643899</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          className={styles.techRow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {techIcons.map((tech, i) => (
            <motion.div
              key={tech.name}
              className={styles.techBadge}
              style={{ background: tech.bg, color: tech.color }}
              whileHover={{ scale: 1.15, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.07 }}
              title={tech.name}
            >
              {tech.icon}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.musicWidget}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className={styles.musicNote}>{playing ? '🎶' : '🎵'}</span>
          <span className={styles.listeningTo}>Listening to</span>
          <audio ref={audioRef} src="/rasputin.mp3" preload="metadata" />
          <div className={styles.musicCard}>
            <div className={styles.musicIcon} style={playing ? { animation: 'spin 2s linear infinite' } : {}}>♪</div>
            <div className={styles.musicInfo}>
              <div className={styles.songName}>Rasputin</div>
              <div className={styles.artistName}>Boney M.</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className={styles.musicControls}>
              <span onClick={() => { if(audioRef.current) { audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10) } }} style={{ cursor: 'pointer' }}>⏮</span>
              <span className={styles.playBtn} onClick={togglePlay} style={{ cursor: 'pointer' }}>{playing ? '⏸' : '▶'}</span>
              <span onClick={() => { if(audioRef.current) { audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10) } }} style={{ cursor: 'pointer' }}>⏭</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
