import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiX,
  FiSearch,
  FiArrowLeft,
  FiClock,
  FiUsers,
  FiTag,
  FiCheck,
} from "react-icons/fi";
import Navbar from "./Navbar";
import OrganizationDropdown from "./OrganizationDropdown";
import { ORG_OPTIONS } from "../constants/orgs";

const API_URL = import.meta.env.VITE_API_URL || "";

const MEMBER_OPTIONS = [
  {
    key: "tlwa",
    label: "สมาชิกสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย (TLWA)",
    input: {
      placeholder: "ระบุเลขสมาชิก 4 หลัก (ตัวอย่าง: 0001)",
      type: "number",
      maxLength: 4,
    },
  },
  {
    key: "dietitian",
    label: "สมาชิกสมาคมนักกำหนดอาหารแห่งประเทศไทย",
    input: { placeholder: "ระบุชื่อสมาคม/หน่วยงานของคุณ", type: "text" },
  },
  {
    key: "tlwa_partner",
    label: "องค์กรพันธมิตรสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย (TLWA)",
    input: { placeholder: "ค้นหาองค์กร...", type: "dropdown" },
  },
  {
    key: "dietitian_partner",
    label: "องค์กรพันธมิตรสมาคมนักกำหนดอาหารแห่งประเทศไทย",
    input: { placeholder: "กรอกชื่อองค์กร", type: "text" },
  },
  { key: "none", label: "ไม่ได้เป็นสมาชิกหรือองค์กรพันธมิตรใดเลย" },
];

