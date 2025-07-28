// // src/App.jsx
// import { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import ForgotPassword from "./components/ForgotPassword";
// import ResetPassword from "./components/ResetPassword";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import ConferenceCatalog from "./components/ConferenceCatalog";
// import Benefits from "./components/Benefits";
// import News from "./components/News";
// import Media from "./components/Media";
// import Partners from "./components/Partners";
// import RulesAndRegulations from "./components/RulesAndRegulations";
// import Contact from "./components/Contact";
// import Footer from "./components/Footer";
// import AccountModal from "./components/AccountModal";
// import { useUser } from "./contexts/UserContext";
// import CourseDetail from "./components/CourseDetail";
// import useScrollToSection from "./hooks/useScrollToSection"; // สำคัญ

// function MainContent({ setModal }) {
//   useScrollToSection(); // ให้ landing page scroll section ได้

//   return (
//     <>
//       <Navbar
//         onLoginClick={() => setModal("login")}
//         onAccountClick={() => setModal("account")}
//       />
//       <Hero />
//       <ConferenceCatalog />
//       <Benefits />
//       <News />
//       <Media />
//       <Partners />
//       <RulesAndRegulations />
//       <Contact />
//       <Footer />
//     </>
//   );
// }

// function App() {
//   const [modal, setModal] = useState(""); // "login" | "register" | "forgot" | "account"
//   const { user, loginUser } = useUser();

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Landing page */}
//         <Route path="/" element={<MainContent setModal={setModal} />} />

//         {/* Reset Password page */}
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* Course detail page */}
//         <Route path="/courses/:typeId" element={
//           <>
//             <Navbar
//               onLoginClick={() => setModal("login")}
//               onAccountClick={() => setModal("account")}
//             />
//             <CourseDetail setModal={setModal} />
//           </>
//         } />
//       </Routes>

//       {/* ===== Modal Overlays ===== */}
//       {modal === "login" && (
//         <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
//           <Login
//             onClose={() => setModal("")}
//             onLoginSuccess={loginUser}
//             onSwitchToRegister={() => setModal("register")}
//             onSwitchToForgot={() => setModal("forgot")}
//           />
//         </div>
//       )}
//       {modal === "register" && (
//         <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
//           <Register
//             onClose={() => setModal("")}
//             onSwitchToLogin={() => setModal("login")}
//           />
//         </div>
//       )}
//       {modal === "forgot" && (
//         <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
//           <ForgotPassword
//             onClose={() => setModal("")}
//             onSwitchToLogin={() => setModal("login")}
//           />
//         </div>
//       )}
//       {modal === "account" && user && (
//         <AccountModal
//           open={modal === "account"}
//           onClose={() => setModal("")}
//         />
//       )}
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ConferenceCatalog from "./components/ConferenceCatalog";
import Benefits from "./components/Benefits";
import News from "./components/News";
import Media from "./components/Media";
import Partners from "./components/Partners";
import RulesAndRegulations from "./components/RulesAndRegulations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AccountModal from "./components/AccountModal";
import { useUser } from "./contexts/UserContext";
import CourseDetail from "./components/CourseDetail";
import useScrollToSection from "./hooks/useScrollToSection";

// ใช้ตอนมีวันสำคัญ
import Advert from "./components/advert";

function MainContent({ setModal }) {
  useScrollToSection(); // ให้ landing page scroll section ได้

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
      <Partners />
      <RulesAndRegulations />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  const [modal, setModal] = useState(""); // "login" | "register" | "forgot" | "account"
  const { user, loginUser } = useUser();

  // NOTE: แสดง advert intro วันเฉลิม
  const [showIntro, setShowIntro] = useState(true); // 

  return (
    <BrowserRouter>
      {/* NOTE: เงื่อนไขแสดง advert.jsx ชั่วคราว (Intro) */}
      {showIntro ? (
        <Advert onEnter={() => setShowIntro(false)} />
      ) : (
        <>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<MainContent setModal={setModal} />} />

            {/* Reset Password page */}
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
      )}
    </BrowserRouter>
  );
}

export default App;

