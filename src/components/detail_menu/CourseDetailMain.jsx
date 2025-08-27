// src/components/detail_menu/CourseDetailMain.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiTag, FiShoppingCart, FiLock, FiX } from "react-icons/fi";
import { useUser } from "@/contexts/UserContext";
import CartFab from "@/components/cart/CartFab";
import { addToCart, openCart } from "@/utils/cartStorage";

const API_URL = import.meta.env.VITE_API_URL || "";

/* ---------- helpers ---------- */
// เดือนอังกฤษ + ปี ค.ศ. + เวลาไทย
const toThaiDate = (v) => {
  if (!v) return "-";
  const s = typeof v === "string" && v.includes(" ") && !v.includes("T") ? v.replace(" ", "T") : v;
  const d = new Date(s);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// สร้าง URL สมบูรณ์ (รองรับ /uploads จากแบ็กเอนด์)
const absUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads")) return `${API_URL}${path}`;
  return path;
};

export default function CourseDetailMain({ setModal }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    if (!imgPreview) return;
    const onKey = (e) => e.key === "Escape" && setImgPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgPreview]);

  /* -------- load course -------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/${courseId}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        if (alive) setCourse(data);
      } catch {
        if (alive) setCourse(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [courseId]);

  /* -------- check member -------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user?.id) return setIsMember(false);
      try {
        const res = await fetch(`${API_URL}/api/members/user/${user.id}`);
        if (!alive) return;
        setIsMember(res.ok);
      } catch {
        if (alive) setIsMember(false);
      }
    })();
    return () => (alive = false);
  }, [user?.id]);

  if (loading) return <div className="pt-28 text-center text-gray-700">กำลังโหลด...</div>;
  if (!course)
    return (
      <div className="pt-28 text-center text-gray-800">
        ไม่พบคอร์ส
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );

  // รูปหลัก/พื้นหลัง
  const hero = absUrl(course.cover_image) || "/placeholder.webp";
  const bgUrl = absUrl(course.bg_image);
  const wrapperStyle = bgUrl
    ? { backgroundImage: `url("${bgUrl}")`, backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat" }
    : { backgroundColor: "#ffffff" };

  // ราคาและโปรสมาชิก
  const basePrice = Number(course.price || 0);
  const memberPriceVal = Number(course.member_price);
  const hasMemberPromo = Number.isFinite(memberPriceVal) && memberPriceVal > 0;
  const displayPrice = user && isMember && hasMemberPromo ? memberPriceVal : basePrice;

  const stock = Number.isFinite(course.stock) ? course.stock : null;
  const canBuy = displayPrice > 0 && (stock === null || stock > 0) && course.is_active !== 0;

  // เพิ่มลงตะกร้า + เปิด Cart
  const handleBuy = () => {
    if (!user) {
      setModal ? setModal("login") : navigate("/");
      return;
    }
    if (!canBuy) return;

    addToCart({
      id: course.id,
      title: course.title,
      price: displayPrice,
      imageUrl: hero,
      qty: 1,
    });
    openCart();
  };

  const locationHref =
    typeof course.link_location === "string" && course.link_location.trim().startsWith("http")
      ? course.link_location.trim()
      : undefined;

  const speakers = Array.isArray(course.speakers) ? course.speakers : [];

  return (
    <div style={wrapperStyle}>
      <div className={`min-h-screen ${bgUrl ? "bg-white/10" : "bg-white"} text-gray-900 pt-30`}>
        {/* main */}
        <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
            <img src={hero} alt={course.title} className="w-full h-full max-h-[85vh] object-contain" />
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            <h1 className={`text-3xl md:text-5xl font-extrabold leading-tight tracking-tight ${bgUrl ? "text-gray-100" : "text-gray-900"}`}>
              {course.title}
            </h1>

            <div className="flex flex-col gap-4">
              <InfoChip icon={<FiCalendar />} title="Registration period" text={`${toThaiDate(course.registration_start)} – ${toThaiDate(course.registration_end)}`} />
              <InfoChip icon={<FiMapPin />} title="Location" text={course.location || "-"} href={locationHref} />
              <InfoChip icon={<FiTag />} title="Type" text={course.type_name || "-"} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {stock !== null && (
                  <span className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700">
                    Remaining seats: {stock}
                  </span>
                )}
                {course.is_active === 0 && (
                  <span className="px-2 py-1 rounded-full bg-red-100 border border-red-200 text-red-700">
                    Sold out
                  </span>
                )}
                {user && isMember && hasMemberPromo && (
                  <span className="px-2 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700">
                    Member Exclusive
                  </span>
                )}
              </div>

              {/* ราคา */}
              <div className="mt-2 flex items-baseline gap-4">
                {user && isMember && hasMemberPromo ? (
                  <>
                    <div className="text-2xl md:text-3xl font-bold text-gray-400">
                      <span className="line-through">{basePrice.toLocaleString()}</span>
                      <span className="ml-1 text-lg md:text-xl align-baseline">Baht</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                      {memberPriceVal.toLocaleString()} <span className="text-xl">Baht</span>
                    </div>
                  </>
                ) : (
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                    {basePrice.toLocaleString()} <span className="text-xl">Baht</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleBuy}
                disabled={!canBuy && !!user}
                className={`mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition
                  ${user
                    ? canBuy
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-gray-900 text-white hover:bg-black"
                  }`}
                title={user ? (canBuy ? "Add to Cart" : "Not yet for sale") : "Sign in to buy"}
              >
                {user ? (
                  <>
                    <FiShoppingCart />
                    Add to Cart
                  </>
                ) : (
                  <>
                    <FiLock />
                    Sign in to buy
                  </>
                )}
              </button>

              {!user && <p className="mt-3 text-xs text-gray-500">Sign-in required to purchase.</p>}
            </div>

            {course.detail && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="prose max-w-none prose-headings:font-semibold text-gray-800">
                  <div dangerouslySetInnerHTML={{ __html: course.detail }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speakers */}
        {speakers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <h2 className={`text-2xl md:text-3xl font-bold ${bgUrl ? "text-gray-100" : "text-gray-900"}`}>Speaker</h2>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
              {speakers.map((sp) => {
                const avatar = absUrl(sp.avatar_url || sp.image_url);
                const full = absUrl(sp.image_url || sp.avatar_url);
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setImgPreview(full)}
                    className="cursor-pointer group text-center focus:outline-none"
                    title="Click to View Image"
                  >
                    <div className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-white/80 shadow-lg overflow-hidden bg-white transition group-hover:scale-[1.02]">
                      <img src={avatar || "/speaker-placeholder.webp"} alt={sp.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`mt-3 font-semibold tracking-tight ${bgUrl ? "text-gray-100" : "text-indigo-900"}`}>{sp.name}</div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Cart Floating Action Button */}
        <CartFab />
      </div>

      {/* Popup รูปวิทยากร */}
      {imgPreview && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setImgPreview(null)} aria-hidden="true" />
          <div className="fixed inset-0 z-[70] grid place-items-center p-6 pointer-events-none">
            <div className="relative pointer-events-auto">
              <img src={imgPreview} alt="speaker" className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl" />
              <button
                className="cursor-pointer absolute top-3 right-3 rounded-full p-2 bg-white/90 text-gray-700 ring-1 ring-black/10 shadow-lg hover:bg-rose-500 hover:text-white transition"
                onClick={() => setImgPreview(null)}
                aria-label="Close"
                title="Close"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Sub component ---------- */
function InfoChip({ icon, title, text, href }) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Wrapper
      {...wrapperProps}
      className={`flex items-start gap-3 rounded-2xl px-4 py-4 bg-white border border-gray-200 shadow-sm ${href ? "transition hover:bg-gray-50" : ""
        }`}
    >
      <div className="text-xl mt-1 text-gray-500">{icon}</div>
      <div className="leading-tight">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="font-medium text-gray-900">{text}</div>
      </div>
    </Wrapper>
  );
}
