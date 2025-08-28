// src/App.jsx
import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

// ---------- Auth & Account ----------
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
import MemberSection from "./components/login/MemberSection";
import AccountModal from "./components/login/AccountModal";

// ---------- Main ----------
import Navbar from "./components/main_menu/Navbar";
import Hero from "./components/main_menu/Hero";
import ConferenceCatalog from "./components/main_menu/ConferenceCatalog";
import IBLM from "./components/main_menu/IBLM";
import News from "./components/main_menu/News";
import Media from "./components/main_menu/Media";
import Partners from "./components/main_menu/Partners";
import Contact from "./components/main_menu/Contact";
import Footer from "./components/main_menu/Footer";

// ---------- Detail ----------
import About from "./components/detail_menu/About";
import CourseDetail from "./components/detail_menu/CourseDetailMain";
import NewsDetail from "./components/detail_menu/NewsDetail";
import NewsDetail_ID from "./components/detail_menu/NewsDetail_ID";
import MediaDetail from "./components/detail_menu/MediaDetail";
import MediaDetail_ID from "./components/detail_menu/MediaDetail_ID";

// ---------- Utils ----------
import { useUser } from "./contexts/UserContext";
import useScrollToSection from "./hooks/useScrollToSection";
import ScrollToTop from "./components/function/ScrollToTop";

/* ===== Overlay shell (ใช้ครอบคอมโพเนนต์ฟอร์ม ที่ไม่ใช่ modal ของตัวเอง) ===== */
function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
      {children}
    </div>
  );
}

