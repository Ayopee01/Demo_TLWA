import { useState, useRef } from "react";
import axios from "axios";

const THAI_REGEX = /^[\u0E00-\u0E7F\s]+$/;
const ENGLISH_REGEX = /^[A-Za-z\s]+$/;

// util: หน่วงเวลาสั้น ๆ
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * สร้าง/แสดง Popup สำเร็จแบบลอยบนหน้า (ไม่พึ่ง React state)
 * - ใช้ได้แม้ component นี้ถูก unmount แล้ว (เพราะปิด modal ไปก่อน)
 * - ปิดเองอัตโนมัติ
 */
function showSuccessToast(message = "Successfully registered.") {
  // โฮสต์ container
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none";

  // แบ็คดรอป + card
  host.innerHTML = `
    <div class="absolute inset-0 bg-black/30 animate-fadein"></div>
    <div
      role="status"
      aria-live="polite"
      class="relative pointer-events-auto bg-white rounded-2xl shadow-2xl border border-emerald-200 p-6 max-w-sm w-[92%] mx-auto flex flex-col items-center gap-3 animate-popin"
    >
      <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg" class="text-emerald-600">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M7 12.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="text-emerald-700 font-semibold text-lg text-center">${message}</p>
    </div>
    <style>
      @keyframes fadein { from { opacity:0 } to { opacity:1 } }
      @keyframes popin  { 0% { transform: translateY(8px) scale(.98); opacity:.0 }
                          100%{ transform: translateY(0)  scale(1);   opacity:1 } }
      .animate-fadein{ animation: fadein .15s ease-out both }
      .animate-popin { animation: popin  .18s ease-out both }
      .animate-fadeout{ animation: fadein .18s ease-in reverse forwards }
    </style>
  `;

  document.body.appendChild(host);

  // ตั้งเวลาปิดเอง + ละลายหายไป
  const HIDE_AT = 1400; // ms
  const REMOVE_AT = HIDE_AT + 220;
  setTimeout(() => {
    const card = host.querySelector(".relative");
    const overlay = host.querySelector(".absolute");
    card && card.classList.add("animate-fadeout");
    overlay && overlay.classList.add("animate-fadeout");
  }, HIDE_AT);

  setTimeout(() => {
    host.remove();
  }, REMOVE_AT);
}

