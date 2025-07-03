import React, { useState } from 'react';
import axios from 'axios';

export default function MemberModal({ open, onClose }) {
  const [form, setForm] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await axios.post('/api/register', form);
      setMsg('สมัครสมาชิกสำเร็จ');
      setForm({
        prefix: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        email: '',
        password: '',
      });
    } catch (err) {
      setMsg(err?.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="font-bold text-lg mb-4">สมัครสมาชิก</h2>
        <input className="w-full border rounded px-3 py-2 mb-3"
          name="prefix" placeholder="คำนำหน้า" value={form.prefix}
          onChange={handleChange} required />
        <input className="w-full border rounded px-3 py-2 mb-3"
          name="firstName" placeholder="ชื่อ" value={form.firstName}
          onChange={handleChange} required />
        <input className="w-full border rounded px-3 py-2 mb-3"
          name="lastName" placeholder="นามสกุล" value={form.lastName}
          onChange={handleChange} required />
        <input className="w-full border rounded px-3 py-2 mb-3"
          name="address" placeholder="ที่อยู่" value={form.address}
          onChange={handleChange} required />
        <input className="w-full border rounded px-3 py-2 mb-3"
          name="phone" placeholder="เบอร์โทรศัพท์" value={form.phone}
          onChange={handleChange} required />
        <input className="w-full border rounded px-3 py-2 mb-3"
          name="email" type="email" placeholder="อีเมล"
          value={form.email} onChange={handleChange} required />
        <input className="w-full border rounded px-3 py-2 mb-4"
          name="password" type="password" placeholder="รหัสผ่าน"
          value={form.password} onChange={handleChange} required />
        {msg && <div className="mb-2 text-sm text-red-500">{msg}</div>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">ยกเลิก</button>
          <button type="submit" className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  );
}
