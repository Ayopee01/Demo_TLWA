import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
import Benefits from "./components/main_menu/Benefits";
import News from "./components/main_menu/News";
import Media from "./components/main_menu/Media";
// import Partners from "./components/main_menu/Partners";
import RulesAndRegulations from "./components/main_menu/RulesAndRegulations";
import Contact from "./components/main_menu/Contact";
import Footer from "./components/main_menu/Footer";

// Detail Menu
import About from "./components/detail_menu/About";
import CourseDetail from "./components/detail_menu/CourseDetail";
import NewsDetail from "./components/detail_menu/NewsDetail";
import NewsDetail_ID from "./components/detail_menu/NewsDetail_ID";   // <-- Import ที่นี่

// Function
import { useUser } from "./contexts/UserContext";
import useScrollToSection from "./hooks/useScrollToSection";
import ScrollToTop from "./components/function/ScrollToTop";

// Advert/ใช้สำหรับมีปกวันสำคัญต่างๆ
// import Advert from "./components/advert/advert";

function MainContent({ setModal }) {
  useScrollToSection();
  return (
    <>
      <Navbar
        onLoginClick={() => setModal("login")}
        onAccountClick={() => setModal("account")}
      />
      <Hero />
      <ConferenceCatalog />
      <Benefits />
      <News />
      <Media />
      {/* <Partners /> */}
      <RulesAndRegulations />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  const [modal, setModal] = useState(""); // "login" | "register" | "forgot" | "account"
  const { user, loginUser } = useUser();
  const [showIntro, setShowIntro] = useState(true);

  const location = useLocation();
  const isHome = location.pathname === "/";

  // if (isHome && showIntro) {
  //   return <Advert onEnter={() => setShowIntro(false)} />;
  // }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<MainContent setModal={setModal} />} />

        {/* About page */}
        <Route
          path="/about"
          element={
            <>
              <Navbar
                onLoginClick={() => setModal("login")}
                onAccountClick={() => setModal("account")}
              />
              <About />
              <Footer />
            </>
          }
        />

        {/* Reset Password */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Course detail page */}
        <Route
          path="/courses/:typeId"
          element={
            <>
              <Navbar
                onLoginClick={() => setModal("login")}
                onAccountClick={() => setModal("account")}
              />
              <CourseDetail setModal={setModal} />
            </>
          }
        />

        {/* News List Page */}
        <Route
          path="/news"
          element={
            <>
              <Navbar
                onLoginClick={() => setModal("login")}
                onAccountClick={() => setModal("account")}
              />
              <NewsDetail />
              <Footer />
            </>
          }
        />

        {/* News Detail by ID Page */}
        <Route
          path="/news/:id"
          element={
            <>
              <Navbar
                onLoginClick={() => setModal("login")}
                onAccountClick={() => setModal("account")}
              />
              <NewsDetail_ID />
              <Footer />
            </>
          }
        />
      </Routes>

      {/* ===== Modal Overlays ===== */}
      {modal === "login" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <Login
            onClose={() => setModal("")}
            onLoginSuccess={loginUser}
            onSwitchToRegister={() => setModal("register")}
            onSwitchToForgot={() => setModal("forgot")}
          />
        </div>
      )}
      {modal === "register" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <Register
            onClose={() => setModal("")}
            onSwitchToLogin={() => setModal("login")}
          />
        </div>
      )}
      {modal === "forgot" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <ForgotPassword
            onClose={() => setModal("")}
            onSwitchToLogin={() => setModal("login")}
          />
        </div>
      )}
      {modal === "account" && user && (
        <AccountModal
          open={modal === "account"}
          onClose={() => setModal("")}
        />
      )}
    </>
  );
}

export default App;
