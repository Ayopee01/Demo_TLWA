import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiUsers, FiTag } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function CourseDetailMain() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/${courseId}`);
        const data = await res.json();
        if (isMounted) setCourse(data);
      } catch (e) {
        if (isMounted) setCourse(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => (isMounted = false);
  }, [courseId]);

  if (loading) return <div className="pt-28 text-center">กำลังโหลด...</div>;
  if (!course) return <div className="pt-28 text-center">ไม่พบคอร์ส</div>;

  // รูปหลัก
  const hero =
    course.cover_image?.startsWith("/uploads")
      ? `${API_URL}${course.cover_image.startsWith("/") ? "" : "/"}${course.cover_image}`
      : (course.cover_image || "/placeholder.webp");

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Hero */}
      <div className="relative pt-20">
        <img src={hero} className="w-full max-h-[70vh] object-contain bg-white" alt={course.title} />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 bg-white/90 text-gray-900 rounded-xl px-3 py-2 font-semibold shadow hover:bg-white"
        >
          <FiArrowLeft className="inline mr-2" />
          กลับ
        </button>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-extrabold">{course.title}</h1>
        <p className="mt-4 text-lg text-gray-200">{course.description}</p>

        <div className="mt-6 grid sm:grid-cols-3 gap-3 text-gray-200">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <FiClock /> <span>{course.start_date} – {course.end_date}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <FiUsers /> <span>รับ {course.max_participants || "ไม่จำกัด"}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <FiTag /> <span>ประเภท: {course.type_name || "-"}</span>
          </div>
        </div>

        {/* ราคา + CTA */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-300 to-indigo-300 bg-clip-text text-transparent">
            {Number(course.price || 0).toLocaleString()} <span className="text-xl">บาท</span>
          </div>
          <button
            onClick={() => navigate(`/courses/${course.type_id || course.id}`)}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition"
            title="สมัครเรียน"
          >
            สมัครเรียน / เลือกแพ็กเกจ
          </button>
        </div>

        {/* รายละเอียดเพิ่มเติม */}
        {course.detail && (
          <div className="mt-10 prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: course.detail }} />
          </div>
        )}
      </div>
    </div>
  );
}
