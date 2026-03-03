import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile } from "../firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        const refreshed = auth.currentUser;
        setUser(refreshed);
        const data = await getUserProfile(refreshed.uid);
        setProfile(data);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const language = profile?.language ?? "ru";
  const grade = profile?.grade ?? null;
  const emailVerified = user?.emailVerified ?? false;

  return (
    <AuthContext.Provider value={{ user, profile, language, grade, emailVerified, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);