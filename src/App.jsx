import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import News from "./components/News";
import Media from "./components/Media";
import Partners from "./components/Partners";
import RulesAndRegulations from "./components/RulesAndRegulations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AccountModal from "./components/AccountModal";
import { useUser } from "./contexts/UserContext";

function MainContent({ setModal }) {
  return (
    <>
      <Navbar onLoginClick={() => setModal("login")} onAccountClick={() => setModal("account")} />
      <Hero />
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
  const { user, loginUser, logoutUser, updateUser } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainContent setModal={setModal} />
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {/* Login Modal */}
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
      {/* Register Modal */}
      {modal === "register" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <Register
            onClose={() => setModal("")}
            onSwitchToLogin={() => setModal("login")}
          />
        </div>
      )}
      {/* Forgot Password Modal */}
      {modal === "forgot" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <ForgotPassword
            onClose={() => setModal("")}
            onSwitchToLogin={() => setModal("login")}
          />
        </div>
      )}
      {/* Account Modal */}
      {modal === "account" && user && (
        <AccountModal
          open={modal === "account"}
          onClose={() => setModal("")}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
