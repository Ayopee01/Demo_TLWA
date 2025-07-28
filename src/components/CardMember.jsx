//Pass รอตรวจสอบเหมือนจะไม่ได้ใช้งาน
import React, { useRef } from "react";
import { FaRegEdit } from "react-icons/fa";

/**
 * แปลงวันที่เป็นรูปแบบไทย
 * @param {string} dateStr
 */
function formatDateThai(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * CardMember Component
 * @param {{
 *   memberData: object,
 *   onEdit: () => void,
 *   onClose: () => void
 * }} props
 */
export default function CardMember({ memberData, onEdit, onClose }) {
  const formRef = useRef(null);

  if (!memberData) return null;

  // สร้าง URL ของรูปโปรไฟล์ (ควรเก็บ url path ของไฟล์ไว้ใน memberData.profilePicUrl)
  const profilePicUrl = memberData.profilePicUrl
    ? (memberData.profilePicUrl.startsWith("http")
      ? memberData.profilePicUrl
      : `${import.meta.env.VITE_API_URL}${memberData.profilePicUrl}`)
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl"
      onMouseDown={e => {
        if (formRef.current && !formRef.current.contains(e.target)) {
          onClose && onClose();
        }
      }}
    >
      <div
        ref={formRef}
        className="relative bg-gradient-to-br from-indigo-100 to-blue-50 border border-indigo-200 shadow-2xl rounded-3xl w-[360px] max-w-[95vw] flex flex-col items-center p-0"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* ปุ่มปิด */}
        <button
          type="button"
          className="absolute top-3 right-5 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="ปิด"
        >
          ×
        </button>

        {/* ส่วนบน: รูปโปรไฟล์ + ชื่อ + วันเกิด */}
        <div className="w-full rounded-t-3xl px-7 pt-8 pb-2 flex flex-col items-center relative bg-white">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200 shadow mb-2 bg-gray-100 flex items-center justify-center">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-6xl text-gray-300">?</span>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Member ID: <b>{memberData.id || "N/A"}</b>
          </div>
          <div className="text-[18px] font-bold text-indigo-800 mb-1">
            {(memberData.prefixEn || "") + " " + memberData.firstNameEn + " " + memberData.lastNameEn + (memberData.suffixEn ? " " + memberData.suffixEn : "")}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Birthdate: </span>
            {formatDateThai(memberData.birthDate)}
          </div>
        </div>

        {/* ส่วนข้อมูลอื่น ๆ */}
        <div className="bg-indigo-50 w-full rounded-b-3xl px-7 py-4 flex flex-col gap-2 text-[15px] mt-[-4px]">
          <div>
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            <span className="text-gray-700">{memberData.address || "-"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Workplace:</span>{" "}
            <span className="text-gray-700">{memberData.workPlace || "-"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Position:</span>{" "}
            <span className="text-gray-700">{memberData.occupation || "-"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Phone:</span>{" "}
            <span className="text-gray-700">{memberData.phone || "-"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            <span className="text-gray-700">{memberData.email || "-"}</span>
          </div>
        </div>

        {/* ปุ่ม Edit Profile */}
        <button
          type="button"
          onClick={() => {
            if (typeof onEdit === "function") onEdit();
          }}
          className="mt-4 mb-5 flex items-center gap-2 py-2 px-7 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow transition-all"
        >
          <FaRegEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
}
