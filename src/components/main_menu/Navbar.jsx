// src/components/main_menu/Navbar.jsx

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import MemberSection from "../login/MemberSection";
import AccountModal from "../login/AccountModal";
import { useUser } from "../../contexts/UserContext";
import logo from "/src/assets/logo/tlwa_logo.webp";

const NAVBAR_HEIGHT = 100;
const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Conference", href: "#conference" },
  { label: "IBLM", href: "#iblm" },
  // { label: "Benefits", href: "#benefits" },
  { label: "News", href: "#news" },
  { label: "Media", href: "#media" },
  { label: "Partners", href: "#partners" },
  // { label: "Rules and Regulations", href: "#rules" },
  { label: "Contact", href: "#contact" },
];

// Track section active (เหมือนเดิม)
function useActiveSection(navLinks) {
  const [active, setActive] = useState(navLinks[0].href);
  useEffect(() => {
    const handleScroll = () => {
      let current = navLinks[0].href;
      for (let i = 0; i < navLinks.length; i++) {
        const sec = document.querySelector(navLinks[i].href);
        if (sec) {
          const top = sec.getBoundingClientRect().top;
          if (top <= NAVBAR_HEIGHT + 2) current = navLinks[i].href;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);
  return active;
}

function Navbar({ onLoginClick, onAccountClick }) {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileUserDropdown, setMobileUserDropdown] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const dropdownRef = useRef(null);
  const [hideNav, setHideNav] = useState(false);
  const prevScrollY = useRef(window.scrollY);

  // Hide nav on scroll (desktop)
  useEffect(() => { if (open) setHideNav(false); }, [open]);
  useEffect(() => {
    if (open) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current && currentScrollY > 100) setHideNav(true);
      else setHideNav(false);
      prevScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Dropdown outside click (desktop)
  useEffect(() => {
    if (!dropdown) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdown]);
  // Dropdown outside click (mobile)
  useEffect(() => {
    if (!mobileUserDropdown) return;
    const handleClick = (e) => {
      if (
        !e.target.closest(".mobile-user-dropdown-btn") &&
        !e.target.closest(".mobile-user-dropdown-popup")
      ) setMobileUserDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileUserDropdown]);

  const activeSection = useActiveSection(navLinks);

  // Scroll logic
  const handleNavClick = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") {
      navigate(`/${href}`);
    } else {
      setTimeout(() => {
        const section = document.querySelector(href);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 20);
    }
  };

  return (
    <>
      {/* Navbar (Top Bar) */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 ${hideNav ? "-translate-y-full" : "translate-y-0"}`}
        style={{ height: NAVBAR_HEIGHT }}
      >
        <div className="container mx-auto flex items-center justify-between h-25 px-4 xl:px-0">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img className="h-12 w-auto" src={logo} alt="Logo" />
          </Link>
          {/* Desktop Nav */}
          <ul className="hidden xl:flex space-x-8 items-center">
            {navLinks.map(link => (
              <li key={link.label} className="relative">
                <a
                  href={link.href}
                  onClick={handleNavClick(link.href)}
                  className={`
                    font-medium px-1 py-2 transition-colors duration-200
                    ${activeSection === link.href
                      ? "text-indigo-700"
                      : "text-gray-700 hover:text-indigo-500"}
                    group
                  `}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span
                    className={`
                      absolute left-0 -bottom-1 h-0.5 rounded bg-indigo-500 transition-all duration-300
                      ${activeSection === link.href
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:opacity-100 group-hover:w-full"}
                    `}
                    style={{
                      transitionProperty: "width, opacity"
                    }}
                  ></span>
                </a>
              </li>
            ))}
          </ul>
          {/* Desktop: Login/User */}
          <div className="hidden xl:flex items-center">
            {!user ? (
              <button
                className="cursor-pointer font-medium bg-indigo-500 text-white px-8 py-2 rounded-xl hover:bg-indigo-600 transition"
                onClick={onLoginClick}
              >
                Sign in
              </button>
            ) : (
              <div ref={dropdownRef} className="relative flex items-center">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition cursor-pointer"
                  onClick={() => setDropdown((d) => !d)}
                  tabIndex={0}
                >
                  <FaUserCircle className="text-2xl text-indigo-500" />
                  <span className="font-medium text-indigo-900">{user.firstName} {user.lastName}</span>
                  <FaChevronDown className="ml-1 text-indigo-500" />
                </button>
                {dropdown && (
                  <div className="absolute right-0 top-12 mt-2 w-44 bg-white border rounded-xl shadow z-50">
                    <ul className="py-2 text-sm text-indigo-900">
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-indigo-50 cursor-pointer"
                          onClick={() => { setDropdown(false); setShowMemberModal(true); }}
                        >
                          Member
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-indigo-50 cursor-pointer"
                          onClick={() => { setDropdown(false); setShowAccountModal(true); }}
                        >
                          Account
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
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
            className="xl:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 border border-gray-300 cursor-pointer focus:outline-none hover:bg-gray-300"
            aria-label="Toggle menu"
            onClick={() => setOpen(o => !o)}
          >
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24">
              <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-60 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer (Mobile Side Menu) */}
      <div
        className={`
          fixed left-0 top-[100px] z-[100] w-[83vw] max-w-xs
          bg-white shadow-2xl transition-transform duration-300 border-r border-gray-200
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          height: "calc(100dvh - 100px)", // <<-- รองรับมือถือ 100%
          minHeight: 420, // ไม่เตี้ยเกิน
          paddingBottom: "env(safe-area-inset-bottom, 24px)",
          maxHeight: "calc(100dvh - 100px)",
        }}
      >
        <nav className="flex flex-col h-full overflow-y-auto">
          <ul className="flex flex-col flex-grow">
            {navLinks.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={handleNavClick(link.href)}
                  className={`
                    flex items-center px-6 py-3 font-medium transition
                    ${activeSection === link.href
                      ? "text-indigo-700 bg-indigo-50 border-l-4 border-indigo-500"
                      : "text-gray-800 hover:bg-gray-100"}
                  `}
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: activeSection === link.href ? "#6366F1" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* ปุ่ม Log in/User อยู่ล่างสุดจริง 100% */}
          <div className="mt-auto mb-6 px-6">
            {!user ? (
              <button
                className="w-full cursor-pointer font-medium bg-indigo-500 text-white px-8 py-2 rounded-xl hover:bg-indigo-600 transition"
                onClick={() => { setOpen(false); onLoginClick(); }}
                style={{
                  minHeight: 48,
                  marginBottom: "env(safe-area-inset-bottom, 12px)",
                }}
              >
                Log in
              </button>
            ) : (
              <div className="relative w-full flex justify-center">
                <button
                  className="flex items-center gap-2 w-full max-w-[220px] px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 mobile-user-dropdown-btn cursor-pointer"
                  onClick={() => setMobileUserDropdown((d) => !d)}
                >
                  <FaUserCircle className="text-2xl text-indigo-500" />
                  <span className="font-medium text-indigo-900 truncate">{user.firstName} {user.lastName}</span>
                  <FaChevronDown className="ml-1 text-indigo-500" />
                </button>
                {mobileUserDropdown && (
                  <div
                    className="
                      absolute bottom-[110%] left-1/2
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
                          className="w-full text-left px-5 py-2 hover:bg-indigo-50 rounded-t-xl cursor-pointer"
                          onClick={() => {
                            setOpen(false); setShowMemberModal(true); setMobileUserDropdown(false);
                          }}
                        >
                          Member
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-indigo-50 cursor-pointer"
                          onClick={() => {
                            setOpen(false); setShowAccountModal(true); setMobileUserDropdown(false);
                          }}
                        >
                          Account
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-5 py-2 hover:bg-red-50 text-red-500 rounded-b-xl cursor-pointer"
                          onClick={() => {
                            setOpen(false); logoutUser(); setMobileUserDropdown(false);
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
      <MemberSection open={showMemberModal} onClose={() => setShowMemberModal(false)} />
      <AccountModal open={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </>
  );
}

export default Navbar;
