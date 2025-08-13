// ConferenceCatalog.jsx (full version)
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Decoration
import line1 from "/src/assets/conference/line-1.png";

// ------- Config -------
const API_URL = import.meta.env.VITE_API_URL || "";
const PLACEHOLDER_IMG = "/placeholder.webp";

const transitionConfig = { duration: 0.16, ease: [0.7, 0, 0.3, 1] };
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

// ------- Helpers -------
const swipeThreshold = 8000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const resolveImage = (item) => {
  if (!item || !item.cover_image) return PLACEHOLDER_IMG;
  const src = String(item.cover_image);

  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  if (src.startsWith("/uploads") || src.startsWith("uploads")) {
    const path = src.startsWith("/") ? src : `/${src}`;
    return `${API_URL}${path}`;
  }
  return PLACEHOLDER_IMG;
};

export default function ConferenceCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  const navigate = useNavigate();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/courses`);
        const list = Array.isArray(res.data) ? res.data : res.data?.courses || [];
        setCourses(list);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const paginate = (newDirection) =>
    setPage(([oldPage]) => [oldPage + newDirection, newDirection]);

  // ----- Navigation: choose between CourseDetailMain vs CourseDetail -----
  const goToCourse = useCallback(
    (item) => {
      if (!item) return;
      const useMain = item.detail_layout === "main" || item.is_single === true;
      if (useMain) navigate(`/course-main/${item.id}`);
      else navigate(`/courses/${item.id}`);
    },
    [navigate]
  );

  // ----- Loading / Empty -----
  if (loading)
    return <div className="py-10 text-center text-gray-500">กำลังโหลดคอร์ส...</div>;

  if (!courses.length)
    return <div className="py-10 text-center text-gray-400">ยังไม่มีคอร์สเปิดลงทะเบียน</div>;

  // คำนวณ index หลังยืนยันว่ามีข้อมูลแล้ว
  const total = courses.length;
  const imageIndex = ((page % total) + total) % total;
  const prevIdx = (imageIndex - 1 + total) % total;
  const nextIdx = (imageIndex + 1) % total;

  const current = courses[imageIndex];

  return (
    <section
      id="conference"
      className="relative bg-white text-gray-900 py-6 px-4 sm:py-10 sm:px-2 md:py-16 md:px-4 overflow-hidden"
    >
      <img className="hidden sm:block absolute right-0 top-20" src={line1} alt="" />

      <div className="max-w-6xl mx-auto relative pt-2 sm:pt-5 md:pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 md:mb-12">
          <div>
            <div className="text-pink-400 font-semibold text-xl mb-2">Conference</div>
            <h2 className="text-6xl font-bold mb-4 max-w-sm">Thai Lifestyle Medicine</h2>
            <p className="text-gray-800 font-semibold text-lg max-w-8xl">
              With expert speakers, hands-on workshops, and the latest in Thai Lifestyle Medicine, our conferences
              bring together professionals dedicated to advancing health and wellness in Thailand and beyond.
            </p>
          </div>
        </div>

        {/* Centered carousel */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center select-none w-full">
            {/* Prev Button */}
            <button
              className="hidden cursor-pointer md:flex z-20 absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-3 md:p-4 transition"
              onClick={() => paginate(-1)}
              aria-label="Previous"
              type="button"
            >
              <span className="text-2xl md:text-3xl text-blue-500 font-bold">‹</span>
            </button>

            {/* Preview Left (3D) */}
            <div
              className="w-[80px] h-[120px] sm:w-[110px] sm:h-[170px] md:w-36 md:h-56 mx-1 sm:mx-2 md:mx-8
                         rounded-2xl overflow-hidden bg-white/70 border border-gray-100 opacity-60 blur-[0.5px]
                         flex items-center justify-center scale-95 pointer-events-none"
              style={{ transform: "perspective(400px) rotateY(21deg) scale(.92)" }}
            >
              <img
                src={resolveImage(courses[prevIdx])}
                alt={courses[prevIdx]?.title || ""}
                className="object-contain w-full h-full"
                draggable={false}
              />
            </div>

            {/* Main Center Image */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                className="mx-1 sm:mx-3 w-[380px] h-[400px] sm:w-[350px] sm:h-[520px] md:w-[480px] md:h-[680px]
                           overflow-hidden bg-white flex flex-col items-center z-30 relative cursor-pointer
                           transition duration-300 group hover:scale-105"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transitionConfig}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.95}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeThreshold) paginate(1);
                  else if (swipe > swipeThreshold) paginate(-1);
                }}
                onClick={() => goToCourse(current)}
                title="คลิกเพื่อดูรายละเอียด"
                style={{ touchAction: "pan-y" }}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => (e.key === "Enter" ? goToCourse(current) : null)}
              >
                <img
                  src={resolveImage(current)}
                  alt={current?.title || ""}
                  className="object-contain w-full h-full bg-white"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Preview Right (3D) */}
            <div
              className="w-[80px] h-[120px] sm:w-[110px] sm:h-[170px] md:w-36 md:h-56 mx-1 sm:mx-2 md:mx-8
                         rounded-2xl overflow-hidden bg-white/70 border border-gray-100 opacity-60 blur-[0.5px]
                         flex items-center justify-center scale-95 pointer-events-none"
              style={{ transform: "perspective(400px) rotateY(-21deg) scale(.92)" }}
            >
              <img
                src={resolveImage(courses[nextIdx])}
                alt={courses[nextIdx]?.title || ""}
                className="object-contain w-full h-full"
                draggable={false}
              />
            </div>

            {/* Next Button */}
            <button
              className="hidden cursor-pointer md:flex z-20 absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-3 md:p-4 transition"
              onClick={() => paginate(1)}
              aria-label="Next"
              type="button"
            >
              <span className="text-2xl md:text-3xl text-blue-500 font-bold">›</span>
            </button>
          </div>

          {/* Title */}
          <button
            className="mt-1 sm:mt-2 px-2 pt-10 sm:px-4 py-1 sm:py-2 font-bold text-blue-700 text-lg sm:text-xl md:text-2xl
                       text-center w-full leading-tight transition hover:text-blue-900 z-35"
            onClick={() => goToCourse(current)}
            type="button"
            style={{
              maxWidth: 480,
              margin: "0 auto",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              lineHeight: "1.25",
            }}
          >
            <span className="block sm:whitespace-normal line-clamp-2">
              {current?.title}
            </span>
          </button>

          {/* Short description */}
          <div className="mt-2 mb-2 text-center text-gray-500 text-base max-w-lg">
            {current?.description?.slice(0, 160) ?? ""}
          </div>
        </div>
      </div>
    </section>
  );
}
