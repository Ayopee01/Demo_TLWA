// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

// --------------------- Components ---------------------
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
import AccountModal from "./components/login/AccountModal";

// Main Menu
import Navbar from "./components/main_menu/Navbar";
import Hero from "./components/main_menu/Hero";
import ConferenceCatalog from "./components/main_menu/ConferenceCatalog";
import IBLM from "./components/main_menu/IBLM";
// import Benefits from "./components/main_menu/Benefits";
import News from "./components/main_menu/News";
import Media from "./components/main_menu/Media";
import Partners from "./components/main_menu/Partners";
// import RulesAndRegulations from "./components/main_menu/RulesAndRegulations";
import Contact from "./components/main_menu/Contact";
import Footer from "./components/main_menu/Footer";

// Detail Menu
import About from "./components/detail_menu/About";
import CourseDetail from "./components/detail_menu/CourseDetailMain";
import NewsDetail from "./components/detail_menu/NewsDetail";
import NewsDetail_ID from "./components/detail_menu/NewsDetail_ID";
import MediaDetail from "./components/detail_menu/MediaDetail";
import MediaDetail_ID from "./components/detail_menu/MediaDetail_ID";

// Function
import { useUser } from "./contexts/UserContext";
import useScrollToSection from "./hooks/useScrollToSection";
import ScrollToTop from "./components/function/ScrollToTop";

// -----------------------------------------------------
// หน้าหลัก (รวม sections) — ส่ง setModalFromUrl ให้ Navbar เรียกเปิด popup ได้
// -----------------------------------------------------
function MainContent({ setModalFromUrl }) {
  useScrollToSection();
  return (
    <>
      <Navbar
        onLoginClick={() => setModalFromUrl("login")}
        onAccountClick={() => setModalFromUrl("account")}
      />
      <Hero />
      <ConferenceCatalog />
      <IBLM />
      {/* <Benefits /> */}
      <News />
      <Media />
      <Partners />
      {/* <RulesAndRegulations /> */}
      <Contact />
      <Footer />
    </>
  );
}

const VALID_MODALS = new Set(["login", "register", "forgot", "account", "reset"]);

export default function App() {
  const { user, loginUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ----- modal ที่ควบคุมด้วย URL -----
  const modalFromUrl = useMemo(() => {
    const m = (searchParams.get("modal") || "").toLowerCase();
    return VALID_MODALS.has(m) ? m : "";
  }, [searchParams]);

  const tokenFromUrl = searchParams.get("token") || "";

  // ถ้า modal=account แต่ยังไม่ล็อกอิน ให้เด้งไป login
  useEffect(() => {
    if (modalFromUrl === "account" && !user) {
      setModalFromUrl("login");
    }
  }, [modalFromUrl, user]); // eslint-disable-line

  // จัดการ scroll lock ตอนเปิด/ปิด popup
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    if (modalFromUrl) el.style.overflow = "hidden";
    else el.style.overflow = prev || "";
    return () => {
      el.style.overflow = prev || "";
    };
  }, [modalFromUrl]);

  // ฟังก์ชันแก้ search params ให้เปิด/ปิด popup ผ่าน URL
  const setModalFromUrl = (value, { token } = {}) => {
    const params = new URLSearchParams(location.search);
    if (value && VALID_MODALS.has(value)) {
      params.set("modal", value);
      if (value === "reset" && token) params.set("token", token);
      else params.delete("token");
    } else {
      params.delete("modal");
      params.delete("token");
    }
    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
        hash: location.hash,
      },
      { replace: false }
    );
  };

  // === ตัวช่วย render Navbar ซ้ำในหลายหน้า ===
  const withNav = (children) => (
    <>
      <Navbar
        onLoginClick={() => setModalFromUrl("login")}
        onAccountClick={() => setModalFromUrl("account")}
      />
      {children}
      <Footer />
    </>
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<MainContent setModalFromUrl={setModalFromUrl} />} />

        {/* About page */}
        <Route path="/about" element={withNav(<About />)} />

        {/* Reset Password (เพจเดิม) — ลิงก์จากอีเมลยังใช้เส้นทางนี้ได้ตามปกติ */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Course detail page */}
        <Route
          path="/courses/:courseId"
          element={
            <>
              <Navbar
                onLoginClick={() => setModalFromUrl("login")}
                onAccountClick={() => setModalFromUrl("account")}
              />
              <CourseDetail setModal={setModalFromUrl} />
            </>
          }
        />

        {/* News Detail Page */}
        <Route path="/news" element={withNav(<NewsDetail />)} />

        {/* News Detail by ID Page */}
        <Route path="/news/:id" element={withNav(<NewsDetail_ID />)} />

        {/* MediaDetail */}
        <Route path="/videos" element={withNav(<MediaDetail />)} />

        {/* MediaDetail by ID Page */}
        <Route path="/videos/:id" element={withNav(<MediaDetail_ID />)} />
      </Routes>

      {/* ===== Modal Overlays (ควบคุมด้วย ?modal=...) ===== */}
      {modalFromUrl === "login" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <Login
            onClose={() => setModalFromUrl("")}
            onLoginSuccess={loginUser}
            onSwitchToRegister={() => setModalFromUrl("register")}
            onSwitchToForgot={() => setModalFromUrl("forgot")}
          />
        </div>
      )}

      {modalFromUrl === "register" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <Register
            onClose={() => setModalFromUrl("")}
            onSwitchToLogin={() => setModalFromUrl("login")}
          />
        </div>
      )}

      {modalFromUrl === "forgot" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <ForgotPassword
            onClose={() => setModalFromUrl("")}
            onSwitchToLogin={() => setModalFromUrl("login")}
          />
        </div>
      )}

      {/* Reset แบบป็อปอัปผ่าน ?modal=reset&token=... (เลือกใช้ได้ควบคู่กับเพจ /reset-password) */}
      {modalFromUrl === "reset" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          {/* ส่ง token ผ่าน props ถ้า component รองรับ; ถ้าไม่รองรับก็อ่านจาก URL ในตัว component ได้เช่นกัน */}
          <ResetPassword token={tokenFromUrl} onClose={() => setModalFromUrl("")} />
        </div>
      )}

      {modalFromUrl === "account" && user && (
        <AccountModal open onClose={() => setModalFromUrl("")} />
      )}
    </>
  );
}
