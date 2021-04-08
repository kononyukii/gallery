import React, { useState, useContext, createContext } from "react";

const authContext = createContext();
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}> {children} </authContext.Provider>;
}
export const useAuth = () => useContext(authContext);

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const signin = (cb) => {
    setUser("user");
    cb();
  };

  return {
    user,
    signin,
  };
}
