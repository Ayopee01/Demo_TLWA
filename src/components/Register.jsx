import { useState } from "react";
import axios from "axios";

export default function Register({ onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // state แยก error ของแต่ละช่อง
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Validation function ---
  const validate = () => {
    const newErrors = {};
    if (!form.prefix) newErrors.prefix = "กรุณาเลือกคำนำหน้า";
    if (!form.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!form.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!form.address) newErrors.address = "กรุณากรอกที่อยู่";
    if (!form.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    else if (!/^0\d{8,9}$/.test(form.phone)) newErrors.phone = "เบอร์โทรไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และ 9-10 หลัก)";
    if (!form.email) newErrors.email = "กรุณากรอกอีเมล";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "อีเมลไม่ถูกต้อง";
    if (!form.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    else if (form.password.length < 6) newErrors.password = "รหัสผ่านอย่างน้อย 6 ตัว";
    if (!form.confirmPassword) newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    return newErrors;
  };

  // --- onChange อัปเดตและ clear error ช่องนั้นๆ ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, api: undefined }));
  };

  // --- Submit Register ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setPopup('');
    setSubmitting(true);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitting(false);
      return;
    }
    try {
      // ไม่ต้องส่ง confirmPassword ไป backend
      const { confirmPassword, ...registerData } = form;
      await axios.post('http://localhost:4000/api/register', registerData);
      setPopup('สมัครสมาชิกสำเร็จ');
      setTimeout(() => {
        setPopup('');
        setSubmitting(false);
        onClose && onClose();
      }, 1200);
    } catch (err) {
      setPopup('');
      setErrors({ api: err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ' });
      setSubmitting(false);
    }
  };

  return (
    <form
      className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white backdrop-blur-xl border border-gray-200 px-8 py-8 transition-all duration-200"
      onSubmit={handleRegister}
    >
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-3 right-3 bg-gray-200 hover:bg-red-400 text-gray-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition"
        onClick={onClose}
        aria-label="Close"
        disabled={submitting}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Register</h2>
      {/* API/Server Error */}
      {errors.api && <div className="mb-4 text-red-500 text-sm">{errors.api}</div>}
      {popup && <div className="mb-4 text-green-600 text-sm">{popup}</div>}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-3">
          {/* คำนำหน้า */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">คำนำหน้า</label>
            <select
              name="prefix"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.prefix ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.prefix}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="">เลือกคำนำหน้า</option>
              <option value="นาย">นาย</option>
              <option value="นาง">นาง</option>
              <option value="นางสาว">นางสาว</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
            {errors.prefix && <span className="text-red-500 text-xs">{errors.prefix}</span>}
          </div>
          {/* ชื่อจริง */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">ชื่อจริง</label>
            <input
              name="firstName"
              type="text"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.firstName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.firstName}
              onChange={handleChange}
              placeholder="กรอกชื่อจริง"
              disabled={submitting}
            />
            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span>}
          </div>
          {/* นามสกุล */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">นามสกุล</label>
            <input
              name="lastName"
              type="text"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.lastName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.lastName}
              onChange={handleChange}
              placeholder="กรอกนามสกุล"
              disabled={submitting}
            />
            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
          </div>
          {/* ที่อยู่ */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">ที่อยู่</label>
            <textarea
              name="address"
              rows={2}
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.address ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.address}
              onChange={handleChange}
              placeholder="กรอกที่อยู่"
              disabled={submitting}
            />
            {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
          </div>
          {/* เบอร์โทรศัพท์ */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">เบอร์โทรศัพท์</label>
            <input
              name="phone"
              type="tel"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.phone}
              onChange={handleChange}
              placeholder="0812345678"
              disabled={submitting}
            />
            {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
          </div>
        </div>
        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">Email</label>
            <input
              name="email"
              type="email"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              placeholder="your@email.com"
              disabled={submitting}
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>
          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">Password</label>
            <input
              name="password"
              type="password"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="สร้างรหัสผ่าน"
              disabled={submitting}
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium text-sm">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className={`w-full border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-400'}`}
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="ยืนยันรหัสผ่าน"
              disabled={submitting}
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-7 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all text-lg"
        disabled={submitting}
      >
        {submitting ? "กำลังสมัคร..." : "Register"}
      </button>
      <div className="mt-5 flex justify-between items-center gap-2">
        <button
          type="button"
          className="text-gray-500 hover:text-blue-600 text-sm hover:underline transition"
          onClick={onSwitchToLogin}
          disabled={submitting}
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}
