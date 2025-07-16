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

    useEffect(() => {
        items.forEach(item => {
            const img = new window.Image();
            img.src = item.image;
        });
    }, []);

    const swipeThreshold = 8000;
    function swipePower(offset, velocity) {
        return Math.abs(offset) * velocity;
    }
    const paginate = (newDirection) => setPage([page + newDirection, newDirection]);
    const handleLink = () => window.location.href = items[imageIndex].link;

    return (
        <section id="conference" className="relative bg-white text-gray-900 py-6 px-1 sm:py-10 sm:px-2 md:py-16 md:px-4 overflow-hidden">
            <img className="hidden sm:block absolute right-0 top-20" src={line1} alt="" />
            <div className="max-w-6xl mx-auto relative pt-2 sm:pt-5 md:pt-10">
                {/* Header */}
                <div className="flex flex-col text-start mb-4 sm:mb-8 md:mb-12">
                    <div className="text-pink-400 font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">Conference</div>
                    <h2 className="font-bold mb-3 sm:mb-5 md:mb-10 max-w-[90vw] text-2xl sm:text-4xl md:text-6xl leading-tight">
                        Thai Lifestyle Medicine
                    </h2>
                    <p className="text-gray-800 font-semibold text-sm sm:text-lg md:text-xl max-w-[95vw] sm:max-w-3xl">
                        With expert speakers, hands-on workshops, and the latest in Thai Lifestyle Medicine, our conferences bring together professionals dedicated to advancing health and wellness in Thailand and beyond.
                    </p>
                </div>
                {/* Centered carousel */}
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center select-none w-full">
                        {/* Prev Button (md+) */}
                        <button
                            className="hidden md:flex z-20 absolute left-3 md:left-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-3 md:p-4 transition"
                            onClick={() => paginate(-1)}
                            aria-label="Previous"
                        >
                            <span className="text-2xl md:text-3xl text-blue-500 font-bold">{'‹'}</span>
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
                                transform: 'perspective(400px) rotateY(21deg) scale(.92)',
                                boxShadow: "none",
                            }}
                        >
                            <img
                                src={items[prevIdx].image}
                                alt={items[prevIdx].title}
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
                                    boxShadow: "none", // ไม่มีเงาที่กล่อง
                                    zIndex: 10,
                                    touchAction: "pan-y"
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
                                w-[80px] h-[120px]
                                sm:w-[110px] sm:h-[170px]
                                md:w-36 md:h-56
                                mx-1 sm:mx-2 md:mx-8
                                rounded-2xl overflow-hidden bg-white/70 border border-gray-100
                                opacity-60 blur-[0.5px] flex items-center justify-center scale-95 pointer-events-none
                            "
                            style={{
                                transform: 'perspective(400px) rotateY(-21deg) scale(.92)',
                                boxShadow: "none",
                            }}
                        >
                            <img
                                src={items[nextIdx].image}
                                alt={items[nextIdx].title}
                                className="object-contain w-full h-full shadow"
                                style={{
                                    boxShadow: "0 6px 16px 0 #a0aec0",
                                }}
                                draggable={false}
                            />
                        </div>
                        {/* Next Button (md+) */}
                        <button
                            className="hidden md:flex z-20 absolute right-3 md:right-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-blue-100 rounded-full shadow-xl p-3 md:p-4 transition"
                            onClick={() => paginate(1)}
                            aria-label="Next"
                        >
                            <span className="text-2xl md:text-3xl text-blue-500 font-bold">{'›'}</span>
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
