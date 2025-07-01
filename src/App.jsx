import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import News from './components/News';
import Media from './components/Media';
import Partners from './components/Partners';
import RulesAndRegulations from './components/RulesAndRegulations';
import Contact from './components/Contact';
import Footer from './components/Footer';


import Editorial from './components/Editorial';
import LMWeek from './components/LMWeek';

import IBLM from './components/IBLM';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <News />
      <Media />
      <Partners />
      <RulesAndRegulations />
      <Contact />
      <Footer />

      {/* <Editorial /> */}
      {/* <LMWeek />
      <News />
      <IBLM />
       */}
    </>

  )

}

export default App
