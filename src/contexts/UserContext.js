import { createContext, useContext, useState } from "react";

// 1. สร้าง context
const UserContext = createContext();

// 2. สร้าง Provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // อัปเดต user (เช่นหลังแก้ไข/สมัครสมาชิก/ล็อกอิน)
  const updateUser = (newData) => setUser((prev) => ({ ...prev, ...newData }));

  // สำหรับ login (set user ครั้งแรก)
  const loginUser = (userData) => setUser(userData);

  // สำหรับ logout
  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, updateUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. export hook ใช้เรียก context ง่ายๆ
export function useUser() {
  return useContext(UserContext);
}
