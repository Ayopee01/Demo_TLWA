import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function getYoutubeId(url) {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
}

export default function MediaDetail() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/videos`)
            .then(res => setVideos(res.data))
            .catch(() => setVideos([]));
    }, []);

    return (
        <section className="bg-[#f5f9fc] min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-center text-pink-700">All Videos</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {videos.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No videos found.</div>
                    )}
                    {videos.map(video => {
                        const youtubeId = getYoutubeId(video.youtube_url);
                        const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                        return (
                            <Link
                                to={`/videos/${video.id}`}
                                key={video.id}
                                className="group bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition"
                            >
                                <div className="relative">
                                    <img
                                        src={thumbnail}
                                        alt={video.title}
                                        className="w-full h-[180px] object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <svg viewBox="0 0 64 64" className="w-12 h-12 opacity-80 group-hover:opacity-100">
                                            <circle cx="32" cy="32" r="32" fill="#000" fillOpacity="0.4" />
                                            <polygon points="26,20 50,32 26,44" fill="#fff" />
                                        </svg>
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
                <div className="mt-8 text-center">
                    <Link to="/" className="text-blue-700 underline">
                        &larr; Back to Media Home
                    </Link>
                </div>
            </div>
        </section>
    );
}
