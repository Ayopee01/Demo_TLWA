import React from 'react'

//Components
import Navbar from './components/Navbar'
import About from './components/About'
import TeamList from './components/TeamList'
import Footer from './components/Footer';

function Page_About() {
    return (
        <>
            <Navbar />
            <About />
            <TeamList />
            <Footer />
        </>
    )
}

export default Page_About