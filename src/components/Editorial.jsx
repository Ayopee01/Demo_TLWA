import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock data (ในอนาคตเปลี่ยน fetch จาก API ได้)
const fakeCategories = [
    "All", "กิจกรรม", "ความร่วมมือ", "Mindfulness", "Lifestyle Medicine"
];
const fakeNews = [
    {
        id: 1,
        title: "The 1st Thailand–Switzerland Symposium on Sleep Health and Mindfulness",
        summary: "The 1st Thailand–Switzerland Symposium on Sleep Health and Mindfulness จัดโดย สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย ร่วมกับ ชมรมเวชศาสตร์วิถีชีวิตแห่งสวิตเซอร์แลนด์...",
        category: "Mindfulness",
        content: "รายละเอียดข่าว/บทความฉบับเต็มของข่าวนี้...",
    },
    {
        id: 2,
        title: "ขอแสดงความยินดีกับผู้สำเร็จหลักสูตร Mindfulness & Lifestyle Medicine for Leadership",
        summary: "ขอแสดงความยินดีกับผู้สำเร็จหลักสูตรตลอด 3 วันที่ผ่านมา ผู้เข้าอบรมเกือบ 50 ท่าน ได้ร่วมเรียนรู้ฝึกฝน Mindfulness & Lifestyle Medicine for Leadership Programme ...",
        category: "Lifestyle Medicine",
        content: "เนื้อหาข่าวฉบับเต็ม...",
    },
    {
        id: 3,
        title: "TLWA Expands Collaboration by Signing Its Third MOU with Six…",
        summary: "TLWA Expands Collaboration by Signing Its Third MOU with Six New Partner Organizations...",
        category: "ความร่วมมือ",
        content: "รายละเอียด MOU และความร่วมมือ...",
    },
    {
        id: 4,
        title: "สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย เดินหน้าขยายความร่วมมือลงนาม MOU ครั้งที่ 3 กับ 6 องค์ก...",
        summary: "สมาคมเวชศาสตร์วิถีชีวิตและสุขภาวะไทย เดินหน้าขยายความร่วมมือ ลงนาม MOU ครั้งที่ 3 กับ 6 องค์กร ...",
        category: "กิจกรรม",
        content: "รายละเอียดข่าว MOU ล่าสุด...",
    },
    // เพิ่มได้เรื่อยๆ
];

const itemsPerPage = 2; // จำนวนข่าวต่อหน้า

function Editorial() {
    const [news, setNews] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    // Mock fetch (เปลี่ยน fetch จาก API จริงได้)
    useEffect(() => {
        setLoading(true);
        setError("");
        setTimeout(() => {
            setNews(fakeNews);
            setLoading(false);
        }, 600); // แกล้งโหลดให้เห็น loading
    }, []);

    // Filter & Search
    const filtered = news.filter(item => {
        const matchCategory = category === "All" || item.category === category;
        const matchSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.summary.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // หากเปลี่ยนหมวดหรือค้นหา ให้รีเซ็ตกลับหน้าที่ 1
    useEffect(() => {
        setPage(1);
    }, [search, category]);
    return (
        <section className="py-24 px-4 overflow-hidden bg-white pt-10">
            {/* Breadcrumb */}
            <nav className="mb-4 text-gray-400 text-sm flex items-center gap-2">
                <Link to="/" className="hover:underline text-gray-500">Home</Link>
                <span>/</span>
                <span className="text-indigo-500">News</span>
            </nav>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="ค้นหาข่าวหรือบทความ..."
                    className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex gap-2 flex-wrap">
                    {fakeCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-1 rounded-full border transition
                ${category === cat
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading/Error */}
            {loading && <div className="text-center text-gray-400 py-10">Loading...</div>}
            {error && <div className="text-center text-red-500 py-10">{error}</div>}

            {/* News grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginated.length === 0 && (
                        <div className="col-span-full text-center text-gray-400">ไม่พบรายการที่ค้นหา</div>
                    )}
                    {paginated.map(item => (
                        <div
                            key={item.id}
                            className="relative bg-white border border-gray-200 rounded-xl p-7 shadow hover:shadow-lg transition"
                        >
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <div className="text-gray-500 mb-4 line-clamp-2">{item.summary}</div>
                            {/* อ่านรายละเอียด */}
                            <Link
                                to={`/news/${item.id}`}
                                className="text-indigo-600 font-medium hover:underline flex items-center"
                            >
                                Learn more <span className="ml-1 text-xl">&#8594;</span>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-indigo-100"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >Prev</button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 rounded 
                ${page === idx + 1
                                    ? "bg-indigo-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-indigo-100"}`}
                            onClick={() => setPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-indigo-100"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >Next</button>
                </div>
            )}
        </section>
    )
}

export default Editorial