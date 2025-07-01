import React from 'react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-white border-t border-gray-300 py-6 px-20">
            <div className="flex justify-center items-center gap-12 pb-4">
                <a href="https://www.facebook.com/THAILANDTLWA" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 text-2xl">
                    <FaFacebookF />
                </a>
                <a href="https://www.instagram.com/tlwa.thailand?igsh=aWhvN2pvY2h1dmJj" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 text-2xl">
                    <FaInstagram />
                </a>
            </div>
            <hr className="border-gray-300" />
            <p className="text-center text-sm text-gray-500 mt-4">
                © 2025. All rights reserved by TLWA.
            </p>
        </footer>
    )
}

export default Footer