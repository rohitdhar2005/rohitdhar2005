import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import StarField from './components/StarField'
import CustomCursor from './components/CustomCursor'
import RecruiterToggle from './components/RecruiterToggle'
import HeroSection from './components/HeroSection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'
import TimelineSection from './components/TimelineSection'
import HobbiesSection from './components/HobbiesSection'
import FooterSection from './components/FooterSection'
import './App.css'

export default function App() {
  const [recruiterMode, setRecruiterMode] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="app">
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <StarField />
      <CustomCursor />
      <RecruiterToggle recruiterMode={recruiterMode} setRecruiterMode={setRecruiterMode} />

      <main>
        <HeroSection recruiterMode={recruiterMode} />
        <SkillsSection />
        <ProjectsSection />
        <TimelineSection />
        <HobbiesSection />
        <FooterSection />
      </main>
    </div>
  )
}