export default function Register({ onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    firstNameEn: "",
    lastNameEn: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(""); // ใช้ใน modal เดิม (ข้อความระหว่างกำลังสมัคร)
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!form.prefix) newErrors.prefix = "กรุณาเลือกคำนำหน้า";

    if (!form.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    else if (!THAI_REGEX.test(form.firstName)) newErrors.firstName = "กรุณากรอกเป็นภาษาไทย";

    if (!form.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    else if (!THAI_REGEX.test(form.lastName)) newErrors.lastName = "กรุณากรอกเป็นภาษาไทย";

    if (!form.firstNameEn) newErrors.firstNameEn = "กรุณากรอกชื่อภาษาอังกฤษ";
    else if (!ENGLISH_REGEX.test(form.firstNameEn)) newErrors.firstNameEn = "กรุณากรอกเป็นภาษาอังกฤษ";

    if (!form.lastNameEn) newErrors.lastNameEn = "กรุณากรอกนามสกุลภาษาอังกฤษ";
    else if (!ENGLISH_REGEX.test(form.lastNameEn)) newErrors.lastNameEn = "กรุณากรอกเป็นภาษาอังกฤษ";

    if (!form.address) newErrors.address = "กรุณากรอกที่อยู่";

    if (!form.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    else if (!/^0\d{8,9}$/.test(form.phone)) newErrors.phone = "กรุณากรอกให้ครบ 9-10 หลัก";

    if (!form.email) newErrors.email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "อีเมลไม่ถูกต้อง";

    if (!form.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    else if (form.password.length < 6) newErrors.password = "รหัสผ่านอย่างน้อย 6 ตัว";

    if (!form.confirmPassword) newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, api: undefined }));
  };

  const handleOverlayClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose && onClose();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setPopup("");
    setSubmitting(true);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      // 1) สมัครสมาชิก
      const { confirmPassword, ...registerData } = form;
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, registerData);

      // 2) ปิด modal เดิมก่อน
      onClose && onClose();
      await delay(80); // เผื่อให้ DOM ปิดจริง

      // 3) ส่งอีเมลยืนยัน (ถ้าพังจะไม่บล็อก UX)
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/email/welcome`, {
          to: form.email,
          prefix: form.prefix,
          firstName: form.firstName,
          lastName: form.lastName,
          firstNameEn: form.firstNameEn,
          lastNameEn: form.lastNameEn,
        });
      } catch (mailErr) {
        // บันทึกไว้ให้ดีบัก แต่ยังคงแสดง success ต่อผู้ใช้ตาม requirement
        console.error("Failed to send welcome email:", mailErr?.response?.data || mailErr?.message);
      }

      // 4) แสดง popup สำเร็จ (เขียว + auto close)
      showSuccessToast("Successfully registered.");
    } catch (err) {
      // แสดง error บนฟอร์ม (ยังอยู่ใน modal ถ้ายังไม่ปิด)
      setErrors({ api: err?.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={handleOverlayClick}
    >
      <form
        ref={formRef}
        className="
          relative w-full flex flex-col items-center
          rounded-2xl shadow-2xl
          bg-white backdrop-blur-xl border border-gray-200
          py-5 px-8 transition-all duration-200
          overflow-y-auto
          max-h-[67dvh]
          max-w-sm sm:max-w-lg
        "
        style={{ WebkitOverflowScrolling: "touch" }}
        onSubmit={handleRegister}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ปุ่มปิด */}
        <button
          type="button"
          className="cursor-pointer absolute top-3 right-3 bg-gray-200 hover:bg-red-400 text-gray-600 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition"
          onClick={onClose}
          aria-label="Close"
          disabled={submitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Register</h2>

        {errors.api && <div className="mb-4 text-red-500 text-sm">{errors.api}</div>}
        {popup && <div className="mb-4 text-green-600 text-sm">{popup}</div>}

        <div className="flex flex-col md:flex-row gap-4 min-w-[280px] items-center md:items-start">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* คำนำหน้า */}
            <div>
              <div className="flex gap-3 items-center">
                <label className="block mb-1 text-gray-700 font-medium text-sm">คำนำหน้า</label>
                {errors.prefix && <span className="text-red-500 font-medium text-xs">{errors.prefix}</span>}
              </div>
              <select
                name="prefix"
                className={`cursor-pointer border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.prefix ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.prefix}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย / Mr.</option>
                <option value="นาง">นาง / Mrs.</option>
                <option value="นางสาว">นางสาว / Miss</option>
              </select>
            </div>

            {/* ชื่อจริง */}
            <div>
              <div className="flex gap-3 items-center">
                <label className="block mb-1 text-gray-700 font-medium text-sm">ชื่อจริง</label>
                {errors.firstName && <span className="text-red-500 font-medium text-xs">{errors.firstName}</span>}
              </div>
              <input
                name="firstName"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.firstName ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.firstName}
                onChange={handleChange}
                placeholder="กรอกชื่อจริง"
                disabled={submitting}
                autoComplete="off"
              />
            </div>

            {/* นามสกุล */}
            <div>
              <div className="flex gap-3 items-center">
                <label className="block mb-1 text-gray-700 font-medium text-sm">นามสกุล</label>
                {errors.lastName && <span className="text-red-500 font-medium text-xs">{errors.lastName}</span>}
              </div>
              <input
                name="lastName"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.lastName ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.lastName}
                onChange={handleChange}
                placeholder="กรอกนามสกุล"
                disabled={submitting}
                autoComplete="off"
              />
            </div>

            {/* First Name (English) */}
            <div>
              <div className="flex flex-col">
                <label className="block mb-1 text-gray-700 font-medium text-sm">First Name (English)</label>
                {errors.firstNameEn && <span className="text-red-500 font-medium text-xs">{errors.firstNameEn}</span>}
              </div>
              <input
                name="firstNameEn"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.firstNameEn ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.firstNameEn}
                onChange={handleChange}
                placeholder="First Name"
                disabled={submitting}
                autoComplete="off"
              />
            </div>

            {/* Last Name (English) */}
            <div>
              <div className="flex flex-col">
                <label className="block mb-1 text-gray-700 font-medium text-sm">Last Name (English)</label>
                {errors.lastNameEn && <span className="text-red-500 font-medium text-xs">{errors.lastNameEn}</span>}
              </div>
              <input
                name="lastNameEn"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.lastNameEn ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.lastNameEn}
                onChange={handleChange}
                placeholder="Last Name"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Email */}
            <div>
              <div className="flex gap-3 items-center">
                <label className="block mb-1 text-gray-700 font-medium text-sm">Email</label>
                {errors.email && <span className="text-red-500 font-medium text-xs">{errors.email}</span>}
              </div>
              <input
                name="email"
                type="email"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
                placeholder="your@email.com"
                disabled={submitting}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex gap-3 items-center">
                <label className="block mb-1 text-gray-700 font-medium text-sm">Password</label>
                {errors.password && <span className="text-red-500 font-medium text-xs">{errors.password}</span>}
              </div>
              <input
                name="password"
                type="password"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.password ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="สร้างรหัสผ่าน"
                disabled={submitting}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex flex-col">
                <label className="block mb-1 text-gray-700 font-medium text-sm">Confirm Password</label>
                {errors.confirmPassword && <span className="text-red-500 font-medium text-xs">{errors.confirmPassword}</span>}
              </div>
              <input
                name="confirmPassword"
                type="password"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.confirmPassword ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="ยืนยันรหัสผ่าน"
                disabled={submitting}
              />
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div>
              <div className="flex flex-col">
                <label className="block mb-1 text-gray-700 font-medium text-sm">เบอร์โทรศัพท์</label>
                {errors.phone && <span className="text-red-500 font-medium text-xs">{errors.phone}</span>}
              </div>
              <input
                name="phone"
                type="tel"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 transition ${errors.phone ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.phone}
                onChange={handleChange}
                placeholder="0812345678"
                disabled={submitting}
              />
            </div>

            {/* ที่อยู่ */}
            <div>
              <div className="flex gap-3 items-center">
                <label className="block mb-1 text-gray-700 font-medium text-sm">ที่อยู่</label>
                {errors.address && <span className="text-red-500 font-medium text-xs">{errors.address}</span>}
              </div>
              <textarea
                name="address"
                rows={2}
                className={`border px-6 py-4 rounded-xl focus:outline-none focus:ring-2 transition ${errors.address ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
                value={form.address}
                onChange={handleChange}
                placeholder="กรอกที่อยู่"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full mb-3 mt-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md transition duration-300 hover:from-blue-600 hover:to-indigo-600 text-lg"
          disabled={submitting}
        >
          {submitting ? "กำลังสมัคร..." : "Register"}
        </button>

        <div className="mt-2 w-full">
          <button
            type="button"
            className="cursor-pointer text-gray-500 transition duration-300 hover:text-blue-600 text-sm hover:underline"
            onClick={onSwitchToLogin}
            disabled={submitting}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
