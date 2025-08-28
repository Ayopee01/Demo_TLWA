// src/App.jsx
import { useState, useEffect } from "react";
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

/* ===== Overlay shell สำหรับฟอร์มที่ไม่ใช่คอมโพเนนต์โมดัลของตัวเอง ===== */
function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
        {children}
      </div>
  );
}

/* ===== Landing sections ===== */
function MainContent({ openModalRoute }) {
  useScrollToSection();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <Navbar
        // กันเหนียว: ถ้า Navbar ยังเรียก prop เดิม จะพาไปแบบ route-modal เช่นกัน
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

  // ถ้ามี backgroundLocation = เปิดแบบป็อปอัป
  const state = location.state && location.state.backgroundLocation
    ? location.state
    : null;

  // ป้องกันการเลื่อนพื้นหลังตอนเปิด overlay (เฉพาะ route-modal)
  useEffect(() => {
    const modalPaths = ["/login", "/register", "/forgot", "/member", "/account"];
    const opened = state?.backgroundLocation && modalPaths.includes(location.pathname);
    document.documentElement.classList.toggle("overflow-hidden", opened);
    document.body.classList.toggle("overflow-hidden", opened);
  }, [location.pathname, state?.backgroundLocation]);

  return (
    <>
      <ScrollToTop />

      {/* ชั้นหลัก: แสดงหน้าเดี่ยวปกติ */}
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

        {/* ---------- หน้าเดี่ยว (เข้าตรงลิงก์) ---------- */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <div className="min-h-[70vh] flex items-center justify-center py-10">
                <div className="w-[min(96vw,860px)]">
                  <Login
                    onClose={() => navigate("/")}
                    onLoginSuccess={loginUser}
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

        {/* Member & Account: ถ้าไม่ล็อกอินส่งไป /login */}
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

      {/* ชั้นบน: แสดงแบบป็อปอัปเมื่อมี backgroundLocation */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={
              <Overlay onClose={() => navigate(-1)}>
                <Login
                  onClose={() => navigate(-1)}
                  onLoginSuccess={(u) => {
                    loginUser(u);
                    navigate(-1);
                  }}
                  onSwitchToRegister={() =>
                    navigate("/register", {
                      replace: true,
                      state: { backgroundLocation: state.backgroundLocation },
                    })
                  }
                  onSwitchToForgot={() =>
                    navigate("/forgot", {
                      replace: true,
                      state: { backgroundLocation: state.backgroundLocation },
                    })
                  }
                />
              </Overlay>
            }
          />

          <Route
            path="/register"
            element={
              <Overlay onClose={() => navigate(-1)}>
                <Register
                  onClose={() => navigate(-1)}
                  onSwitchToLogin={() =>
                    navigate("/login", {
                      replace: true,
                      state: { backgroundLocation: state.backgroundLocation },
                    })
                  }
                />
              </Overlay>
            }
          />

          <Route
            path="/forgot"
            element={
              <Overlay onClose={() => navigate(-1)}>
                <ForgotPassword
                  onClose={() => navigate(-1)}
                  onSwitchToLogin={() =>
                    navigate("/login", {
                      replace: true,
                      state: { backgroundLocation: state.backgroundLocation },
                    })
                  }
                />
              </Overlay>
            }
          />

          {/* Member & Account ใช้ modal ของตัวเอง (ไม่ต้องซ้อน Overlay อีกชั้น) */}
          <Route
            path="/member"
            element={
              user ? (
                <MemberSection open onClose={() => navigate(-1)} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/account"
            element={
              user ? (
                <AccountModal open onClose={() => navigate(-1)} />
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
