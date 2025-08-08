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
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
}

export default function MediaDetail() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const sectionRef = useRef(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/videos`)
            .then(res => {
                // เพิ่ม mock duration (ควรเป็นจริงจาก API)
                const mockWithDuration = res.data.map(v => ({
                    ...v,
                    duration: v.duration || Math.floor(Math.random() * 300 + 120) // 2-7 นาที
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
        <section ref={sectionRef} className="bg-[#f5f9fc] min-h-screen py-12 px-4 pt-35">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="text-blue-700 text-sm ml-1">
                        &larr; Back to Home
                    </Link>
                    <h2 className="text-2xl font-bold text-pink-700 text-center flex-1 mr-10">
                        All Videos
                    </h2>
                    <div style={{ width: 130 }} />
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {paginatedVideos.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No videos found.</div>
                    )}
                    {paginatedVideos.map((video, idx) => {
                        const youtubeId = getYoutubeId(video.youtube_url);
                        const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                        return (
                            <Link
                                to={`/videos/${video.id}`}
                                key={video.id}
                                className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition border border-gray-200 cursor-pointer"
                                style={{ minHeight: 300 }}
                                onMouseEnter={() => setPreviewIdx(idx)}
                                onMouseLeave={() => setPreviewIdx(null)}
                            >
                                {/* Thumbnail 16:9 */}
                                <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "16/9", background: "#fff" }}>
                                    {previewIdx === idx ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${youtubeId}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full"
                                            style={{ background: "#fff" }} // กันเกิดขอบดำระหว่างโหลด iframe
                                        />
                                    ) : (
                                        <img
                                            src={thumbnail}
                                            alt={video.title}
                                            className="cursor-pointer absolute top-0 left-0 w-full h-full object-cover"
                                            draggable={false}
                                            style={{ background: "#fff" }} // กันเกิดขอบดำกรณี thumb โหลดช้า
                                        />
                                    )}
                                    {/* Play button */}
                                    {previewIdx !== idx && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <svg viewBox="0 0 64 64" className="w-12 h-12 opacity-80 group-hover:opacity-100">
                                                <circle cx="32" cy="32" r="32" fill="#000" fillOpacity="0.4" />
                                                <polygon points="26,20 50,32 26,44" fill="#fff" />
                                            </svg>
                                        </div>
                                    )}
                                    {/* Duration */}
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                                        {formatDuration(video.duration)}
                                    </div>
                                </div>
                                
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold mb-2 line-clamp-2 text-base text-gray-900">{video.title}</h3>
                                    <div className="mt-auto flex justify-end">
                                        <span className="text-xs text-gray-500">{video.created_at && new Date(video.created_at).toLocaleDateString()}</span>
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
                        >Prev</button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`cursor-pointer px-3 py-1 rounded ${page === i + 1 ? "bg-pink-700 text-white" : "bg-gray-100 text-gray-700"}`}
                            >{i + 1}</button>
                        ))}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="cursor-pointer px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-40"
                        >Next</button>
                    </div>
                )}
            </div>
        </section>
    );
}
