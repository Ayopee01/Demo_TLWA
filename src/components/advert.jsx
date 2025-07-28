import React from 'react';
import advertImage from '../assets/advert/28 กรกฎาคม.png';

function Advert({ onEnter }) {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-end items-center"
      style={{
        backgroundImage: `url(${advertImage})`,
        backgroundSize: 'contain',        // Fit ภาพเต็มจอโดยไม่ถูก crop
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fcf6de',       // สีพื้นหลังโทนทองอ่อน (สำหรับส่วนที่เกิน)
        minHeight: '100vh',
      }}
    >
      {/* overlay option: ถ้าอยากให้เห็นปุ่มเด่น/ใส่ก็ได้ ไม่ใส่ก็ได้ */}
      {/* <div className="absolute inset-0 bg-yellow-100/50"></div> */}

      {/* ปุ่มอยู่ล่าง */}
      <div className="relative z-10 w-full flex justify-center pb-12">
        <button
          onClick={onEnter}
          className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-10 py-4 rounded-lg shadow-lg transition"
        >
          Enter Website
        </button>
      </div>
    </div>
  );
}

export default Advert;
