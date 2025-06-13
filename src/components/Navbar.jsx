import React, { useState } from 'react'
import logo from '../assets/logo/tlwa_logo.webp'

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow px-8 lg:px-16 xl:px-24">
      <div className="container mx-auto flex items-center justify-between h-30">
        {/* LOGO */}
        <a href="#">
          <img className='h-full w-12 xl:w-15' src={logo} alt="Logo" />
        </a>

        {/* Desktop menu */}
        <ul className="hidden xl:flex space-x-8 flex-wrap items-center justify-center p-8 gap-y-4">
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Home</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Benefits</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Sister Organizations</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">LM Week</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Commitee</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Media</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Editorial</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">IBLM</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Rules and Regulations</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">About Us</a></li>
          <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 after:w-0 after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-600 hover:after:w-full after:absolute after:left-0 after:-bottom-2">Contact</a></li>
        </ul>
        <button className="hidden xl:block relative overflow-hidden cursor-pointer font-medium bg-indigo-500 text-white h-15 w-25 rounded-xl transition-colors duration-600 hover:text-white group">
          <span
            className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700 scale-0 group-hover:scale-150 transition-transform duration-700 ease-out z-0"
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
          />
          <span className="relative w-full z-10">Log in</span>
        </button>

        {/* Hamburger */}
        <button
          className="cursor-pointer xl:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 focus:outline-none hover:bg-gray-700"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
            {open ? (
              // X Icon
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <>
                {/* เส้นบน */}
                <line
                  x1={isHovered ? "12" : "6"}
                  y1="8"
                  x2="18"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ transition: "all 0.9s cubic-bezier(.4,0,.2,1)" }}
                />
                {/* เส้นกลาง */}
                <line
                  x1="6"
                  y1="12"
                  x2="18"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ transition: "all 0.9s cubic-bezier(.4,0,.2,1)" }}
                />
                {/* เส้นล่าง */}
                <line
                  x1={isHovered ? "6" : "12"}
                  y1="16"
                  x2="18"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ transition: "all 0.9s cubic-bezier(.4,0,.2,1)" }}
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black opacity-70 transition-opacity duration-300
        ${open ? "block" : "hidden"}`}
        onClick={() => setOpen(false)}
      />

      {/* Side Drawer */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-2xl
        transition-transform duration-300 border-r border-gray-200
        flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4">
          <a href="#">
            <img className="h-12 w-auto" src={logo} alt="Logo" />
          </a>
          {/* Close button */}
          <button
            className="cursor-pointer border border-gray-400 rounded-lg p-1.5 text-gray-800 hover:bg-gray-100 transition"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col justify-between h-full p-4">
          <ul className="flex flex-col mt-1 flex-1">
            {/* ใช้ ul > li > a เดิมทุกอย่าง */}
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Home</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Benefits</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Sister Organizations</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">LM Week</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Commitee</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Media</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Editorial</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">IBLM</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Rules and Regulations</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">About Us</a></li>
            <li><a href="#" className="relative font-medium text-gray-700 transition hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100">Contact</a></li>
          </ul>
          <div className='flex justify-center mt-4'>
            <button className="relative overflow-hidden cursor-pointer font-medium bg-indigo-500 text-white px-8 py-2 rounded-xl transition-colors duration-600 hover:text-white group">
              <span
                className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700 scale-0 group-hover:scale-150 transition-transform duration-700 ease-out z-0"
                style={{ pointerEvents: 'none' }}
                aria-hidden="true"
              />
              <span className="relative z-10">Log in</span>
            </button>
          </div>
        </nav>
      </div>
    </nav>
  )
}

export default Navbar
