//Pass
import React from 'react';
import advertImageXL from '../assets/advert/28 กรกฎาคม XL.jpg';
import advertImageMD from '../assets/advert/28 กรกฎาคม MD.jpg';
import advertImageSM from '../assets/advert/28 กรกฎาคม SM.jpg';
import advertImageMobile from '../assets/advert/28 กรกฎาคม Mobile.jpg';

function Advert({ onEnter }) {
  return (
    <div className="relative w-screen h-screen min-h-screen flex flex-col overflow-hidden bg-[#fcf6de]">
      {/* Responsive BG Image */}
      <picture>
        {/* 2XL, XL screens */}
        <source
          srcSet={advertImageXL}
          media="(min-width: 1280px)" // Tailwind xl = 1280px, 2xl = 1536px+
        />
        {/* Desktop (default) */}
        <source
          srcSet={advertImageMD}
          media="(min-width: 768px)" // md = 768px up, but lower than 1280px
        />
        {/* Desktop (default) */}
        <source
          srcSet={advertImageSM}
          media="(min-width: 640px)" // sm = 640px up, but lower than 1280px
        />
        {/* Mobile */}
        <img
          src={advertImageMobile}
          alt="วันเฉลิมพระชนมพรรษา"
          className="absolute inset-0 w-full h-full object-cover object-top z-0 select-none pointer-events-none"
          draggable={false}
        />
      </picture>

      {/* ปุ่มด้านล่าง */}
      <div className="absolute bottom-0 left-0 w-full h-[20%] flex items-center justify-center z-10">
        <button
          onClick={onEnter}
          className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-10 py-4 rounded-lg shadow-lg transition"
        >
          Enter Website
        </button>
      </div>
    </div>
  );
}

export default Advert;
