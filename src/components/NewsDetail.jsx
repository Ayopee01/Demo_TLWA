import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// ใช้ fakeNews แบบเดียวกับหน้า NewsPage (ควรย้ายไปไฟล์ data เฉพาะถ้าใช้ซ้ำหลายไฟล์)
const fakeNews = [
  // ... (ชุดเดียวกับข้างบน)
];

function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);

  useEffect(() => {
    // ถ้าเชื่อม API จริง ให้ fetch ตาม id
    const found = fakeNews.find(item => item.id === Number(id));
    setNewsItem(found);
  }, [id]);

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">ไม่พบข่าวที่คุณต้องการ</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white pt-8 px-2 pb-16 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-4 text-gray-400 text-sm flex items-center gap-2">
        <Link to="/" className="hover:underline text-gray-500">Home</Link>
        <span>/</span>
        <Link to="/news" className="hover:underline text-gray-500">News</Link>
        <span>/</span>
        <span className="text-indigo-500">{newsItem.title.slice(0, 24)}...</span>
      </nav>
      <h1 className="font-bold text-2xl mb-2">{newsItem.title}</h1>
      <div className="mb-4 text-gray-500">{newsItem.category}</div>
      <div className="mb-6">{newsItem.content}</div>
      <Link to="/news" className="text-indigo-500 hover:underline">&larr; กลับหน้าข่าว</Link>
    </section>
  );
}

export default NewsDetail;
