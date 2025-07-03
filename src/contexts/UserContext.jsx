import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const updateUser = (newData) => setUser((prev) => ({ ...prev, ...newData }));
  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, updateUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
