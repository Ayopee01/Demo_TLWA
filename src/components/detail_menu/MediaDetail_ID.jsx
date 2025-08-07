import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_URL}/api/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(() => setVideo(null));
  }, [id]);

  if (!video) {
    return (
      <div className="bg-[#f5f9fc] min-h-screen flex items-center justify-center text-gray-500">
        Video not found.
      </div>
    );
  }

  return (
    <section className="bg-[#f5f9fc] min-h-screen py-16 px-4 pt-35">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4 text-pink-700">{video.title}</h2>
        <div className="mb-6">
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${getYoutubeId(video.youtube_url)}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full rounded-xl"
          />
        </div>
        <div className="flex justify-between">
          <Link to="/videos" className="text-blue-700 underline">
            &larr; Back to All Videos
          </Link>
          <Link to="/" className="text-blue-700 underline">
            Media Home
          </Link>
        </div>
      </div>
    </section>
  );
}
