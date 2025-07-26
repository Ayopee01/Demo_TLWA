// src/components/ConferenceCatalog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlusCircle } from "react-icons/fi";
import line1 from "../assets/conference/line-1.png";
import api from "../api";

const transitionConfig = {
  duration: 0.16,
  ease: [0.7, 0, 0.3, 1],
};
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 340 : -340,
    opacity: 0,
    scale: 0.97,
    zIndex: 2,
  }),
  center: { x: 0, opacity: 1, scale: 1, zIndex: 10, transition: transitionConfig },
  exit: (direction) => ({
    x: direction < 0 ? 340 : -340,
    opacity: 0,
    scale: 0.97,
    zIndex: 2,
    transition: transitionConfig,
  }),
};

const placeholderImg = "/placeholder.webp";

function ConferenceCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/api/courses");
        setCourses(Array.isArray(res.data) ? res.data : (res.data.courses || []));
      } catch (e) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const swipeThreshold = 8000;
  function swipePower(offset, velocity) {
    return Math.abs(offset) * velocity;
  }
  const paginate = (newDirection) =>
    setPage(([oldPage]) => [oldPage + newDirection, newDirection]);

  // คำนวณ index ใน Carousel
  const imageIndex = ((page % courses.length) + courses.length) % courses.length;
  const prevIdx = ((imageIndex - 1 + courses.length) % courses.length);
  const nextIdx = ((imageIndex + 1) % courses.length);

  // ลิงก์ไปหน้ารายละเอียดคอร์ส
  const handleLink = () => {
    navigate(`/courses/${courses[imageIndex].id}`);
  };

  // ใช้ cover_image จากฐานข้อมูล ถ้าไม่มีให้ fallback เป็น placeholder
  const getImage = (item) => {
    if (!item) return placeholderImg;
    if (
      item.cover_image &&
      typeof item.cover_image === "string" &&
      item.cover_image.length > 3
    ) {
      // ถ้า path ขึ้นต้นด้วย /uploads ให้แปลง URL ให้ถูกต้อง (รองรับทั้ง prod/dev)
      if (
        item.cover_image.startsWith("/uploads") ||
        item.cover_image.startsWith("uploads")
      ) {
        let url = item.cover_image.startsWith("/")
          ? item.cover_image
          : "/" + item.cover_image;
        return (import.meta.env.VITE_API_URL || "") + url;
      }
      // ถ้าเป็น path แบบ URL เต็มอยู่แล้ว
      if (
        item.cover_image.startsWith("http://") ||
        item.cover_image.startsWith("https://")
      ) {
        return item.cover_image;
      }
    }
    return placeholderImg;
  };

  // Loading
  if (loading)
    return (
      <div className="py-10 text-center text-gray-500">กำลังโหลดคอร์ส...</div>
    );
  if (!courses.length)
    return (
      <div className="py-10 text-center text-gray-400">
        ยังไม่มีคอร์สเปิดลงทะเบียน
      </div>
    );

  return (
    <section
      id="conference"
      className="relative bg-white text-gray-900 py-6 px-1 sm:py-10 sm:px-2 md:py-16 md:px-4 overflow-hidden"
    >
      <img className="hidden sm:block absolute right-0 top-20" src={line1} alt="" />
      <div className="max-w-6xl mx-auto relative pt-2 sm:pt-5 md:pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 md:mb-12">
          <div>
            <div className="text-pink-400 font-semibold text-xl mb-2">Conference</div>
            <h2 className="text-6xl font-bold mb-4 max-w-sm">
              Thai Lifestyle Medicine
            </h2>
            <p className="text-gray-800 font-semibold text-lg max-w-8xl">
              With expert speakers, hands-on workshops, and the latest in Thai Lifestyle Medicine, our conferences bring together professionals dedicated to advancing health and wellness in Thailand and beyond.
            </p>
          </div>
        </div>
        {/* Centered carousel */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center select-none w-full">
            {/* Prev Button */}
            <button
              className="hidden md:flex z-20 absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-3 md:p-4 transition"
              onClick={() => paginate(-1)}
              aria-label="Previous"
            >
              <span className="text-2xl md:text-3xl text-blue-500 font-bold">
                {"‹"}
              </span>
            </button>
            {/* Preview Left (3D) */}
            <div
              className="
                w-[80px] h-[120px]
                sm:w-[110px] sm:h-[170px]
                md:w-36 md:h-56
                mx-1 sm:mx-2 md:mx-8
                rounded-2xl overflow-hidden bg-white/70 border border-gray-100
                opacity-60 blur-[0.5px] flex items-center justify-center scale-95 pointer-events-none
              "
              style={{
                transform: "perspective(400px) rotateY(21deg) scale(.92)",
                boxShadow: "none",
              }}
            >
              <img
                src={getImage(courses[prevIdx])}
                alt={courses[prevIdx]?.title || ""}
                className="object-contain w-full h-full shadow"
                style={{
                  boxShadow: "0 6px 16px 0 #a0aec0",
                }}
                draggable={false}
              />
            </div>
            {/* Main Center Image */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                className="
                  mx-1 sm:mx-3
                  w-[340px] h-[500px]
                  sm:w-[350px] sm:h-[520px]
                  md:w-[480px] md:h-[680px]
                  overflow-hidden
                  bg-white flex flex-col items-center z-30 relative cursor-pointer
                  transition duration-300 group
                  hover:scale-105
                "
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionConfig}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.95}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeThreshold) paginate(1);
                  else if (swipe > swipeThreshold) paginate(-1);
                }}
                onClick={handleLink}
                title="คลิกเพื่อดูรายละเอียด"
                style={{
                  border: "none",
                  boxShadow: "none",
                  zIndex: 10,
                  touchAction: "pan-y",
                }}
                tabIndex={0}
              >
                <img
                  src={getImage(courses[imageIndex])}
                  alt={courses[imageIndex]?.title || ""}
                  className="object-contain w-full h-full bg-white"
                  style={{
                    background: "#fff",
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
            {/* Preview Right (3D) */}
            <div
              className="
                w-[80px] h-[120px]
                sm:w-[110px] sm:h-[170px]
                md:w-36 md:h-56
                mx-1 sm:mx-2 md:mx-8
                rounded-2xl overflow-hidden bg-white/70 border border-gray-100
                opacity-60 blur-[0.5px] flex items-center justify-center scale-95 pointer-events-none
              "
              style={{
                transform: "perspective(400px) rotateY(-21deg) scale(.92)",
                boxShadow: "none",
              }}
            >
              <img
                src={getImage(courses[nextIdx])}
                alt={courses[nextIdx]?.title || ""}
                className="object-contain w-full h-full shadow"
                style={{
                  boxShadow: "0 6px 16px 0 #a0aec0",
                }}
                draggable={false}
              />
            </div>
            {/* Next Button */}
            <button
              className="hidden md:flex z-20 absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-3 md:p-4 transition"
              onClick={() => paginate(1)}
              aria-label="Next"
            >
              <span className="text-2xl md:text-3xl text-blue-500 font-bold">
                {"›"}
              </span>
            </button>
          </div>
          {/* Title: เต็มแถว ตัด 2 บรรทัด ใกล้รูป */}
          <div
            className="
              mt-1 sm:mt-2 px-2 sm:px-4 py-1 sm:py-2
              font-bold text-blue-700 text-lg sm:text-xl md:text-2xl
              text-center w-full leading-tight
              transition hover:text-blue-900 cursor-pointer
            "
            onClick={handleLink}
            tabIndex={0}
            style={{
              maxWidth: "480px",
              margin: "0 auto",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              lineHeight: "1.25",
            }}
          >
            <span className="block sm:whitespace-normal line-clamp-2">
              {courses[imageIndex].title}
            </span>
          </div>
          {/* Short description */}
          <div className="mt-2 mb-2 text-center text-gray-500 text-base max-w-lg">
            {courses[imageIndex].description?.slice(0, 160) ?? ""}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConferenceCatalog;
