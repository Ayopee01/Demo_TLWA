import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ดึง token และ email จาก URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // ตรวจสอบว่า token/email มีค่าครบไหม
  if (!token || !email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-bold mb-3">Reset Password</h2>
          <div className="text-red-500">ลิงค์ไม่ถูกต้องหรือหมดอายุ</div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate ฟอร์ม
    if (!form.password || !form.confirm) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (form.password.length < 6) {
      setError("รหัสผ่านต้องอย่างน้อย 6 ตัว");
      return;
    }
    if (form.password !== form.confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/reset-password", {
        password: form.password,
        token,
        email,
      });
      setSuccess("เปลี่ยนรหัสผ่านสำเร็จ! กำลังกลับไปหน้าเข้าสู่ระบบ...");
      setTimeout(() => {
        navigate("/"); // กลับไปหน้า login หรือหน้าแรก
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}

        <input
          type="password"
          name="password"
          placeholder="รหัสผ่านใหม่"
          className="w-full border px-3 py-2 rounded-xl mb-3"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="confirm"
          placeholder="ยืนยันรหัสผ่านใหม่"
          className="w-full border px-3 py-2 rounded-xl mb-5"
          value={form.confirm}
          onChange={handleChange}
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
