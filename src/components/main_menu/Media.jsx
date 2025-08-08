import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, useCycle } from "framer-motion";

// import line decoration
import line from '/src/assets/benefits/line-9.png'

const API_URL = import.meta.env.VITE_API_URL;

// === Animated วงกลม BG ===
function AnimatedCircle({ className, style, delay = 0, ...rest }) {
  const [animation, cycle] = useCycle({ y: 0 }, { y: 40 }, { y: -30 });
  React.useEffect(() => {
    const timer = setInterval(cycle, 2400 + delay)
    return () => clearInterval(timer)
  }, [cycle, delay])
  return (
    <motion.div
      className={className}
      style={style}
      animate={animation}
      transition={{ duration: 2.2, ease: "easeInOut" }}
      {...rest}
    />
  )
}

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
      className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden"
    >
      {/* Animated BG decor */}
      <AnimatedCircle className="absolute -left-32 bottom-0 w-72 h-72 bg-gray-500 opacity-60 rounded-full" delay={0} />
      <AnimatedCircle className="absolute left-32 top-96 w-6 h-6 bg-gray-500 opacity-40 rounded-full" delay={1400} />
      <img className='absolute right-0' src={line} alt="" />
      <div className="max-w-6xl mx-auto px-4 relative">

        {/* Main title */}
        <h1 className="text-pink-400 font-semibold text-xl mb-2">Media</h1>
        <h2 className="text-6xl font-bold mb-12 max-w-xl">
          Insights, Stories,<br />Real Practice
        </h2>
        <p className="text-gray-400 font-semibold text-lg max-w-8xl">
          Your Gateway to Lifestyle Medicine Insights Watch, listen, and explore the world of Lifestyle Medicine through our curated media resources.
        </p>

        {/* วิดีโอมีขอบมน กว้าง max-w-4xl สูงสัดส่วน 16:9 */}
        <div className="w-full flex justify-center my-12">
          {video ? (
            <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(video.youtube_url)}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ background: "#000", border: "none" }}
              />
            </div>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center text-gray-400">No video found.</div>
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
      </div>
    </section>
  );
}
