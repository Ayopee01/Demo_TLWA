// Pass
import React from 'react';
import advertImageXL from '/src/assets/advert/Advert-XL.jpg';
import advertImageMD from '/src/assets/advert/Advert-MD.jpg';
import advertImageTL from '/src/assets/advert/Advert-TL.jpg';
import advertImageSM from '/src/assets/advert/Advert-SM.jpg';
import advertImageMobile from '/src/assets/advert/Advert-Mobile.jpg';

function Advert({ onEnter }) {
  return (
    <div className="relative w-screen h-screen flex flex-col overflow-hidden bg-[#fcf6de]">
      {/* Responsive BG Image */}
      <picture>
        {/* เรียงจากจอใหญ่ -> จอเล็ก เพื่อลดการซ้อนทับ */}
        {/* ≥ 1500px (ประมาณ 2XL ขึ้นไป) */}
        <source srcSet={advertImageXL} media="(min-width: 1500px)" />
        {/* ≥ 1440px (ประมาณ XL/MD desktop) */}
        <source srcSet={advertImageMD} media="(min-width: 1440px)" />
        {/* ≥ 768px (Tablet) */}
        <source srcSet={advertImageTL} media="(min-width: 768px)" />
        {/* ≥ 390px (Mobile ปกติ) */}
        <source srcSet={advertImageMobile} media="(min-width: 390px)" />
        {/* < 390px (มือถือจอเล็กสุด) ใช้ SM เป็น fallback เพื่อลดความซ้ำซ้อนกับ Mobile */}
        <img
          src={advertImageSM}
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
