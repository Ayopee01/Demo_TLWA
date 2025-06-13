import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import LMWeek from './components/LMWeek';
import News from './components/News';
import IBLM from './components/IBLM';
import Contact from './components/Contact';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      {/* <LMWeek />
      <News />
      <IBLM />
      <Contact /> */}
    </>
  )
}

export default App
