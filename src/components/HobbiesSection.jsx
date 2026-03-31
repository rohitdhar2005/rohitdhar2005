import { motion } from 'framer-motion'
import styles from './HobbiesSection.module.css'

const hobbies = [
  {
    id: 'chess',
    title: 'Chess',
    desc: 'Love the strategy and deep thinking behind every move. Always up for a game.',
    emoji: '♟️',
    color: '#7c3aed',
  },
  {
    id: 'cricket',
    title: 'Cricket',
    desc: 'Passionate about cricket — whether playing on the field or watching intense matches.',
    emoji: '🏏',
    color: '#ef4444',
  },
  {
    id: 'music',
    title: 'Music',
    desc: 'Enjoy listening to classical and electronic music while coding. Beethoven is a favorite.',
    emoji: '🎵',
    color: '#0ea5e9',
  },
  {
    id: 'ai',
    title: 'AI Research',
    desc: 'Reading about the latest in LLMs, autonomous agents, and the future of AI.',
    emoji: '🤖',
    color: '#10b981',
  },
  {
    id: 'build',
    title: 'Building Projects',
    desc: 'Love turning ideas into real products — from MVPs to polished tools.',
    emoji: '⚡',
    color: '#f59e0b',
  },
]

export default function HobbiesSection() {
  return (
    <section className={styles.section} id="hobbies">
      <h2 className="section-title">Hobbies</h2>

      <div className={styles.cardStack}>
        {hobbies.map((h, i) => (
          <motion.div
            key={h.id}
            className={styles.card}
            style={{
              '--hobby-color': h.color,
              rotate: i % 2 === 0 ? -3 + i : 3 - i,
              zIndex: hobbies.length - i,
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            whileHover={{ rotate: 0, scale: 1.04, zIndex: 20 }}
          >
            <div className={styles.cardTop} style={{ background: `linear-gradient(135deg, ${h.color}40, ${h.color}10)` }}>
              <span className={styles.emoji}>{h.emoji}</span>
            </div>
            <div className={styles.cardBottom}>
              <h3 className={styles.cardTitle}>{h.title}</h3>
              <p className={styles.cardDesc}>{h.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
