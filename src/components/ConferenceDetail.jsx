import React, { useState } from "react";
import { useParams } from "react-router-dom";
// Import Context และ Modal/Popup ที่คุณมีจริง
import { useUser } from "../contexts/UserContext";
import MemberModal from "./MemberModal";
import PartnerModal from "./PartnerModal";
import LoginModal from "./LoginModal";

// นำเข้ารูปหรือข้อมูลจาก assets (ควรให้ array เดียวกับ ConferenceCatalog)
import img1 from "../assets/conference/งานสมาคม TMWTA + TLWA.jpg";
import img2 from "../assets/conference/The Health Professional Council of Lao PDR and Affiliated Institutions.jpg";
import img3 from "../assets/conference/หลักสูตร การประกอบอาหารเพื่อฟื้นฟูโรคเบาหวาน.jpg";
import img4 from "../assets/conference/LMW วิทยากร (ใหม่).jpg";

const items = [
  {
    image: img1,
    title: "Lifestyle Medicine Conference",
    description: "งานประชุมแพทย์วิถีชีวิตไทย ...",
  },
  {
    image: img2,
    title: "Health Professional Council of Lao PDR",
    description: "สภาวิชาชีพสุขภาพแห่ง สปป.ลาว ...",
  },
  {
    image: img3,
    title: "Diabetes Cooking Course",
    description: "หลักสูตรการประกอบอาหารเพื่อผู้ป่วยเบาหวาน ...",
  },
  {
    image: img4,
    title: "New LMW Speakers",
    description: "พบกับวิทยากรใหม่ของ LMW ...",
  },
];

function ConferenceDetail() {
  const { id } = useParams();
  const conf = items[Number(id)] || items[0]; // กัน error ถ้า id เพี้ยน
  const { user } = useUser();

  const [showLogin, setShowLogin] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [registered, setRegistered] = useState(false);

  // กรณี user (เช่น user.isMember, user.isPartner) อาจต้องเช็คค่าจาก backend/state
  const isMember = !!user?.isMember;
  const isPartner = !!user?.isPartner;

  const handleRegister = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!isMember && !isPartner) {
      setShowChoice(true);
      return;
    }
    // TODO: ส่งข้อมูลการลงทะเบียนเข้า SQL ผ่าน API
    // await api.post('/api/conference-register', { confId: id, userId: user.id });
    setRegistered(true);
    alert("ลงทะเบียนสำเร็จ! ขอบคุณที่เข้าร่วมงาน");
  };

  // ปิด modal ทุกชนิด
  const handleCloseAll = () => {
    setShowLogin(false);
    setShowChoice(false);
    setShowMember(false);
    setShowPartner(false);
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-10 px-2 flex flex-col items-center">
      {/* Navbar อยู่นอก component นี้ (App.jsx เป็นตัวแสดง) */}
      <div className="w-full max-w-xl mx-auto">
        {/* ภาพและหัวข้อประชุม */}
        <div className="flex flex-col items-center">
          <img
            src={conf.image}
            alt={conf.title}
            className="rounded-3xl shadow-xl mb-8 w-full max-w-[400px] h-auto object-contain"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-2 text-center">
            {conf.title}
          </h1>
          {conf.description && (
            <div className="text-base sm:text-lg text-gray-600 text-center mb-4">
              {conf.description}
            </div>
          )}
          {/* ปุ่มลงทะเบียน */}
          <button
            className={`mt-4 px-7 py-3 rounded-xl bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold shadow-md transition disabled:bg-gray-400`}
            onClick={handleRegister}
            disabled={registered}
          >
            {registered ? "ลงทะเบียนเรียบร้อยแล้ว" : "ลงทะเบียนเข้างาน"}
          </button>
        </div>
      </div>

      {/* ========== MODALS/POPUP ต่าง ๆ ========== */}
      {/* LoginModal */}
      {showLogin && (
        <LoginModal
          open={showLogin}
          onClose={handleCloseAll}
        />
      )}
      {/* ตัวเลือก Member/Partner */}
      {showChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl px-7 py-8 w-[90vw] max-w-xs text-center">
            <h2 className="text-xl font-bold mb-5">สมัครสมาชิกหรือพันธมิตร</h2>
            <button
              className="w-full mb-3 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-800"
              onClick={() => { setShowChoice(false); setShowMember(true); }}
            >
              สมัครสมาชิก (Member)
            </button>
            <button
              className="w-full py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-700"
              onClick={() => { setShowChoice(false); setShowPartner(true); }}
            >
              สมัครพันธมิตร (Partner)
            </button>
            <button
              className="w-full mt-4 text-gray-500 underline"
              onClick={handleCloseAll}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
      {/* Member Modal */}
      {showMember && (
        <MemberModal
          open={showMember}
          onClose={handleCloseAll}
        />
      )}
      {/* Partner Modal */}
      {showPartner && (
        <PartnerModal
          open={showPartner}
          onClose={handleCloseAll}
        />
      )}
    </div>
  );
}

export default ConferenceDetail;
