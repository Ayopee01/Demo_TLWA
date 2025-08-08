import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const VIDEOS_PER_PAGE = 8;

// mock: สมมติ duration มาด้วย (ควรเพิ่มใน DB/API จริง)
function formatDuration(sec) {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getYoutubeId(url) {
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = (url || "").match(regExp);
  return match ? match[1] : "";
}

export default function MediaDetail() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const sectionRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/videos`)
      .then((res) => {
        const mockWithDuration = (res.data || []).map((v) => ({
          ...v,
          duration:
            typeof v.duration === "number"
              ? v.duration
              : Math.floor(Math.random() * 300 + 120), // 2–7 นาที
        }));
        const sorted = mockWithDuration.sort((a, b) => b.id - a.id);
        setVideos(sorted);
      })
      .catch(() => setVideos([]));
  }, []);

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = videos.slice(
    (page - 1) * VIDEOS_PER_PAGE,
    page * VIDEOS_PER_PAGE
  );

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // สำหรับ hover preview
  const [previewIdx, setPreviewIdx] = useState(null);

  return (
    <section
      ref={sectionRef}
      className="bg-[#f5f9fc] min-h-screen py-12 px-4 pt-35"
    >
      <div className="max-w-6xl mx-auto">
        {/* ===== Header (ปรับดีไซน์ใหม่เฉพาะส่วนนี้) ===== */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                  All Videos
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Explore, learn, and get inspired from our latest content.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        {/* ===== /Header ===== */}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedVideos.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No videos found.
            </div>
          )}

          {paginatedVideos.map((video, idx) => {
            const youtubeId = getYoutubeId(video.youtube_url);
            const thumbnail = youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : "";
            const showPreview = previewIdx === idx && youtubeId;

            return (
              <Link
                to={`/videos/${video.id}`}
                key={video.id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition flex flex-col cursor-pointer"
                style={{ minHeight: 300 }}
                onMouseEnter={() => setPreviewIdx(idx)}
                onMouseLeave={() => setPreviewIdx(null)}
              >
                {/* Media (16:9) */}
                <div
                  className="relative w-full overflow-hidden rounded-t-xl"
                  style={{ aspectRatio: "16/9", background: "#fff" }}
                >
                  {showPreview ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${youtubeId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      style={{ background: "#fff" }}
                    />
                  ) : (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable={false}
                      style={{ background: "#fff" }}
                    />
                  )}

                  {/* Overlay gradient (คงไว้ได้) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition" />

                  {/* (ลบ Play button ออก) */}

                  {/* Duration */}
                  {formatDuration(video.duration) && (
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/80 text-white text-xs px-2 py-1">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold mb-1 line-clamp-2 text-base text-gray-900">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-xs text-gray-500">
                      {video.created_at &&
                        new Date(video.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-pink-50 text-pink-700 border border-pink-200">
                      YouTube
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="cursor-pointer px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`cursor-pointer px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-pink-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="cursor-pointer px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
