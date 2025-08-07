import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function getYoutubeId(url) {
  // รองรับ url youtube ทั่วไป
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
}

export default function Media() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/videos/1`)
      .then(res => setVideo(res.data))
      .catch(() => setVideo(null));
  }, []);

  return (
    <section
      id="media"
      className="relative min-h-[80vh] bg-[#f5f9fc] text-gray-800 py-16 px-4 flex flex-col items-center justify-center"
    >
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-pink-600 font-bold text-2xl sm:text-3xl mb-3 tracking-wide">
          WELL-BEING...
        </h2>
        <p className="max-w-xl mx-auto text-lg font-medium leading-relaxed">
          “Health is a state of complete physical, mental and social well-being and not merely
          the absence of disease or infirmity.”
        </p>
        <span className="block mt-2 text-sm text-gray-500">
          ...from the Constitution of the World Health Organization
        </span>
      </div>

      {/* Video Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-0 flex flex-col items-center mb-8">
        {video ? (
          <>
            <div className="w-full aspect-video rounded-t-2xl overflow-hidden">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${getYoutubeId(video.youtube_url)}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-t-2xl"
                style={{ minHeight: 260, background: "#000" }}
              />
            </div>
            <div className="px-6 py-4 w-full text-center">
              <h3 className="text-lg font-semibold">{video.title}</h3>
            </div>
          </>
        ) : (
          <div className="p-16 text-center text-gray-400">No video found.</div>
        )}
      </div>

      {/* View More Button */}
      <div className="w-full flex justify-center">
        <Link
          to="/videos"
          className="inline-block px-8 py-3 bg-pink-600 text-white text-lg font-medium rounded-full shadow-lg hover:bg-pink-700 transition-all"
        >
          View more
        </Link>
      </div>
    </section>
  );
}
