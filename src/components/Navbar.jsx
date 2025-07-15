import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/logo/tlwa_logo.webp';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import MemberModal from './MemberModal';
import AccountModal from './AccountModal';
import { useUser } from "../contexts/UserContext";

function Navbar({ onLoginClick }) {
  const { user, logoutUser } = useUser();

  const [open, setOpen] = useState(false); // Mobile drawer
  const [dropdown, setDropdown] = useState(false); // Desktop user dropdown
  const [mobileUserDropdown, setMobileUserDropdown] = useState(false); // Mobile user dropdown
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const dropdownRef = useRef(null);

  // scrollIntoView
  const handleNavClick = (href) => (e) => {
    e.preventDefault();
    setOpen(false); // ถ้าใช้ Drawer
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ปิด dropdown (desktop) เมื่อคลิกข้างนอก
  useEffect(() => {
    if (!dropdown) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdown]);

  // ปิด user dropdown (mobile) เมื่อคลิกข้างนอก
  useEffect(() => {
    if (!mobileUserDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('.mobile-user-dropdown-btn') && !e.target.closest('.mobile-user-dropdown-popup')) {
        setMobileUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileUserDropdown]);

  // เมนูหลัก
  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Conference", href: "#conference" },
    { label: "Benefits", href: "#benefits" },
    { label: "News", href: "#news" },
    { label: "Media", href: "#media" },
    { label: "Partners", href: "#partners" },
    { label: "Rules and Regulations", href: "#rules" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow px-8 lg:px-16 xl:px-24">

      <div className="container mx-auto flex items-center justify-between h-30">
        {/* LOGO */}
        <Link to="/">
          <img className="h-full w-12 xl:w-15" src={logo} alt="Logo" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden xl:flex space-x-8 items-center p-8">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={handleNavClick(link.href)}
                className="relative font-medium text-gray-700 transition hover:text-indigo-500"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>


        {/* Desktop: Login/User */}
        <div className="hidden xl:flex items-center">
          {!user ? (
            <button
              className="relative overflow-hidden cursor-pointer font-medium bg-indigo-500 text-white h-15 w-25 rounded-xl transition-colors duration-600 hover:bg-indigo-600 group"
              onClick={onLoginClick}
            >
              <span className="relative w-full z-10">Log in</span>
            </button>
          ) : (
            <div ref={dropdownRef} className="relative flex items-center">
              <button
                className="flex items-center cursor-pointer gap-1 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition"
                onClick={() => setDropdown((d) => !d)}
                tabIndex={0}
              >
                <FaUserCircle className="text-2xl text-indigo-500" />
                <span className="font-medium text-indigo-900">{user.firstName} {user.lastName}</span>
                <FaChevronDown className="ml-1 text-indigo-500" />
              </button>
              {/* Dropdown */}
              {dropdown && (
                <div className="absolute right-0 top-12 mt-2 w-44 bg-white border rounded-xl shadow z-50">
                  <ul className="py-2 text-sm text-indigo-900">
                    <li>
                      <button
                        className="w-full text-left px-5 py-2 hover:bg-indigo-50"
                        onClick={() => { setDropdown(false); setShowMemberModal(true); }}
                      >
                        Member
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-5 py-2 hover:bg-indigo-50"
                        onClick={() => { setDropdown(false); setShowAccountModal(true); }}
                      >
                        Account
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500"
                        onClick={() => { setDropdown(false); logoutUser(); }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="cursor-pointer xl:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 focus:outline-none hover:bg-gray-700"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
            {open
              ? <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : (<>
                <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>)
            }
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black opacity-70 transition-opacity duration-300" onClick={() => setOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-2xl
        transition-transform duration-300 border-r border-gray-200
        flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4">
          <Link to="/">
            <img className="h-12 w-auto" src={logo} alt="Logo" />
          </Link>
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
            {navLinks.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={handleNavClick(link.href)}
                  className="relative font-medium text-gray-700 hover:text-indigo-500 px-5 py-3 block border-b border-indigo-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Mobile User Dropdown */}
          <div className='flex flex-col justify-center mt-4 relative'>
            {!user ? (
              <button
                className="relative overflow-hidden cursor-pointer font-medium bg-indigo-500 text-white px-8 py-2 rounded-xl transition-colors duration-600 hover:text-white group"
                onClick={() => { setOpen(false); onLoginClick(); }}
              >
                <span className="relative z-10">Log in</span>
              </button>
            ) : (
              <div className="relative w-full flex justify-center">
                <button
                  className="flex items-center cursor-pointer gap-2 w-full max-w-[240px] px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 mobile-user-dropdown-btn"
                  onClick={() => setMobileUserDropdown((d) => !d)}
                >
                  <FaUserCircle className="text-2xl text-indigo-500" />
                  <span className="font-medium text-indigo-900 truncate">{user.firstName} {user.lastName}</span>
                  <FaChevronDown className="ml-1 text-indigo-500" />
                </button>
                {/* Dropdown Popup เล็ก + อยู่ด้านบน + ขนาดพอดีเมนู */}
                {mobileUserDropdown && (
                  <div
                    className="
                      absolute
                      bottom-[110%] left-1/2
                      -translate-x-1/2
                      w-full max-w-[220px]
                      bg-white border rounded-xl shadow-lg z-50
                      flex flex-col items-stretch
                      mobile-user-dropdown-popup
                    "
                  >
                    <ul className="py-1 text-sm text-indigo-900">
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-indigo-50 rounded-t-xl"
                          onClick={() => {
                            setOpen(false);
                            setShowMemberModal(true);
                            setMobileUserDropdown(false);
                          }}
                        >
                          Member
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-indigo-50"
                          onClick={() => {
                            setOpen(false);
                            setShowAccountModal(true);
                            setMobileUserDropdown(false);
                          }}
                        >
                          Account
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 rounded-b-xl"
                          onClick={() => {
                            setOpen(false);
                            logoutUser();
                            setMobileUserDropdown(false);
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Popup Modals */}
      <MemberModal open={showMemberModal} onClose={() => setShowMemberModal(false)} />
      <AccountModal open={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </nav>
  );
}

export default Navbar;