/* ===== Landing sections ===== */
function MainContent() {
  useScrollToSection();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      {/* ส่ง prop กันเหนียว แม้ Navbar เวอร์ชันใหม่จะไม่ใช้ prop แล้วก็ตาม */}
      <Navbar
        onLoginClick={() =>
          navigate("/login", { state: { backgroundLocation: location } })
        }
        onAccountClick={() =>
          navigate("/account", { state: { backgroundLocation: location } })
        }
      />
      <Hero />
      <ConferenceCatalog />
      <IBLM />
      <News />
      <Media />
      <Partners />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  const { user, loginUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // ถ้ามี backgroundLocation แปลว่า route นี้ควรแสดงเป็น "ป็อปอัปซ้อนบนหน้าเดิม"
  const state =
    location.state && location.state.backgroundLocation ? location.state : null;

  // ===== Helper ปิดโมดัลอย่างฉลาด =====
  // มี backgroundLocation -> กลับไปหน้านั้นเป๊ะ ๆ (รวม query+hash)
  // ไม่มี -> กลับหน้าแรก "/"
  const bg = state?.backgroundLocation;
  const backgroundHref = bg ? `${bg.pathname}${bg.search}${bg.hash}` : "/";
  const closeModal = () => navigate(backgroundHref, { replace: true });

  // เวลาเปลี่ยนหน้าใน overlay (login <-> register <-> forgot) ให้คง backgroundLocation เดิมไว้เสมอ
  const switchInOverlay = (to) =>
    navigate(to, {
      replace: true,
      state: { backgroundLocation: bg || location },
    });

  // ล็อกสกอร์ลเมื่อเปิด overlay (เฉพาะ path ที่เป็น modal)
  useEffect(() => {
    const modalPaths = ["/login", "/register", "/forgot", "/member", "/account"];
    const opened =
      !!state?.backgroundLocation && modalPaths.includes(location.pathname);
    document.documentElement.classList.toggle("overflow-hidden", opened);
    document.body.classList.toggle("overflow-hidden", opened);
  }, [location.pathname, state?.backgroundLocation]);

  return (
    <>
      <ScrollToTop />

      {/* ชั้นหลัก: แสดงหน้าเดี่ยวปกติ (รวม "เข้าตรงลิงก์") */}
      <Routes location={state?.backgroundLocation || location}>
        {/* Home */}
        <Route path="/" element={<MainContent />} />

        {/* About */}
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          }
        />

        {/* Reset password (หน้าเดี่ยว) */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Course detail */}
        <Route
          path="/courses/:courseId"
          element={
            <>
              <Navbar />
              {/* ถ้า CourseDetail เดิมเคยใช้ setModal("login") ให้ปรับภายในไฟล์นั้นไปเรียก navigate("/login", { state:{ backgroundLocation: location } }) แทน */}
              <CourseDetail />
            </>
          }
        />

        {/* News */}
        <Route
          path="/news"
          element={
            <>
              <Navbar />
              <NewsDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/news/:id"
          element={
            <>
              <Navbar />
              <NewsDetail_ID />
              <Footer />
            </>
          }
        />

        {/* Videos */}
        <Route
          path="/videos"
          element={
            <>
              <Navbar />
              <MediaDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/videos/:id"
          element={
            <>
              <Navbar />
              <MediaDetail_ID />
              <Footer />
            </>
          }
        />

        {/* ---------- หน้าเดี่ยวสำหรับเข้าตรงลิงก์ ---------- */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <div className="min-h-[70vh] flex items-center justify-center py-10">
                <div className="w-[min(96vw,860px)]">
                  <Login
                    onClose={() => navigate("/")}
                    onLoginSuccess={(u) => {
                      loginUser(u);
                      navigate("/");
                    }}
                    onSwitchToRegister={() => navigate("/register")}
                    onSwitchToForgot={() => navigate("/forgot")}
                  />
                </div>
              </div>
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <div className="min-h-[70vh] flex items-center justify-center py-10">
                <div className="w-[min(96vw,860px)]">
                  <Register
                    onClose={() => navigate("/")}
                    onSwitchToLogin={() => navigate("/login")}
                  />
                </div>
              </div>
              <Footer />
            </>
          }
        />

        <Route
          path="/forgot"
          element={
            <>
              <Navbar />
              <div className="min-h-[70vh] flex items-center justify-center py-10">
                <div className="w-[min(96vw,860px)]">
                  <ForgotPassword
                    onClose={() => navigate("/")}
                    onSwitchToLogin={() => navigate("/login")}
                  />
                </div>
              </div>
              <Footer />
            </>
          }
        />

        {/* Member & Account (หน้าเดี่ยว): ถ้าไม่ล็อกอินส่งไป /login */}
        <Route
          path="/member"
          element={
            user ? (
              <>
                <Navbar />
                {/* คอมโพเนนต์นี้เป็น modal ของตัวเองอยู่แล้ว */}
                <MemberSection open onClose={() => navigate("/")} />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/account"
          element={
            user ? (
              <>
                <Navbar />
                {/* คอมโพเนนต์นี้เป็น modal ของตัวเองอยู่แล้ว */}
                <AccountModal open onClose={() => navigate("/")} />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {/* ชั้นบน: แสดงแบบ "ป็อปอัป" เฉพาะเมื่อมี backgroundLocation */}
      {state?.backgroundLocation && (
        <Routes>
          {/* Login overlay */}
          <Route
            path="/login"
            element={
              <Overlay onClose={closeModal}>
                <Login
                  onClose={closeModal}
                  onLoginSuccess={(u) => {
                    loginUser(u);
                    closeModal();
                  }}
                  onSwitchToRegister={() => switchInOverlay("/register")}
                  onSwitchToForgot={() => switchInOverlay("/forgot")}
                />
              </Overlay>
            }
          />

          {/* Register overlay */}
          <Route
            path="/register"
            element={
              <Overlay onClose={closeModal}>
                <Register
                  onClose={closeModal}
                  onSwitchToLogin={() => switchInOverlay("/login")}
                />
              </Overlay>
            }
          />

          {/* Forgot overlay */}
          <Route
            path="/forgot"
            element={
              <Overlay onClose={closeModal}>
                <ForgotPassword
                  onClose={closeModal}
                  onSwitchToLogin={() => switchInOverlay("/login")}
                />
              </Overlay>
            }
          />

          {/* Member overlay */}
          <Route
            path="/member"
            element={
              user ? (
                <MemberSection open onClose={closeModal} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Account overlay */}
          <Route
            path="/account"
            element={
              user ? (
                <AccountModal open onClose={closeModal} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      )}
    </>
  );
}
