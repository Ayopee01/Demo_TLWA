import { useState } from "react";
import axios from "axios";

export default function ForgotPassword({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [popup, setPopup] = useState('');

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setPopup('');
    if (!validateEmail(email)) return setError('อีเมลไม่ถูกต้อง');
    try {
      await axios.post('http://localhost:4000/api/forgot-password', { email });
      setPopup('ส่งลิงค์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว');
      setTimeout(() => {
        setPopup('');
        onSwitchToLogin && onSwitchToLogin(); // เมื่อเสร็จ กลับไป login
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่พบอีเมลนี้');
    }
  };

  return (
    <form
      className="relative w-[360px] rounded-2xl shadow-2xl bg-white/95 backdrop-blur-xl border border-gray-200 px-8 py-8 transition-all duration-200"
      onSubmit={handleForgot}
    >
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-3 right-3 bg-gray-200 hover:bg-red-400 text-gray-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition"
        onClick={onClose} // ปิด popup
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Forgot Password</h2>
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      {popup && <div className="mb-4 text-green-600 text-sm">{popup}</div>}

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium text-sm">Email</label>
        <input
          name="email"
          type="email"
          className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-800 transition placeholder-gray-400 bg-white/95"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all text-lg mt-1"
      >
        Send Link
      </button>
      <div className="mt-5 flex justify-between items-center gap-2">
        <button
          type="button"
          className="text-gray-500 hover:text-blue-600 text-sm hover:underline transition"
          onClick={onSwitchToLogin} // กลับไป Login (ไม่ปิด popup)
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}
