import React from 'react';
import advertImage from '../assets/advert/28 กรกฎาคม.jpg';
import advertImageMobile from '../assets/advert/28 กรกฎาคม Mobile.jpg';

function Advert({ onEnter }) {
  return (
    <div className="relative w-screen h-screen min-h-screen flex flex-col overflow-hidden bg-[#fcf6de]">
      {/* รูป BG เต็มจอแบบ Responsive */}
      <picture>
        {/* Mobile < md */}
        <source
          srcSet={advertImageMobile}
          media="(max-width: 767px)"
        />
        {/* Desktop >= md */}
        <img
          src={advertImage}
          alt="วันเฉลิมพระชนมพรรษา"
          className="absolute inset-0 w-full h-full object-cover object-top z-0 select-none pointer-events-none"
          draggable={false}
        />
      </picture>
      
      {/* Layer (Optional: ใส่ overlay ถ้าต้องการ softer หรือ gradient) */}
      {/* <div className="absolute inset-0 bg-[#fcf6de]/60 z-0"></div> */}

      {/* ปุ่มอยู่ล่างสุด (ซ้อนบน BG) */}
      <div className="relative z-10 w-full flex flex-1 flex-col justify-end items-center">
        {/* ตำแหน่งปุ่ม: ล่างสุดพอดี */}
        <div className="w-full flex justify-center pb-8">
          <button
            onClick={onEnter}
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-10 py-4 rounded-lg shadow-lg transition"
          >
            Enter Website
          </button>
        </div>
      </div>
    </div>
  );
}

export default Advert;
