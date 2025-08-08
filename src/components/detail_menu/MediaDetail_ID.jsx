import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function getYoutubeId(url) {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
}

export default function MediaDetail_ID() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [previewIdx, setPreviewIdx] = useState(null); // สำหรับ hover preview

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_URL}/api/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(() => setVideo(null));
  }, [id]);

  // โหลดคลิปทั้งหมดเพื่อโชว์ related (เว้นตัวเอง)
  useEffect(() => {
    axios.get(`${API_URL}/api/videos`)
      .then(res => {
        setRelated(res.data.filter(v => String(v.id) !== String(id)));
      })
      .catch(() => setRelated([]));
  }, [id]);

  if (!video) {
    return (
      <div className="bg-[#f5f9fc] min-h-screen flex items-center justify-center text-gray-500">
        Video not found.
      </div>
    );
  }

  const youtubeId = getYoutubeId(video.youtube_url);

  return (
    <section className="bg-[#f5f9fc] min-h-screen py-6 pt-30">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">
        {/* Main Video */}
        <div className="flex-1 pt-8 pb-10 px-6 lg:px-12 flex flex-col items-center">
          <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-lg bg-black mb-5 aspect-w-16 aspect-h-9" style={{ minHeight: 480 }}>
            {/* Main video autoplay */}
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ minHeight: 480, background: "#000" }}
            />
          </div>
          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center max-w-3xl">{video.title}</h2>
        </div>

        {/* Sidebar แนะนำ */}
        <aside className="w-full lg:w-[390px] flex-shrink-0 pt-8 px-4">
          <h3 className="text-lg font-bold mb-3 text-gray-800">คลิปแนะนำ</h3>
          <div className="flex flex-col gap-4">
            {related.slice(0, 5).map((item, idx) => {
              const ytid = getYoutubeId(item.youtube_url);
              const thumbnail = `https://img.youtube.com/vi/${ytid}/mqdefault.jpg`;
              return (
                <Link
                  key={item.id}
                  to={`/videos/${item.id}`}
                  className="flex gap-3 group rounded-lg overflow-hidden hover:bg-gray-100 transition"
                  onMouseEnter={() => setPreviewIdx(idx)}
                  onMouseLeave={() => setPreviewIdx(null)}
                >
                  <div className="relative w-32 h-20 flex-shrink-0 bg-black rounded-lg overflow-hidden">
                    {previewIdx === idx ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytid}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${ytid}`}
                        title={item.title}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      />
                    ) : (
                      <img
                        src={thumbnail}
                        alt={item.title}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition"
                        draggable={false}
                      />
                    )}
                    {previewIdx !== idx && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg viewBox="0 0 64 64" className="w-8 h-8 opacity-80">
                          <circle cx="32" cy="32" r="32" fill="#000" fillOpacity="0.4" />
                          <polygon points="26,20 50,32 26,44" fill="#fff" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="font-medium text-gray-900 line-clamp-2 text-sm leading-snug">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-auto">
                      {item.created_at && new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
