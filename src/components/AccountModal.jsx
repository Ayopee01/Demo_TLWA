import { useState, useEffect } from "react";
import api from "../api";
import { useUser } from "../contexts/UserContext";

export default function AccountModal({ open, onClose }) {
  const { user, updateUser } = useUser();

  const [form, setForm] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ message: "", type: "" }); // { message: "...", type: "success"|"error" }
  const [submitting, setSubmitting] = useState(false);

  // โหลดข้อมูล user เข้า form ทันทีที่ user เปลี่ยนหรือ modal เปิด
  useEffect(() => {
    if (user && open) {
      setForm({
        prefix: user.prefix || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || "",
      });
      setErrors({});
      setPopup({ message: "", type: "" });
      setSubmitting(false);
    }
  }, [user, open]);

  const validate = () => {
    const newErrors = {};
    if (!form.prefix) newErrors.prefix = "กรุณาเลือกคำนำหน้า";
    if (!form.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!form.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!form.address) newErrors.address = "กรุณากรอกที่อยู่";
    if (!form.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    else if (!/^0\d{8,9}$/.test(form.phone)) newErrors.phone = "เบอร์โทรไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และ 9-10 หลัก)";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, api: undefined }));
    setPopup({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setPopup({ message: "ไม่พบ user id", type: "error" });
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setPopup({ message: "กรุณากรอกข้อมูลให้ครบถ้วน", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.put(`/api/users/${user.id}`, form);
      setPopup({ message: "แก้ไขข้อมูลเรียบร้อย", type: "success" });
      updateUser({ ...user, ...form, ...res.data.user });
      setTimeout(() => {
        setPopup({ message: "", type: "" });
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setPopup({
        message: err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก",
        type: "error",
      });
      setErrors({ api: err.response?.data?.message || "เกิดข้อผิดพลาด" });
      console.error("Update error:", err);
    }
    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <form
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white backdrop-blur-xl border border-gray-200 px-8 py-8 transition-all duration-200">
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">แก้ไขข้อมูลบัญชี</h2>

        {/* Success/Error Popup */}
        {popup.message && (
          <div className={`mb-4 text-sm ${popup.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {popup.message}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-3">
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
            <div>
              <label className="block mb-1 text-gray-700 font-medium text-sm">Email</label>
              <input
                name="email"
                type="email"
                className="w-full border px-3 py-2 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                value={form.email}
                readOnly
                disabled
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-7 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all text-lg"
          disabled={submitting}
        >
          {submitting ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <div className="mt-5 flex justify-end items-center gap-2">
          <button
            type="button"
            className="text-gray-500 hover:text-blue-600 text-sm hover:underline transition"
            onClick={onClose}
            disabled={submitting}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </form>
  );
}
