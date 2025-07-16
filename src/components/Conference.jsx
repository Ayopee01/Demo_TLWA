import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../assets/conference/งานสมาคม TMWTA + TLWA.jpg";
import img2 from "../assets/conference/The Health Professional Council of Lao PDR and Affiliated Institutions.jpg";
import img3 from "../assets/conference/หลักสูตร การประกอบอาหารเพื่อฟื้นฟูโรคเบาหวาน.jpg";
import img4 from "../assets/conference/LMW วิทยากร (ใหม่).jpg";
import line1 from '../assets/conference/line-1.png';

const items = [
    { image: img1, title: "Lifestyle Medicine Conference", link: "/conference/detail1" },
    { image: img2, title: "Health Professional Council of Lao PDR", link: "/association" },
    { image: img3, title: "Diabetes Cooking Course", link: "/cooking" },
    { image: img4, title: "New LMW Speakers", link: "/speakers" },
];

const transitionConfig = {
    duration: 0.16,
    ease: [0.7, 0, 0.3, 1]
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

function ConferenceCatalog() {
    const [[page, direction], setPage] = useState([0, 0]);
    const imageIndex = ((page % items.length) + items.length) % items.length;
    const prevIdx = ((imageIndex - 1 + items.length) % items.length);
    const nextIdx = ((imageIndex + 1) % items.length);

    // Preload images for smooth slide
    useEffect(() => {
        items.forEach(item => {
            const img = new window.Image();
            img.src = item.image;
        });
    }, []);

    // Swipe
    const swipeThreshold = 8000;
    function swipePower(offset, velocity) {
        return Math.abs(offset) * velocity;
    }
    const paginate = (newDirection) => setPage([page + newDirection, newDirection]);
    const handleLink = () => window.location.href = items[imageIndex].link;

    return (
        <section id="conference" className="relative bg-white text-gray-900 py-10 px-2 sm:py-16 sm:px-4 md:py-24 overflow-hidden">
            <img className="hidden sm:block absolute right-0 top-20" src={line1} alt="" />
            <div className="max-w-6xl mx-auto relative pt-3 sm:pt-6 md:pt-12">
                <div className="flex flex-col text-start mb-7 sm:mb-12 md:mb-16">
                    <div className="text-pink-400 font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">Conference</div>
                    <h2 className="font-bold mb-4 sm:mb-7 md:mb-12 max-w-[90vw] text-3xl sm:text-5xl md:text-6xl leading-tight">
                        Thai Lifestyle Medicine
                    </h2>
                    <p className="text-gray-800 font-semibold text-base sm:text-lg md:text-xl max-w-[90vw] sm:max-w-3xl">
                        With expert speakers, hands-on workshops, and the latest in Thai Lifestyle Medicine, our conferences bring together professionals dedicated to advancing health and wellness in Thailand and beyond.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center select-none w-full">
                        {/* Prev Button */}
                        <button
                            className="z-20 absolute left-[-12px] sm:left-[-28px] md:left-[-48px] top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-2 sm:p-3 md:p-4 transition"
                            onClick={() => paginate(-1)}
                            aria-label="Previous"
                        >
                            <span className="text-2xl sm:text-3xl text-blue-500 font-bold">{'‹'}</span>
                        </button>
                        {/* Preview Left (3D) */}
                        <div
                            className="
                                w-[60px] h-[95px]
                                sm:w-20 sm:h-32
                                md:w-32 md:h-56
                                mx-[2px] sm:mx-4 md:mx-8
                                rounded-2xl overflow-hidden bg-white/70 border border-gray-100
                                opacity-60 blur-[0.5px] flex items-center justify-center scale-95 pointer-events-none shadow
                            "
                            style={{
                                transform: 'perspective(400px) rotateY(23deg) scale(.93)',
                                boxShadow: "0 6px 18px #0002",
                            }}
                        >
                            <img
                                src={items[prevIdx].image}
                                alt={items[prevIdx].title}
                                className="object-contain w-full h-full"
                                draggable={false}
                            />
                        </div>
                        {/* Main Center Image */}
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={page}
                                className="
                                    mx-1 sm:mx-4
                                    w-[180px] h-[260px]
                                    sm:w-[300px] sm:h-[420px]
                                    md:w-[440px] md:h-[620px]
                                    rounded-3xl overflow-hidden shadow-2xl
                                    bg-white flex flex-col items-center z-30 relative cursor-pointer
                                    transition duration-300 group
                                    hover:scale-105 hover:shadow-2xl
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
                                    boxShadow: "0 8px 38px 0 #99b6ff55",
                                    zIndex: 10,
                                }}
                                tabIndex={0}
                            >
                                <img
                                    src={items[imageIndex].image}
                                    alt={items[imageIndex].title}
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
                                w-[60px] h-[95px]
                                sm:w-20 sm:h-32
                                md:w-32 md:h-56
                                mx-[2px] sm:mx-4 md:mx-8
                                rounded-2xl overflow-hidden bg-white/70 border border-gray-100
                                opacity-60 blur-[0.5px] flex items-center justify-center scale-95 pointer-events-none shadow
                            "
                            style={{
                                transform: 'perspective(400px) rotateY(-23deg) scale(.93)',
                                boxShadow: "0 6px 18px #0002",
                            }}
                        >
                            <img
                                src={items[nextIdx].image}
                                alt={items[nextIdx].title}
                                className="object-contain w-full h-full"
                                draggable={false}
                            />
                        </div>
                        {/* Next Button */}
                        <button
                            className="z-20 absolute right-[-12px] sm:right-[-28px] md:right-[-48px] top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-2 sm:p-3 md:p-4 transition"
                            onClick={() => paginate(1)}
                            aria-label="Next"
                        >
                            <span className="text-2xl sm:text-3xl text-blue-500 font-bold">{'›'}</span>
                        </button>
                    </div>
                    {/* Title: clickable */}
                    <div
                        className="mt-4 sm:mt-7 px-2 sm:px-4 py-2 sm:py-3 text-base sm:text-xl font-bold text-blue-700 transition hover:text-blue-900 cursor-pointer md:text-2xl"
                        onClick={handleLink}
                        tabIndex={0}
                        style={{ minWidth: 160, maxWidth: 320, textAlign: "center" }}
                    >
                        {items[imageIndex].title}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ConferenceCatalog;
