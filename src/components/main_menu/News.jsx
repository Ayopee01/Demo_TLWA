import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import line1 from "/src/assets/news/line-1.png";

const API_URL = import.meta.env.VITE_API_URL;

// ฟังก์ชันแปลงชื่อประเภทข่าว
const getTypeLabel = type =>
  type === "lmweek"
    ? "LM Week"
    : type === "news"
    ? "ข่าวสาร"
    : type === "blog" || type === "article"
    ? "บทความ"
    : type;

// สี tag
const getTypeColor = type =>
  type === "lmweek"
    ? "bg-red-500 text-white"
    : type === "news"
    ? "bg-yellow-200 text-yellow-900 border border-yellow-300"
    : type === "blog" || type === "article"
    ? "bg-blue-200 text-blue-900 border border-blue-300"
    : "bg-indigo-400 text-white";

// ดึง title th ก่อน ถ้าไม่มีใช้ en
const getTitle = item => item.title_th || item.title_en || "-";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/news`)
      .then((res) => setNews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  // เลือกเฉพาะ LM Week เอา 2 ข่าวล่าสุด
  const latestNews = [...news]
    .filter((n) => n.news_type === "lmweek")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  return (
    <section id="news" className="relative bg-white text-gray-900 py-24 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-300 opacity-30 rounded-full z-0 -translate-x-2/5 -translate-y-2/5"></div>
      <img className="absolute right-0" src={line1} alt="" />

      <div className="max-w-6xl mx-auto relative pt-12">
        {/* Header */}
        <div className="flex flex-col text-start mb-16">
          <div className="text-pink-400 font-semibold text-xl mb-2">Article</div>
          <h2 className="text-6xl font-bold mb-12 max-w-sm">Latest stories</h2>
          <p className="text-gray-800 font-semibold text-lg max-w-6xl">
            Lifestyle news covers topics related to daily living and personal well-being. The goal of lifestyle news is to inform and inspire readers with the latest trends, tips, and stories that enhance their quality of life.
          </p>
        </div>

        <div>
          {loading ? (
            <div className="text-center text-gray-500 py-16">Loading...</div>
          ) : latestNews.length === 0 ? (
            <div className="text-center text-gray-500 py-16">ไม่มีข้อมูลข่าวสาร</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16 place-items-center">
              {latestNews.map((item) => (
                <Link
                  to={`/news/${item.id}`}
                  key={item.id}
                  className="group cursor-pointer w-full max-w-md"
                  style={{ minHeight: 580 }}
                >
                  <div
                    className="relative bg-white border-0 rounded-[28px] shadow-xl hover:shadow-2xl transition group w-full flex flex-col overflow-hidden border border-transparent group-hover:border-indigo-400"
                    style={{ minHeight: 580, boxShadow: "0 2px 16px 0 rgba(80,100,200,0.10)" }}
                  >
                    {/* รูปภาพแนวตั้งเต็ม (A4 look) */}
                    <div
                      className="relative flex items-center justify-center w-full bg-gray-100 overflow-hidden"
                      style={{ height: 400, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
                    >
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={getTitle(item)}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          style={{ height: "100%", width: "auto" }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          ไม่มีภาพ
                        </div>
                      )}
                      <div className="absolute inset-0 pointer-events-none rounded-t-[28px] border-none"></div>
                    </div>
                    {/* เนื้อหา */}
                    <div className="flex-1 flex flex-col p-8 bg-white rounded-b-[28px]">
                      <h3 className="font-bold text-[1.15rem] md:text-xl mb-3 leading-snug line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition">
                        {getTitle(item)}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{item.created_at?.slice(0, 10)}</p>
                      <div className="flex items-center gap-2 mt-auto">
                        <span
                          className={`inline-block text-xs font-semibold rounded-full px-4 py-2 shadow ${getTypeColor(item.news_type?.toLowerCase())}`}
                        >
                          {getTypeLabel(item.news_type?.toLowerCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Read More */}
        <div className="flex justify-center">
          <Link
            to="/news"
            className="bg-indigo-500 text-white font-semibold w-32 h-12 rounded-xl shadow-lg
            hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            Read More
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 opacity-80 rounded-full z-0 translate-x-[30%] translate-y-[30%]"></div>
    </section>
  );
}
