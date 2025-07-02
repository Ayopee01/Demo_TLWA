import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import News from './components/News';
import Media from './components/Media';
import Partners from './components/Partners';
import RulesAndRegulations from './components/RulesAndRegulations';
import Contact from './components/Contact';
import Footer from './components/Footer';

// ให้รับ handleLogout ด้วย!
function MainContent({ setModal, user, handleLogout }) {
  return (
    <>
      {/* ส่ง onLogout ไป Navbar */}
      <Navbar onLoginClick={() => setModal("login")} user={user} onLogout={handleLogout} />
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
  const [modal, setModal] = useState(""); // "login" | "register" | "forgot"
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const handleLoginSuccess = (userObj) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
    setModal("");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            // ส่ง handleLogout เข้า MainContent
            <MainContent setModal={setModal} user={user} handleLogout={handleLogout} />
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      {/* Modal Popups */}
      {modal === "login" && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-md">
          <Login
            onClose={() => setModal("")}
            onSwitchToRegister={() => setModal("register")}
            onSwitchToForgot={() => setModal("forgot")}
            onLoginSuccess={handleLoginSuccess}
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
      {/* {user && <button onClick={handleLogout}>Logout</button>} */}
    </BrowserRouter>
  );
}

export default App;
