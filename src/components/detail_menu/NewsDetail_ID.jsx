// src/components/detail_menu/NewsDetail_ID.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiUser,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGES_PER_PAGE = 4;

export default function NewsDetail_ID() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [news, setNews] = useState(null);
  const [page, setPage] = useState(1);

  // images & paging
  const [pagedImages, setPagedImages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // โหลด news_detail
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_URL}/api/news_detail/${id}`)
      .then((res) => setDetail(res.data || null))
      .catch(() => setDetail(null));
  }, [id]);

  // โหลดข่าวหลัก
  useEffect(() => {
    if (!detail?.news_id) return;
    axios
      .get(`${API_URL}/api/news/${detail.news_id}`)
      .then((res) => setNews(res.data || null))
      .catch(() => setNews(null));
  }, [detail?.news_id]);

  // แบ่งหน้า images
  useEffect(() => {
    if (!detail || !Array.isArray(detail.images)) return;
    let imgs = [...detail.images];
    setPagedImages(
      imgs.slice((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE)
    );
    setTotalPages(Math.ceil(imgs.length / IMAGES_PER_PAGE) || 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [detail, news, page]);

  if (!detail || !news) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-gray-400">
        ไม่พบข้อมูลข่าวนี้
      </div>
    );
  }

  // ดึง title ให้ถูกภาษา
  const title = news.lang === "th" ? news.title_th : news.title_en;

  // Author Section ด้านล่าง (แนวนอน)
  const AuthorsBottom = () =>
    Array.isArray(detail.authors) && detail.authors.length > 0 && (
      <div className="w-full flex flex-col items-center mt-14 mb-6">
        <h2 className="flex items-center gap-2 font-bold text-base text-blue-700 mb-2">
          <FiUser /> ผู้เขียนบทความ
        </h2>
        <div className="flex flex-row flex-wrap gap-10 justify-center w-full">
          {detail.authors.map((a, i) => (
            <div key={i} className="flex flex-col items-center">
              {a.author_image_url ? (
                <img
                  src={a.author_image_url}
                  alt={a.author_name}
                  className="w-20 h-20 object-cover rounded-full mb-2 border-2 border-blue-100"
                  style={{
                    boxShadow: "0 2px 8px 0 rgba(80,100,200,0.07)",
                  }}
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-2">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <span className="text-base font-medium text-blue-900 text-center">
                {a.author_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-white pb-12 pt-30">
      <div className="max-w-5xl mx-auto py-10 px-2 md:px-10 relative">
        <div className="mb-5">
          <Link
            to="/news"
            className="inline-flex items-center text-indigo-600 hover:underline mb-6"
          >
            <FiArrowLeft className="mr-2" /> กลับหน้าข่าวทั้งหมด
          </Link>
        </div>

        {/* Headline Section (แสดงเฉพาะหน้า 1) */}
        {page === 1 && (
          <>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-3 leading-tight text-center">
              {title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 text-gray-500 text-sm mb-4">
              <span>{news.created_at?.slice(0, 10)}</span>
              {news.news_type && (
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                  {news.news_type === "lmweek"
                    ? "LM Week"
                    : news.news_type === "news"
                    ? "ข่าวสาร"
                    : news.news_type === "article"
                    ? "บทความ"
                    : news.news_type}
                </span>
              )}
            </div>
            {/* Cover Image Full */}
            {news.cover_image_url && (
              <div className="w-full flex justify-center items-center mb-8">
                <div
                  style={{
                    width: "100%",
                    maxWidth: 900,
                    margin: "0 auto",
                    overflow: "hidden",
                    background: "#f6fafd",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={news.cover_image_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "18px",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            )}
            {detail.caption && (
              <div className="text-gray-700 italic mb-8 text-lg text-center">
                "{detail.caption}"
              </div>
            )}
          </>
        )}

        {/* Gallery */}
        <div className="w-full flex flex-col items-center mt-4">
          <div className="flex flex-col gap-16 w-full max-w-4xl mx-auto">
            {pagedImages.length === 0 ? (
              <div className="w-full flex flex-col items-center py-10 text-gray-400">
                <FiImage className="text-5xl mb-2" />
                <span className="text-base">ไม่มีภาพในอัลบั้มนี้</span>
              </div>
            ) : (
              pagedImages.map((img) => (
                <div
                  key={img.id}
                  className="w-full max-w-4xl mx-auto mb-8"
                  style={{
                    width: "100%",
                    maxWidth: 900,
                    margin: "0 auto 32px auto",
                    overflow: "hidden",
                    background: "#f9fbfc",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || ""}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "18px",
                      display: "block",
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xl disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>
              <span className="text-lg font-semibold">
                หน้า {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xl disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          )}

          {/* ===== Author ใต้สุด ===== */}
          <AuthorsBottom />
        </div>
      </div>
    </div>
  );
}
