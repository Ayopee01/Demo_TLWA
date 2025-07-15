import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  // --- โหลด user จาก localStorage ครั้งแรก ---
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // --- Sync ทุกครั้ง user เปลี่ยน จะ update localStorage อัตโนมัติ ---
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // --- Login ด้วย userObj เต็ม ๆ สด ๆ ---
  const loginUser = (userObj) => setUser(userObj);

  // --- Update User: รับ userObj เต็ม ๆ สด ๆ จาก backend เท่านั้น! ---
  const updateUser = (userObj) => setUser(userObj);

  // --- Logout: เคลียร์หมดจด ทั้ง user และ memberData (if any) ---
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("memberData_")) localStorage.removeItem(k);
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

// --- Hook ใช้งาน context นี้ในทุกหน้า ---
export function useUser() {
  return useContext(UserContext);
}

