import { useState } from "react";
import axios from "axios";

export default function Login({ onClose, onSwitchToRegister, onSwitchToForgot, onLoginSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [popup, setPopup] = useState('');

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setPopup('');
    if (!form.email || !form.password) return setError('กรุณากรอกข้อมูลให้ครบ');
    if (!validateEmail(form.email)) return setError('อีเมลไม่ถูกต้อง');
    try {
      const res = await axios.post('http://localhost:4000/api/login', form);
      setPopup('เข้าสู่ระบบสำเร็จ');
      setTimeout(() => {
        setPopup('');
        // สมมุติ backend ส่ง user กลับมา
        if (onLoginSuccess && res.data.user) onLoginSuccess(res.data.user);
        onClose && onClose();
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'เข้าสู่ระบบล้มเหลว');
    }
  };

  return (
    <form
      className="relative w-[360px] rounded-2xl shadow-2xl bg-white backdrop-blur-xl border border-gray-200 px-8 py-8 transition-all duration-200"
      onSubmit={handleLogin}
    >
      <button
        type="button"
        className="absolute top-3 right-3 bg-gray-200 hover:bg-red-400 text-gray-500 hover:text-white rounded-full w-9 h-9 flex items-center justify-center transition"
        onClick={onClose}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">Log in</h2>
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      {popup && <div className="mb-4 text-green-600 text-sm">{popup}</div>}

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium text-sm">Email</label>
        <input
          name="email"
          type="email"
          className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 transition"
          value={form.email}
          onChange={handleChange}
          autoFocus
          autoComplete="username"
          placeholder="your@email.com"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium text-sm">Password</label>
        <input
          name="password"
          type="password"
          className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 transition"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all text-lg mt-1"
      >
        Log in
      </button>
      <div className="mt-5 flex justify-between items-center gap-2">
        <button
          type="button"
          className="text-blue-500 hover:text-indigo-600 hover:underline text-sm transition"
          onClick={onSwitchToForgot}
        >
          Forgot password?
        </button>
        <button
          type="button"
          className="text-gray-500 hover:text-blue-600 text-sm hover:underline transition"
          onClick={onSwitchToRegister}
        >
          Register
        </button>
      </div>
    </form>
  );
}