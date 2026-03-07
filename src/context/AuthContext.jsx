import { createContext, useContext, useEffect, useState } from "react";
import { clientAuth } from "../../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = clientAuth.onIdTokenChanged(async (user) => {
      // setUser(user);
      const tokenResult = user ? await user.getIdTokenResult() : null;
      tokenResult ? setUser({ ...user, claims: tokenResult?.claims }) : setUser(null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
