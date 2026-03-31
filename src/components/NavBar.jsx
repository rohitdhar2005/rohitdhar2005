import { motion } from 'framer-motion'
import styles from './NavBar.module.css'

const navLinks = [
  { label: 'About', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Hobbies', href: '#hobbies' },
  { label: 'Contact', href: '#contact' },
]

export default function NavBar() {
  return (
    <motion.nav
      className={styles.nav}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <a href="#hero" className={styles.logoLink}>
        <img src="/prolfiex.png" alt="RD Logo" className={styles.logo} />
      </a>

      <ul className={styles.links}>
        {navLinks.map((link) => (
          <motion.li key={link.label} whileHover={{ y: -2 }}>
            <a href={link.href} className={styles.link}>
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}