const MEMBER_KEYS = MEMBER_OPTIONS.slice(0, 4).map((o) => o.key);

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CourseDetail({ setModal }) {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [memberTypes, setMemberTypes] = useState([]);
  const [inputByMemberType, setInputByMemberType] = useState({});
  const [inputError, setInputError] = useState({});
  const [popupImg, setPopupImg] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    setError("");
    if (!typeId) {
      setCourseList([]);
      setLoading(false);
      setError("ไม่พบประเภทคอร์ส (typeId)");
      return;
    }
    setLoading(true);
    axios
      .get(`${API_URL}/api/courses_card/by_type/${typeId}`)
      .then((res) => setCourseList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("ไม่สามารถโหลดข้อมูลคอร์สได้"))
      .finally(() => setLoading(false));
  }, [typeId]);

  useEffect(() => {
    let newError = {};
    if (memberTypes.includes("tlwa")) {
      newError.tlwa = /^[0-9]{4}$/.test(inputByMemberType.tlwa || "")
        ? ""
        : "กรุณาระบุเลขสมาชิก 4 หลัก (ตัวอย่าง: 0001)";
    }
    setInputError(newError);
  }, [memberTypes, inputByMemberType]);

  const handleMemberTypeChange = (key) => {
    if (key === "none") {
      setMemberTypes(["none"]);
      setInputError({});
    } else {
      setMemberTypes((prev) => {
        const filtered = prev.filter((k) => k !== "none");
        return prev.includes(key)
          ? filtered.filter((k) => k !== key)
          : [...filtered, key];
      });
    }
  };

  const handleCourseSelect = (id, e) => {
    if (e.target.closest(".img-popup")) return;
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleMemberTypeInput = (key, value) => {
    setInputByMemberType((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const courseCount = selectedCourses.length;
  const isNoneMember = memberTypes.includes("none");
  const isAnyMember = memberTypes.some((t) => MEMBER_KEYS.includes(t));
  const selectedCourseObjs = selectedCourses
    .map((cid) => courseList.find((c) => c.id === cid))
    .filter(Boolean)
    .sort((a, b) => (a.id > b.id ? 1 : -1));

  const totalCoursePrice = selectedCourseObjs.reduce(
    (sum, c) => sum + (Number(c.price) || 0),
    0
  );

  let totalDiscount = 0;
  if (isAnyMember && courseCount === 3) {
    totalDiscount = totalCoursePrice * 0.3;
  } else if (isAnyMember && (courseCount === 1 || courseCount === 2)) {
    totalDiscount = totalCoursePrice * 0.25;
  } else if (isNoneMember && courseCount === 3) {
    totalDiscount = totalCoursePrice * 0.2;
  }

  const handleRegister = async () => {
    if (!user?.id) {
      setModal && setModal("login");
      return;
    }
    if (selectedCourses.length === 0) {
      setError("กรุณาเลือกคอร์สอย่างน้อย 1 คอร์ส");
      return;
    }
    if (memberTypes.length === 0) {
      setError("กรุณาเลือกสถานะสมาชิก/องค์กรอย่างน้อย 1 รายการ");
      return;
    }
    if (
      memberTypes.includes("tlwa") &&
      !/^[0-9]{4}$/.test(inputByMemberType.tlwa || "")
    ) {
      setInputError({
        ...inputError,
        tlwa: "กรุณาระบุเลขสมาชิก 4 หลัก (ตัวอย่าง: 0001)",
      });
      return;
    }
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_URL}/api/course_registrations`, {
        user_id: user.id,
        course_ids: selectedCourses,
        member_types: memberTypes,
        member_input: inputByMemberType,
        total_price: totalCoursePrice,
        total_discount: totalDiscount,
      });
      setSuccess("สมัครเรียนสำเร็จ!");
    } catch (e) {
      setError(e?.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
    }
  };

  const handleShowImg = (imgUrl) => setPopupImg(imgUrl);
  const handleCloseImg = () => setPopupImg(null);

  const mainTitle =
    courseList.length > 0
      ? courseList[0].type_name || courseList[0].title || "สมัครคอร์สอบรม"
      : "สมัครคอร์สอบรม";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#e5eafe] pt-24 sm:pt-28 relative overflow-x-hidden">
      <Navbar
        onLoginClick={() => setModal && setModal("login")}
        onAccountClick={() => setModal && setModal("account")}
      />
      {/* Gradient Blobs background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-blue-200 rounded-full blur-3xl top-0 left-0 opacity-30 animate-pulse"></div>
        <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-fuchsia-300 rounded-full blur-3xl bottom-0 right-0 opacity-20 animate-pulse delay-300"></div>
      </div>
      <div className="max-w-7xl mx-auto pt-4 pb-20 px-2 sm:pt-6 sm:pb-24 sm:px-4">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center mb-4 sm:mb-10 mt-2">
          <button
            className="text-xs sm:text-base text-blue-600 hover:bg-blue-100/70 transition rounded-xl px-2 py-1 sm:px-3 sm:py-2 flex items-center font-medium shadow border border-blue-100"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft className="mr-1 sm:mr-2" />
            ย้อนกลับ
          </button>
          <span className="mx-1 sm:mx-3 text-gray-300 text-base sm:text-xl select-none">|</span>
          <span className="font-bold text-transparent bg-gradient-to-r from-blue-800 via-purple-700 to-fuchsia-700 bg-clip-text text-base sm:text-xl drop-shadow line-clamp-1 max-w-[180px] sm:max-w-none">
            {mainTitle}
          </span>
        </div>
        {/* Main */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-10">
          {/* Left: Course Cards */}
          <div className="flex-1 min-w-0 px-2 sm:px-20 md:px-10">
            <div className="bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100/40 p-2 sm:p-6 mb-6 sm:mb-8 backdrop-blur-md">
              <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8 justify-between">
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <div className="w-1.5 h-8 sm:w-2 sm:h-10 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-700 rounded-full shadow-lg"></div>
                    <h2 className="text-base sm:text-2xl font-extrabold bg-gradient-to-r from-blue-800 to-fuchsia-700 bg-clip-text text-transparent tracking-wide">เลือกคอร์สที่ต้องการสมัคร</h2>
                  </div>
                  <p className="pl-4 text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">เลือกได้มากกว่า 1 คอร์สเพื่อรับส่วนลดพิเศษ</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-blue-200/50 shadow-sm whitespace-nowrap">
                    {selectedCourses.length} / {courseList.length} คอร์ส
                  </span>
                </div>
              </div>
              {loading && (
                <div className="flex flex-col items-center justify-center py-10 sm:py-16 gap-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-7 w-7 sm:h-10 sm:w-10 border-4 border-blue-200 border-t-blue-500"></div>
                  </div>
                  <span className="text-xs sm:text-base text-gray-600 font-semibold">กำลังโหลดข้อมูล...</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50/80 border border-red-200/80 rounded-lg sm:rounded-xl p-2 sm:p-4 mb-4 sm:mb-8 shadow-md">
                  <div className="text-red-700 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                    <FiX className="text-base sm:text-lg" /> {error}
                  </div>
                </div>
              )}
              <div className="px- grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-7">
                {courseList
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map((card, i) => (
                    <div
                      key={card.id}
                      className={`group relative border rounded-xl sm:rounded-2xl overflow-hidden bg-white/95 backdrop-blur-lg transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl
                        ${selectedCourses.includes(card.id)
                          ? "border-blue-500 ring-2 ring-blue-100/40 shadow-blue-200"
                          : "border-gray-200/80 hover:border-blue-300/60"
                        }`}
                      onClick={(e) => handleCourseSelect(card.id, e)}
                      tabIndex={0}
                    >
                      {/* Checkbox */}
                      <div className="absolute left-3 top-3 sm:left-4 sm:top-4 z-20">
                        <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center shadow transition-all duration-200
                          ${selectedCourses.includes(card.id)
                            ? "bg-gradient-to-tr from-blue-500 to-fuchsia-500 border-blue-400 scale-105 sm:scale-110"
                            : "bg-white border-gray-300"
                          }`}>
                          {selectedCourses.includes(card.id) && (
                            <FiCheck className="text-white animate-bounce text-base sm:text-lg" />
                          )}
                        </div>
                      </div>
                      {/* NEW Badge */}
                      {card.is_new && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                          <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg animate-pulse">ใหม่!</span>
                        </div>
                      )}
                      {/* Card Image */}
                      <div
                        className="relative img-popup h-50 sm:h-48 lg:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-zoom-in group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowImg(
                            card.card_image?.startsWith("/uploads")
                              ? `${API_URL}${card.card_image}`
                              : card.card_image || "/placeholder.webp"
                          );
                        }}
                      >
                        <img
                          src={
                            card.card_image?.startsWith("/uploads")
                              ? `${API_URL}${card.card_image}`
                              : card.card_image || "/placeholder.webp"
                          }
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-700"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                            <div className="bg-white/95 backdrop-blur-md rounded-full p-2 sm:p-3 shadow-2xl">
                              <FiSearch size={16} className="sm:text-[22px] text-blue-700" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Card Content */}
                      <div className="p-3 sm:p-6">
                        <h3 className="font-bold text-sm sm:text-xl text-blue-900 mb-1 sm:mb-2 truncate">{card.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2">
                          {card.detail}
                        </p>
                        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-5">
                          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 bg-gray-50/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
                            <FiClock size={13} className="sm:text-[15px] text-blue-500" />
                            <span className="font-medium">
                              {formatDate(card.start_date)} - {formatDate(card.end_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 bg-gray-50/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
                            <FiUsers size={13} className="sm:text-[15px] text-green-600" />
                            <span className="font-medium">
                              รับจำนวน: {card.max_participants ? `${card.max_participants} คน` : "ไม่จำกัด"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 bg-gray-50/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
                            <FiTag size={13} className="sm:text-[15px] text-purple-600" />
                            <span className="font-medium truncate max-w-[140px] sm:max-w-none">ประเภท: {card.type_name || "-"}</span>
                          </div>
                        </div>
                        <div className="flex justify-end items-center pt-2 sm:pt-4 border-t border-gray-100">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-green-200/60">
                            <span className="text-lg sm:text-2xl font-bold text-blue-600">
                              {card.price ? Number(card.price).toLocaleString() : "-"}
                            </span>
                            <span className="text-xs sm:text-sm text-blue-600 font-semibold ml-1 sm:ml-2">บาท</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {!loading && courseList.length === 0 && (
                <div className="text-center py-8 sm:py-16">
                  <div className="text-gray-400 text-sm sm:text-lg mb-2">ไม่พบคอร์สในประเภทนี้</div>
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto"></div>
                </div>
              )}
            </div>
          </div>
          {/* Right: Member Types + Summary */}
          <div className="w-full lg:w-[440px] flex-shrink-0 space-y-5 sm:space-y-9">
            {/* Member Types */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-green-100/60 p-3 sm:p-7">
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full shadow-lg"></div>
                <h2 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-green-700 to-fuchsia-700 bg-clip-text text-transparent">
                  ระบุสถานะสมาชิก/องค์กร
                </h2>
                <span className="text-[10px] sm:text-xs text-gray-500 bg-gradient-to-r from-green-50 to-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-xl shadow border border-green-200/40 ml-1 sm:ml-2 font-medium">
                  เลือกอย่างน้อย 1 รายการ
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {MEMBER_OPTIONS.map((opt) => (
                  <div
                    key={opt.key}
                    className={`border rounded-xl sm:border-2 sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-4 transition-all duration-200 cursor-pointer hover:shadow-md
                      ${memberTypes.includes(opt.key)
                        ? "border-green-300 bg-gradient-to-r from-green-50/80 to-fuchsia-50/80 shadow-md"
                        : "border-gray-200/80 hover:border-green-200 bg-white/50"
                      }`}
                  >
                    <label className="flex items-start gap-2 sm:gap-4 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={memberTypes.includes(opt.key)}
                        onChange={() => handleMemberTypeChange(opt.key)}
                        className="w-4 h-4 sm:w-6 sm:h-6 accent-green-600 mt-0.5 sm:mt-1 rounded-xl shadow"
                        disabled={
                          opt.key === "none" &&
                          memberTypes.length > 0 &&
                          !memberTypes.includes("none")
                        }
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-xs sm:text-sm text-gray-800 leading-relaxed block">
                          {opt.label}
                        </span>
                        {memberTypes.includes(opt.key) && opt.input && opt.input.type === "dropdown" && (
                          <div className="mt-1.5 sm:mt-3">
                            <OrganizationDropdown
                              options={ORG_OPTIONS}
                              value={inputByMemberType[opt.key] || ""}
                              onChange={(val) => handleMemberTypeInput(opt.key, val)}
                              placeholder={opt.input.placeholder}
                            />
                          </div>
                        )}
                        {memberTypes.includes(opt.key) && opt.input && opt.input.type !== "dropdown" && (
                          <div className="mt-1.5 sm:mt-3">
                            <input
                              type={opt.input.type}
                              placeholder={opt.input.placeholder}
                              value={inputByMemberType[opt.key] || ""}
                              maxLength={opt.input.maxLength || undefined}
                              onChange={(e) => {
                                let v = e.target.value;
                                if (opt.input.type === "number" || opt.input.maxLength)
                                  v = v.replace(/[^0-9]/g, "");
                                handleMemberTypeInput(opt.key, v);
                              }}
                              className={`w-full px-2.5 py-1.5 sm:px-4 sm:py-3 border rounded-lg sm:border-2 sm:rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium shadow-sm
                                ${inputError[opt.key]
                                  ? "border-red-400 bg-red-50/80 focus:ring-red-100 focus:border-red-400"
                                  : "border-gray-300 hover:border-blue-300"
                                } text-xs sm:text-base`}
                            />
                            {inputError[opt.key] && (
                              <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium px-2 animate-bounce">
                                ⚠️ {inputError[opt.key]}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Price Summary */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-blue-100/40 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-fuchsia-700 px-3 sm:px-8 py-4 sm:py-7">
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-white/80 rounded-full shadow-lg"></div>
                  สรุปรายการสมัครเรียน
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">ตรวจสอบคอร์สและราคาก่อนชำระเงิน</p>
              </div>
              <div className="p-3 sm:p-7">
                {/* Selected Courses */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-base font-semibold text-gray-800 mb-2 sm:mb-4 flex items-center gap-2">
                    <FiCheck className="text-green-600" size={13} />
                    รายการคอร์สที่เลือก ({selectedCourseObjs.length})
                  </h3>
                  {selectedCourseObjs.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl border border-dashed border-blue-200/50">
                      <div className="text-gray-500 text-xs sm:text-base mb-2">ยังไม่ได้เลือกคอร์ส</div>
                      <div className="text-xs sm:text-sm text-gray-400">เลือกคอร์สด้านซ้ายเพื่อเริ่มต้น</div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {selectedCourseObjs.map((course, index) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-2 sm:p-4 bg-gradient-to-r from-blue-50/80 to-fuchsia-50/80 rounded-lg sm:rounded-xl border border-blue-100/50 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs sm:text-sm text-gray-800 mb-0.5">{course.title}</h4>
                              <p className="text-[10px] sm:text-xs text-gray-600">{course.type_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs sm:text-base font-bold bg-gradient-to-r from-green-600 to-fuchsia-600 bg-clip-text text-transparent">
                              {Number(course.price || 0).toLocaleString()}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500">บาท</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Price Calculation */}
                <div className="border-t border-blue-100 pt-3 sm:pt-6">
                  <div className="bg-gradient-to-br from-blue-50/80 to-fuchsia-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-blue-100/50">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center text-xs sm:text-base">
                        <span className="font-medium text-gray-700">
                          ราคารวม ({courseCount} คอร์ส)
                        </span>
                        <span className="font-bold text-gray-800">
                          {totalCoursePrice.toLocaleString()} บาท
                        </span>
                      </div>
                      {totalDiscount > 0 && (
                        <div className="flex justify-between items-center text-xs sm:text-base animate-in slide-in-from-right duration-300">
                          <span className="font-medium text-gray-700 flex items-center gap-2">
                            ส่วนลดพิเศษ
                            <span className="text-[10px] sm:text-xs bg-gradient-to-r from-green-500 to-fuchsia-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-sm">
                              {isAnyMember && courseCount === 3
                                ? "30%"
                                : isAnyMember && (courseCount === 1 || courseCount === 2)
                                  ? "25%"
                                  : isNoneMember && courseCount === 3
                                    ? "20%"
                                    : "0%"}
                            </span>
                          </span>
                          <span className="font-bold bg-gradient-to-r from-green-600 to-fuchsia-500 bg-clip-text text-transparent">
                            -{totalDiscount.toLocaleString()} บาท
                          </span>
                        </div>
                      )}
                      <div className="border-t border-blue-200/50 pt-2 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-lg font-bold text-gray-800">
                            ยอดชำระสุทธิ
                          </span>
                          <div className="text-right">
                            <div className="text-base sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-fuchsia-500 bg-clip-text text-transparent">
                              {(totalCoursePrice - totalDiscount).toLocaleString()}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">บาท</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Register Button */}
                <div className="pt-4 sm:pt-6 text-center">
                  <button
                    className={`w-full font-bold text-xs sm:text-base px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 transform
                      ${loading || selectedCourses.length === 0 || memberTypes.length === 0
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 via-blue-700 to-fuchsia-700 hover:from-fuchsia-700 hover:to-blue-800 text-white hover:scale-105 hover:shadow-2xl active:scale-95"
                      }`}
                    disabled={loading || selectedCourses.length === 0 || memberTypes.length === 0}
                    onClick={handleRegister}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                        กำลังประมวลผล...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <FiCheck size={15} className="sm:text-[18px]" />
                        สมัครเรียนตอนนี้
                      </div>
                    )}
                  </button>
                  {/* Discount Info */}
                  {selectedCourses.length > 0 && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-fuchsia-50 rounded-lg sm:rounded-xl border border-yellow-200/50">
                      <div className="text-[11px] sm:text-xs text-yellow-800 font-medium text-center">
                        💡 {isAnyMember
                          ? courseCount === 3
                            ? "ยินดีด้วย! คุณได้รับส่วนลด 30% สำหรับสมาชิก"
                            : "เลือกครบ 3 คอร์สเพื่อรับส่วนลด 30% สำหรับสมาชิก"
                          : courseCount === 3
                            ? "ยินดีด้วย! คุณได้รับส่วนลด 20% สำหรับการสมัคร 3 คอร์ส"
                            : "เลือกครบ 3 คอร์สเพื่อรับส่วนลด 20%"
                        }
                      </div>
                    </div>
                  )}
                </div>
                {/* Success/Error Messages */}
                {success && (
                  <div className="bg-gradient-to-r from-green-50 to-fuchsia-50 border-2 border-green-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-3 sm:mt-6 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                        <FiCheck size={12} className="sm:text-[14px] text-white" />
                      </div>
                      <div className="text-green-800 font-medium text-xs sm:text-sm">
                        {success}
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-fuchsia-50 border-2 border-red-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-3 sm:mt-6 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                        <FiX size={12} className="sm:text-[14px] text-white" />
                      </div>
                      <div className="text-red-800 font-medium text-xs sm:text-sm">
                        {error}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Image Popup */}
        {popupImg && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
            onClick={handleCloseImg}
          >
            <div
              className="relative max-w-md sm:max-w-4xl w-full max-h-[90vh] bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/30 animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 bg-white/90 hover:bg-red-500 hover:text-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/50"
                onClick={handleCloseImg}
              >
                <FiX size={22} className="sm:text-[28px]" />
              </button>
              <img
                src={popupImg}
                alt="Course preview"
                className="w-full h-full object-contain rounded-2xl sm:rounded-3xl"
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
      {/* Simple animation utility (for fade/slide/scale, if not available in Tailwind) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s cubic-bezier(.65,.05,.36,1);
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s cubic-bezier(.65,.05,.36,1);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}



// // src/components/CourseDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   FiX,
//   FiSearch,
//   FiArrowLeft,
//   FiClock,
//   FiUsers,
//   FiTag,
//   FiCheck,
// } from "react-icons/fi";
// import Navbar from "./Navbar";
// import OrganizationDropdown from "./OrganizationDropdown";
// import { ORG_OPTIONS } from "../constants/orgs";

// const API_URL = import.meta.env.VITE_API_URL || "";

// const MEMBER_OPTIONS = [
//   {
//     key: "tlwa",
//     label: "สมาชิกสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย (TLWA)",
//     input: {
//       placeholder: "ระบุเลขสมาชิก 4 หลัก (ตัวอย่าง: 0001)",
//       type: "number",
//       maxLength: 4,
//     },
//   },
//   {
//     key: "dietitian",
//     label: "สมาชิกสมาคมนักกำหนดอาหารแห่งประเทศไทย",
//     input: { placeholder: "ระบุชื่อสมาคม/หน่วยงานของคุณ", type: "text" },
//   },
//   {
//     key: "tlwa_partner",
//     label: "องค์กรพันธมิตรสมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย (TLWA)",
//     input: { placeholder: "ค้นหาองค์กร...", type: "dropdown" },
//   },
//   {
//     key: "dietitian_partner",
//     label: "องค์กรพันธมิตรสมาคมนักกำหนดอาหารแห่งประเทศไทย",
//     input: { placeholder: "กรอกชื่อองค์กร", type: "text" },
//   },
//   { key: "none", label: "ไม่ได้เป็นสมาชิกหรือองค์กรพันธมิตรใดเลย" },
// ];

// const MEMBER_KEYS = MEMBER_OPTIONS.slice(0, 4).map((o) => o.key);

// // ฟังก์ชันแปลง path รูปภาพ รองรับ dev/prod
// const getImage = (img) => {
//   if (!img) return "/placeholder.webp";
//   if (img.startsWith("/uploads") || img.startsWith("uploads"))
//     return `${API_URL}${img.startsWith("/") ? img : "/" + img}`;
//   if (img.startsWith("http://") || img.startsWith("https://")) return img;
//   return "/placeholder.webp";
// };

// function formatDate(dateStr) {
//   if (!dateStr) return "-";
//   return new Date(dateStr).toLocaleDateString("th-TH", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// export default function CourseDetail({ setModal }) {
//   const navigate = useNavigate();
//   const { typeId } = useParams();
//   const [courseList, setCourseList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [memberTypes, setMemberTypes] = useState([]);
//   const [inputByMemberType, setInputByMemberType] = useState({});
//   const [inputError, setInputError] = useState({});
//   const [popupImg, setPopupImg] = useState(null);

//   useEffect(() => {
//     window.scrollTo({ top: 0 });
//   }, []);

//   useEffect(() => {
//     setError("");
//     if (!typeId) {
//       setCourseList([]);
//       setLoading(false);
//       setError("ไม่พบประเภทคอร์ส (typeId)");
//       return;
//     }
//     setLoading(true);
//     axios
//       .get(`${API_URL}/api/courses_card/by_type/${typeId}`)
//       .then((res) => setCourseList(Array.isArray(res.data) ? res.data : []))
//       .catch(() => setError("ไม่สามารถโหลดข้อมูลคอร์สได้"))
//       .finally(() => setLoading(false));
//   }, [typeId]);

//   useEffect(() => {
//     let newError = {};
//     if (memberTypes.includes("tlwa")) {
//       newError.tlwa = /^[0-9]{4}$/.test(inputByMemberType.tlwa || "")
//         ? ""
//         : "กรุณาระบุเลขสมาชิก 4 หลัก (ตัวอย่าง: 0001)";
//     }
//     setInputError(newError);
//   }, [memberTypes, inputByMemberType]);

//   const handleMemberTypeChange = (key) => {
//     if (key === "none") {
//       setMemberTypes(["none"]);
//       setInputError({});
//     } else {
//       setMemberTypes((prev) => {
//         const filtered = prev.filter((k) => k !== "none");
//         return prev.includes(key)
//           ? filtered.filter((k) => k !== key)
//           : [...filtered, key];
//       });
//     }
//   };

//   const handleCourseSelect = (id, e) => {
//     if (e.target.closest(".img-popup")) return;
//     setSelectedCourses((prev) =>
//       prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
//     );
//   };

//   const handleMemberTypeInput = (key, value) => {
//     setInputByMemberType((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const courseCount = selectedCourses.length;
//   const isNoneMember = memberTypes.includes("none");
//   const isAnyMember = memberTypes.some((t) => MEMBER_KEYS.includes(t));
//   const selectedCourseObjs = selectedCourses
//     .map((cid) => courseList.find((c) => c.id === cid))
//     .filter(Boolean)
//     .sort((a, b) => (a.id > b.id ? 1 : -1));

//   const totalCoursePrice = selectedCourseObjs.reduce(
//     (sum, c) => sum + (Number(c.price) || 0),
//     0
//   );

//   let totalDiscount = 0;
//   if (isAnyMember && courseCount === 3) {
//     totalDiscount = totalCoursePrice * 0.3;
//   } else if (isAnyMember && (courseCount === 1 || courseCount === 2)) {
//     totalDiscount = totalCoursePrice * 0.25;
//   } else if (isNoneMember && courseCount === 3) {
//     totalDiscount = totalCoursePrice * 0.2;
//   }

//   const handleRegister = async () => {
//     if (!user?.id) {
//       setModal && setModal("login");
//       return;
//     }
//     if (selectedCourses.length === 0) {
//       setError("กรุณาเลือกคอร์สอย่างน้อย 1 คอร์ส");
//       return;
//     }
//     if (memberTypes.length === 0) {
//       setError("กรุณาเลือกสถานะสมาชิก/องค์กรอย่างน้อย 1 รายการ");
//       return;
//     }
//     if (
//       memberTypes.includes("tlwa") &&
//       !/^[0-9]{4}$/.test(inputByMemberType.tlwa || "")
//     ) {
//       setInputError({
//         ...inputError,
//         tlwa: "กรุณาระบุเลขสมาชิก 4 หลัก (ตัวอย่าง: 0001)",
//       });
//       return;
//     }
//     setError("");
//     setSuccess("");
//     try {
//       await axios.post(`${API_URL}/api/course_registrations`, {
//         user_id: user.id,
//         course_ids: selectedCourses,
//         member_types: memberTypes,
//         member_input: inputByMemberType,
//         total_price: totalCoursePrice,
//         total_discount: totalDiscount,
//       });
//       setSuccess("สมัครเรียนสำเร็จ!");
//     } catch (e) {
//       setError(e?.response?.data?.message || "เกิดข้อผิดพลาดในการสมัคร");
//     }
//   };

//   const handleShowImg = (imgUrl) => setPopupImg(getImage(imgUrl));
//   const handleCloseImg = () => setPopupImg(null);

//   const mainTitle =
//     courseList.length > 0
//       ? courseList[0].type_name || courseList[0].title || "สมัครคอร์สอบรม"
//       : "สมัครคอร์สอบรม";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#e5eafe] pt-24 sm:pt-28 relative overflow-x-hidden">
//       <Navbar
//         onLoginClick={() => setModal && setModal("login")}
//         onAccountClick={() => setModal && setModal("account")}
//       />
//       {/* Gradient Blobs background */}
//       <div className="fixed inset-0 -z-10 pointer-events-none">
//         <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-blue-200 rounded-full blur-3xl top-0 left-0 opacity-30 animate-pulse"></div>
//         <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-fuchsia-300 rounded-full blur-3xl bottom-0 right-0 opacity-20 animate-pulse delay-300"></div>
//       </div>
//       <div className="max-w-7xl mx-auto pt-4 pb-20 px-2 sm:pt-6 sm:pb-24 sm:px-4">
//         {/* Breadcrumb */}
//         <div className="flex items-center justify-center mb-4 sm:mb-10 mt-2">
//           <button
//             className="text-xs sm:text-base text-blue-600 hover:bg-blue-100/70 transition rounded-xl px-2 py-1 sm:px-3 sm:py-2 flex items-center font-medium shadow border border-blue-100"
//             onClick={() => navigate(-1)}
//           >
//             <FiArrowLeft className="mr-1 sm:mr-2" />
//             ย้อนกลับ
//           </button>
//           <span className="mx-1 sm:mx-3 text-gray-300 text-base sm:text-xl select-none">|</span>
//           <span className="font-bold text-transparent bg-gradient-to-r from-blue-800 via-purple-700 to-fuchsia-700 bg-clip-text text-base sm:text-xl drop-shadow line-clamp-1 max-w-[180px] sm:max-w-none">
//             {mainTitle}
//           </span>
//         </div>
//         {/* Main */}
//         <div className="flex flex-col lg:flex-row gap-4 sm:gap-10">
//           {/* Left: Course Cards */}
//           <div className="flex-1 min-w-0 px-2 sm:px-20 md:px-10">
//             <div className="bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100/40 p-2 sm:p-6 mb-6 sm:mb-8 backdrop-blur-md">
//               <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8 justify-between">
//                 <div className="flex flex-col">
//                   <div className="flex gap-2 items-center">
//                     <div className="w-1.5 h-8 sm:w-2 sm:h-10 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-700 rounded-full shadow-lg"></div>
//                     <h2 className="text-base sm:text-2xl font-extrabold bg-gradient-to-r from-blue-800 to-fuchsia-700 bg-clip-text text-transparent tracking-wide">เลือกคอร์สที่ต้องการสมัคร</h2>
//                   </div>
//                   <p className="pl-4 text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">เลือกได้มากกว่า 1 คอร์สเพื่อรับส่วนลดพิเศษ</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-semibold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-blue-200/50 shadow-sm whitespace-nowrap">
//                     {selectedCourses.length} / {courseList.length} คอร์ส
//                   </span>
//                 </div>
//               </div>
//               {loading && (
//                 <div className="flex flex-col items-center justify-center py-10 sm:py-16 gap-4">
//                   <div className="relative">
//                     <div className="animate-spin rounded-full h-7 w-7 sm:h-10 sm:w-10 border-4 border-blue-200 border-t-blue-500"></div>
//                   </div>
//                   <span className="text-xs sm:text-base text-gray-600 font-semibold">กำลังโหลดข้อมูล...</span>
//                 </div>
//               )}
//               {error && (
//                 <div className="bg-red-50/80 border border-red-200/80 rounded-lg sm:rounded-xl p-2 sm:p-4 mb-4 sm:mb-8 shadow-md">
//                   <div className="text-red-700 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
//                     <FiX className="text-base sm:text-lg" /> {error}
//                   </div>
//                 </div>
//               )}
//               <div className="px- grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-7">
//                 {courseList
//                   .slice()
//                   .sort((a, b) => a.id - b.id)
//                   .map((card, i) => (
//                     <div
//                       key={card.id}
//                       className={`group relative border rounded-xl sm:rounded-2xl overflow-hidden bg-white/95 backdrop-blur-lg transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl
//                         ${selectedCourses.includes(card.id)
//                           ? "border-blue-500 ring-2 ring-blue-100/40 shadow-blue-200"
//                           : "border-gray-200/80 hover:border-blue-300/60"
//                         }`}
//                       onClick={(e) => handleCourseSelect(card.id, e)}
//                       tabIndex={0}
//                     >
//                       {/* Checkbox */}
//                       <div className="absolute left-3 top-3 sm:left-4 sm:top-4 z-20">
//                         <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center shadow transition-all duration-200
//                           ${selectedCourses.includes(card.id)
//                             ? "bg-gradient-to-tr from-blue-500 to-fuchsia-500 border-blue-400 scale-105 sm:scale-110"
//                             : "bg-white border-gray-300"
//                           }`}>
//                           {selectedCourses.includes(card.id) && (
//                             <FiCheck className="text-white animate-bounce text-base sm:text-lg" />
//                           )}
//                         </div>
//                       </div>
//                       {/* NEW Badge */}
//                       {card.is_new && (
//                         <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
//                           <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg animate-pulse">ใหม่!</span>
//                         </div>
//                       )}
//                       {/* Card Image */}
//                       <div
//                         className="relative img-popup h-50 sm:h-48 lg:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-zoom-in group"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleShowImg(getImage(card.card_image));
//                         }}
//                       >
//                         <img
//                           src={getImage(card.card_image)}
//                           alt={card.title}
//                           className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-700"
//                           draggable={false}
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
//                           <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
//                             <div className="bg-white/95 backdrop-blur-md rounded-full p-2 sm:p-3 shadow-2xl">
//                               <FiSearch size={16} className="sm:text-[22px] text-blue-700" />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       {/* Card Content */}
//                       <div className="p-3 sm:p-6">
//                         <h3 className="font-bold text-sm sm:text-xl text-blue-900 mb-1 sm:mb-2 truncate">{card.title}</h3>
//                         <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2">
//                           {card.detail}
//                         </p>
//                         <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-5">
//                           <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 bg-gray-50/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
//                             <FiClock size={13} className="sm:text-[15px] text-blue-500" />
//                             <span className="font-medium">
//                               {formatDate(card.start_date)} - {formatDate(card.end_date)}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 bg-gray-50/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
//                             <FiUsers size={13} className="sm:text-[15px] text-green-600" />
//                             <span className="font-medium">
//                               รับจำนวน: {card.max_participants ? `${card.max_participants} คน` : "ไม่จำกัด"}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 bg-gray-50/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
//                             <FiTag size={13} className="sm:text-[15px] text-purple-600" />
//                             <span className="font-medium truncate max-w-[140px] sm:max-w-none">ประเภท: {card.type_name || "-"}</span>
//                           </div>
//                         </div>
//                         <div className="flex justify-end items-center pt-2 sm:pt-4 border-t border-gray-100">
//                           <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-green-200/60">
//                             <span className="text-lg sm:text-2xl font-bold text-blue-600">
//                               {card.price ? Number(card.price).toLocaleString() : "-"}
//                             </span>
//                             <span className="text-xs sm:text-sm text-blue-600 font-semibold ml-1 sm:ml-2">บาท</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//               {!loading && courseList.length === 0 && (
//                 <div className="text-center py-8 sm:py-16">
//                   <div className="text-gray-400 text-sm sm:text-lg mb-2">ไม่พบคอร์สในประเภทนี้</div>
//                   <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto"></div>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Right: Member Types + Summary */}
//           {/* ... (ขอข้ามส่วนนี้ เพราะ logic ไม่เปลี่ยน) ... */}
//         </div>
//         {/* Image Popup */}
//         {popupImg && (
//           <div
//             className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
//             onClick={handleCloseImg}
//           >
//             <div
//               className="relative max-w-md sm:max-w-4xl w-full max-h-[90vh] bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/30 animate-scaleIn"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 bg-white/90 hover:bg-red-500 hover:text-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/50"
//                 onClick={handleCloseImg}
//               >
//                 <FiX size={22} className="sm:text-[28px]" />
//               </button>
//               <img
//                 src={popupImg}
//                 alt="Course preview"
//                 className="w-full h-full object-contain rounded-2xl sm:rounded-3xl"
//                 draggable={false}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.35s cubic-bezier(.65,.05,.36,1);
//         }
//         @keyframes scaleIn {
//           from { opacity: 0; transform: scale(0.96);}
//           to { opacity: 1; transform: scale(1);}
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.25s cubic-bezier(.65,.05,.36,1);
//         }
//         .line-clamp-1 {
//           display: -webkit-box;
//           -webkit-line-clamp: 1;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }