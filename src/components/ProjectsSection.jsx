import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ProjectsSection.module.css'

const projects = [
  {
    id: 'neogpt',
    name: 'NeoGPT',
    subtitle: 'Multilingual AI Chatbot',
    tech: ['React', 'Node.js', 'MongoDB', 'Groq LLM', 'Tavily API'],
    year: '2025',
    description: 'A multilingual conversational AI chatbot with persistent chat memory using Groq LLM and MongoDB. Implemented real-time web search via Tavily API with automatic tool invocation.',
    bullets: [
      'Persistent chat memory with MongoDB',
      'Real-time web search via Tavily API',
      'Thread-based conversations with URL routing',
      'In-memory caching with database fallback',
    ],
    github: 'https://github.com/rohitdhar2005',
    color: '#7c3aed',
  },
  {
    id: 'linkite',
    name: 'Linkite',
    subtitle: 'URL Shortener & Analytics Platform',
    tech: ['React', 'Node.js', 'MongoDB', 'JWT', 'REST API'],
    year: '2025',
    description: 'A full-stack URL shortener with QR generation, real-time analytics, and high-volume API support (10k+ links). JWT-based authentication with premium features.',
    bullets: [
      'QR generation & real-time analytics',
      'JWT-based authentication',
      'Click tracking dashboards',
      'Google Safe Browsing API integration',
    ],
    github: 'https://github.com/rohitdhar2005',
    color: '#0ea5e9',
  },
  {
    id: 'langtool',
    name: 'Language Translation Tool',
    subtitle: 'Python GUI App',
    tech: ['Python', 'Translation API', 'GUI'],
    year: '2024',
    description: 'A multi-language translation tool using Python and translation APIs with a GUI for fast and user-friendly translations.',
    bullets: [
      'Multi-language support',
      'User-friendly GUI interface',
      'Fast translation API integration',
    ],
    github: 'https://github.com/rohitdhar2005',
    color: '#059669',
  },
  {
    id: 'imgdetection',
    name: 'Image Detection System',
    subtitle: 'Computer Vision App',
    tech: ['Python', 'OpenCV', 'Image Processing'],
    year: '2024',
    description: 'An image detection model using OpenCV to identify and classify visual objects with real-time camera feed processing.',
    bullets: [
      'Object identification & classification',
      'Real-time camera feed processing',
      'Instant detection results',
    ],
    github: 'https://github.com/rohitdhar2005',
    color: '#f59e0b',
  },
]

export default function ProjectsSection() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a - 1 + projects.length) % projects.length)
  const next = () => setActive((a) => (a + 1) % projects.length)

  return (
    <section className={styles.section} id="projects">
      <h2 className="section-title">Projects</h2>

      <div className={styles.carousel}>
        {/* Stack of cards */}
        <div className={styles.stack}>
          {projects.map((p, i) => {
            const offset = (i - active + projects.length) % projects.length
            const isActive = offset === 0
            const isNext = offset === 1
            const isPrev = offset === projects.length - 1

            if (!isActive && !isNext && !isPrev) return null

            return (
              <motion.div
                key={p.id}
                className={styles.card}
                style={{ '--card-color': p.color }}
                animate={{
                  x: isActive ? 0 : isNext ? 80 : -80,
                  y: isActive ? 0 : 20,
                  scale: isActive ? 1 : 0.88,
                  zIndex: isActive ? 10 : 5,
                  rotateZ: isActive ? -2 : isNext ? 5 : -5,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => !isActive && (isNext ? next() : prev())}
              >
                <div className={styles.cardImageArea}>
                  <div className={styles.cardBg} style={{ background: `linear-gradient(135deg, ${p.color}33, #0d1117)` }}>
                    <div className={styles.codeLines}>
                      {[...Array(8)].map((_, li) => (
                        <div key={li} className={styles.codeLine} style={{ width: `${40 + Math.random() * 50}%`, opacity: 0.3 + li * 0.05 }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{p.name}</h3>
                  <p className={styles.cardDesc}>{p.description.slice(0, 120)}...</p>
                  <div className={styles.cardActions}>
                    <a href={p.github} target="_blank" rel="noreferrer" className={styles.visitBtn}>Visit</a>
                    <a href={p.github} target="_blank" rel="noreferrer" className={styles.githubBtn} aria-label="GitHub">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Nav buttons */}
        <div className={styles.navBtns}>
          <button className={styles.navBtn} onClick={prev}>←</button>
          <div className={styles.dots}>
            {projects.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ''}`} onClick={() => setActive(i)} />
            ))}
          </div>
          <button className={styles.navBtn} onClick={next}>→</button>
        </div>
      </div>
    </section>
  )
}
