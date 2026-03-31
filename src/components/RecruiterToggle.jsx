import { useState } from 'react'
import styles from './RecruiterToggle.module.css'

export default function RecruiterToggle({ recruiterMode, setRecruiterMode }) {
  return (
    <button
      className={styles.toggle}
      onClick={() => setRecruiterMode(!recruiterMode)}
      aria-label="Toggle recruiter mode"
    >
      <span className={styles.dot} style={{ background: recruiterMode ? '#22c55e' : '#6b7280' }} />
      <span className={styles.label}>Recruiter Mode: {recruiterMode ? 'On' : 'Off'}</span>
    </button>
  )
}
