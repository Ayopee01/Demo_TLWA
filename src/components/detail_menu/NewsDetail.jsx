import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiGlobe, FiFrown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 6;

function getNewsTypeLabel(type) {
  if (!type) return "-";
  switch ((type || "").toLowerCase()) {
    case "news":
      return "News";
    case "article":
      return "Article";
    case "lmweek":
      return "LM Week";
    default:
      return type;
  }
}

export default function NewsDetail() {
  const [newsList, setNewsList] = useState([]);
  const [lang, setLang] = useState("th");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  // โหลดข่าว
  useEffect(() => {
    axios.get(`${API_URL}/api/news`)
      .then(res => setNewsList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNewsList([]));
  }, []);

  // สร้างหมวดจาก DB (ไม่ซ้ำ)
  const categories = useMemo(() => {
    const allTypes = Array.from(
      new Set(newsList.map(n => (n.news_type || "").toLowerCase()).filter(Boolean))
    );
    const mapLabel = type => ({
      value: type,
      label: getNewsTypeLabel(type)
    });
    return [
      { value: "all", label: "All" },
      ...allTypes.map(mapLabel)
    ];
  }, [newsList]);

  // Filter ด้วยภาษาและหมวด
  const filteredList = useMemo(() => {
    return newsList.filter(news => {
      if (lang && news.lang !== lang) return false;
      if (category === "all") return true;
      return (news.news_type || "").toLowerCase() === category;
    });
  }, [newsList, lang, category]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE) || 1;
  const pagedNews = useMemo(
    () => filteredList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredList, page]
  );

  // handle page change
  useEffect(() => {
    // reset page to 1 if filter changes
    setPage(1);
  }, [lang, category]);

  // Helper: ชื่อข่าว 2 ภาษา ถ้าไม่มีใช้ตัวอื่น
  const getNewsTitle = news =>
    (lang === "th" ? news.title_th : news.title_en) ||
    (lang === "th" ? news.title_en : news.title_th) ||
    "-";

  // Helper: ข่าวประเภท LM Week แสดงสีพิเศษ
  const getTypeColor = type =>
    type === "lmweek" ? "bg-red-500 text-white"
      : type === "news" ? "bg-yellow-200 text-yellow-900 border border-yellow-300"
        : type === "blog" || type === "article" ? "bg-blue-200 text-blue-900 border border-blue-300"
          : "bg-indigo-400 text-white";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <FiGlobe className="text-indigo-500 text-3xl" />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            News and Articles
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
          {/* ปุ่ม filter หมวดหมู่ */}
          <div className="flex bg-gray-50 rounded-full p-1 border border-indigo-100 shadow gap-1">
            {categories.map(opt => (
              <button
                key={opt.value}
                className={`cursor-pointer px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-150
                  ${category === opt.value
                    ? "bg-indigo-500 text-white shadow"
                    : "text-indigo-500 hover:bg-indigo-100"
                  }`}
                onClick={() => setCategory(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {/* ปุ่มภาษา */}
          <div className="flex border border-indigo-200 rounded-full overflow-hidden shadow-sm ml-2">
            <button
              className={`cursor-pointer px-5 py-2 text-base font-semibold transition 
                ${lang === "th" ? "bg-indigo-500 text-white" : "text-indigo-500 bg-white hover:bg-indigo-50"}`}
              onClick={() => setLang("th")}
            >
              TH
            </button>
            <button
              className={`cursor-pointer px-5 py-2 text-base font-semibold transition 
                ${lang === "en" ? "bg-indigo-500 text-white" : "text-indigo-500 bg-white hover:bg-indigo-50"}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* News grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[420px]">
        {pagedNews.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center py-16 opacity-60">
            <FiFrown className="text-5xl mb-3" />
            <span className="text-lg">ไม่มีข่าวในหมวดนี้</span>
          </div>
        ) : (
          pagedNews.map(news => (
            <Link
              to={`/news/${news.id}`}
              key={news.id}
              className="group cursor-pointer"
            >
              <div
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition flex flex-col h-full border border-transparent group-hover:border-indigo-400 overflow-hidden"
                style={{ boxShadow: "0 2px 16px 0 rgba(80,100,200,0.08)" }}
              >
                {/* รูปภาพแบบเต็ม + hover scale */}
                <div
                  className="relative overflow-hidden"
                  style={{ minHeight: 350, maxHeight: 400 }}
                >
                  {news.cover_image_url ? (
                    <img
                      src={news.cover_image_url}
                      alt={getNewsTitle(news)}
                      className="w-full h-[380px] object-contain transition-transform duration-300 group-hover:scale-105 bg-gray-100"
                      style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                    />
                  ) : (
                    <div className="w-full h-[380px] bg-gray-200 flex items-center justify-center text-gray-400">
                      ไม่มีภาพ
                    </div>
                  )}
                  {/* Gradient mask ป้องกัน hover หลุดขอบ */}
                  <div className="absolute inset-0 pointer-events-none rounded-t-3xl border-none"></div>
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h2 className="text-lg font-extrabold mb-2 text-gray-900 group-hover:text-indigo-600 transition break-words leading-snug line-clamp-3">
                    {getNewsTitle(news)}
                  </h2>
                  <p className="text-xs text-gray-500 mb-2">{news.created_at?.slice(0, 10)}</p>
                  <span className={`inline-block mt-auto text-xs font-semibold rounded-full px-3 py-1 self-start shadow-sm ${getTypeColor((news.news_type || "").toLowerCase())}`}>
                    {getNewsTypeLabel(news.news_type)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xl disabled:opacity-40"
            aria-label="หน้าก่อนหน้า"
          >
            <FiChevronLeft />
          </button>
          <span className="text-lg font-semibold">
            หน้า {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xl disabled:opacity-40"
            aria-label="หน้าถัดไป"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
