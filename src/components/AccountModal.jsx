import { useState, useEffect, useRef } from "react";
import api from "../api";
import { useUser } from "../contexts/UserContext";

const THAI_REGEX = /^[\u0E00-\u0E7F\s]+$/;         // อักษรไทย + เว้นวรรค
const ENGLISH_REGEX = /^[A-Za-z\s]+$/;             // ภาษาอังกฤษ + เว้นวรรค

export default function AccountModal({ open, onClose }) {
  const { user, updateUser } = useUser();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    firstNameEn: "",
    lastNameEn: "",
    address: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && open) {
      setForm({
        prefix: user.prefix || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        firstNameEn: user.firstNameEn || "",
        lastNameEn: user.lastNameEn || "",
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || "",
      });
      setErrors({});
      setPopup("");
      setSubmitting(false);
    }
  }, [user, open]);

  // -------------------
  // Validation
  // -------------------
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
    return newErrors;
  };

  // -------------------
  // Handler
  // -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, api: undefined }));
    setPopup("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setPopup("ไม่พบ user id");
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setPopup("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.put(`/api/users/${user.id}`, form);
      setPopup("แก้ไขข้อมูลเรียบร้อย");
      updateUser({ ...user, ...form, ...res.data.user });
      setTimeout(() => {
        setPopup("");
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setPopup(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก");
      setErrors({ api: err.response?.data?.message || "เกิดข้อผิดพลาด" });
    }
    setSubmitting(false);
  };

  const handleOverlayClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose && onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg"
      onMouseDown={handleOverlayClick}
    >
      <form
        ref={formRef}
        className={`
        relative w-full flex flex-col items-center
          rounded-2xl shadow-2xl
          bg-white border border-gray-200
          py-5 px-8 transition-all duration-200
          overflow-y-auto
          max-h-[67dvh]
          max-w-sm sm:max-w-lg
          `}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
        onSubmit={handleSubmit}
        onMouseDown={e => e.stopPropagation()}
        autoComplete="off"
      >
        {/* ปุ่มปิด */}
        <button
          type="button"
          className="absolute top-3 right-3 bg-gray-200 cursor-pointer hover:bg-red-400 text-gray-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition"
          onClick={onClose}
          aria-label="Close"
          disabled={submitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Edit Account</h2>
        {errors.api && <div className="mb-4 text-red-500 text-sm">{errors.api}</div>}
        {popup && <div className="mb-4 text-green-600 text-sm">{popup}</div>}

        <div className="flex flex-col md:flex-row gap-4 min-w-[280px] items-center md:items-start">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* คำนำหน้า */}
            <div>
              <div className="flex gap-3">
                <label className="block mb-1 text-gray-700 font-medium text-sm">คำนำหน้า</label>
                {errors.prefix && <span className="text-red-500 font-medium text-sm">{errors.prefix}</span>}
              </div>
              <select
                name="prefix"
                className={`cursor-pointer border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.prefix ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
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
              <div className="flex gap-3">
                <label className="block mb-1 text-gray-700 font-medium text-sm">ชื่อจริง</label>
                {errors.firstName && <span className="text-red-500 font-medium text-sm">{errors.firstName}</span>}
              </div>
              <input
                name="firstName"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.firstName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
                value={form.firstName}
                onChange={handleChange}
                placeholder="กรอกชื่อจริง"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            {/* นามสกุล */}
            <div>
              <div className="flex gap-3">
                <label className="block mb-1 text-gray-700 font-medium text-sm">นามสกุล</label>
                {errors.lastName && <span className="text-red-500 font-medium text-sm">{errors.lastName}</span>}
              </div>
              <input
                name="lastName"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.lastName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
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
                {errors.firstNameEn && <span className="text-red-500 font-medium text-sm">{errors.firstNameEn}</span>}
              </div>
              <input
                name="firstNameEn"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.firstNameEn ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
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
                {errors.lastNameEn && <span className="text-red-500 font-medium text-sm">{errors.lastNameEn}</span>}
              </div>
              <input
                name="lastNameEn"
                type="text"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.lastNameEn ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
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
              <label className="block mb-1 text-gray-700 font-medium text-sm">Email</label>
              <input
                name="email"
                type="email"
                className="border px-3 py-2 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                value={form.email}
                readOnly
                disabled
              />
            </div>
            {/* เบอร์โทรศัพท์ */}
            <div>
              <div className="flex flex-col">
                <label className="block mb-1 text-gray-700 font-medium text-sm">เบอร์โทรศัพท์</label>
                {errors.phone && <span className="text-red-500 font-medium text-sm">{errors.phone}</span>}
              </div>
              <input
                name="phone"
                type="tel"
                className={`border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
                value={form.phone}
                onChange={handleChange}
                placeholder="0812345678"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            {/* ที่อยู่ */}
            <div>
              <div className="flex gap-3">
                <label className="block mb-1 text-gray-700 font-medium text-sm">ที่อยู่</label>
                {errors.address && <span className="text-red-500 font-medium text-sm">{errors.address}</span>}
              </div>
              <textarea
                name="address"
                rows={2}
                className={`border px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.address ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
                value={form.address}
                onChange={handleChange}
                placeholder="กรอกที่อยู่"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="cursor-pointer px-8 mt-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all text-lg"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
        <div className="mt-2 flex w-full justify-end">
          <button
            type="button"
            className="cursor-pointer text-gray-500 hover:text-blue-600 text-sm hover:underline transition"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
