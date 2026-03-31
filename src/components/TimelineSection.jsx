import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './TimelineSection.module.css'

const projects = [
  {
    id: 'NeoGPT',
    snapshot: {
      title: 'NeoGPT Impact Snapshot',
      desc: 'A multilingual AI chatbot helping users get instant, accurate responses in multiple languages.',
      tags: ['Multilingual support', 'Chat memory', 'Real-time web search'],
    },
    next: [
      'Add voice interaction and speech-to-text',
      'Expand to 20+ language models',
      'Build browser extension for inline chat',
    ],
    milestones: [
      { title: 'NeoGPT — MVP Launch', desc: 'Built core chatbot with Groq LLM, MongoDB memory, and Tavily search.' },
      { title: 'NeoGPT — Multi-threading & UX', desc: 'Added thread-based routing, history sync, and responsive UI polish.' },
    ],
  },
  {
    id: 'Linkite',
    snapshot: {
      title: 'Linkite Impact Snapshot',
      desc: 'A URL shortener and analytics platform supporting 10k+ links with real-time insights.',
      tags: ['High-volume API', 'JWT auth', 'QR Generation'],
    },
    next: [
      'Add custom branded domains',
      'Bulk link import from CSV',
      'Advanced click geo-analytics',
    ],
    milestones: [
      { title: 'Linkite — MVP Launch', desc: 'Built core URL shortener with QR generation and basic analytics.' },
      { title: 'Linkite — Analytics Dashboard', desc: 'Added click tracking, user activity dashboard, and JWT premium tiers.' },
    ],
  },
  {
    id: 'Lang Tool',
    snapshot: {
      title: 'Language Tool Impact Snapshot',
      desc: 'A Python-based translation tool with GUI for fast multi-language translation.',
      tags: ['Multi-language', 'GUI interface', 'Offline-friendly'],
    },
    next: [
      'Add speech-to-text input',
      'Support offline translation models',
      'Package as desktop app',
    ],
    milestones: [
      { title: 'Lang Tool — Initial Build', desc: 'Connected translation APIs and built basic Python CLI.' },
      { title: 'Lang Tool — GUI Release', desc: 'Added a user-friendly GUI for broader accessibility.' },
    ],
  },
]

export default function TimelineSection() {
  const [active, setActive] = useState(0)
  const p = projects[active]

  return (
    <section className={styles.section} id="timeline">
      <h2 className="section-title">Build Timeline</h2>

      <div className={styles.tabs}>
        {projects.map((proj, i) => (
          <button
            key={proj.id}
            className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
            onClick={() => setActive(i)}
          >
            {proj.id}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.id}
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {/* Impact Snapshot */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{p.snapshot.title}</h3>
            <p className={styles.cardDesc}>{p.snapshot.desc}</p>
            <div className={styles.tags}>
              {p.snapshot.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>

            <div className={styles.divider} />

            <h4 className={styles.subheading}>What I'd Build Next</h4>
            <ul className={styles.list}>
              {p.next.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* Milestones */}
          <div className={styles.milestones}>
            {p.milestones.map((m, i) => (
              <div key={i} className={styles.milestone}>
                <div className={styles.milestoneDot} />
                <div className={styles.milestoneCard}>
                  <h4 className={styles.milestoneTitle}>{m.title}</h4>
                  <p className={styles.milestoneDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
