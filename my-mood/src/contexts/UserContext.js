import { createContext, useContext, useEffect, useState } from "react";

import { getUserInfo } from "../adapters/api-adapter.js";
import { getBaseUrl, getToken } from "../utils/storage.js";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    function() {
      async function loadUserInfo() {
        try {
          const baseUrl = await getBaseUrl();
          const token = await getToken();

          if (baseUrl && token) {
            const result = await getUserInfo({ baseUrl, token });
            if (result.success) {
              setUser(result.data);
            }
          }
        } catch (_error) {
          // Error loading user info - user will remain null
        } finally {
          setLoading(false);
        }
      }

      loadUserInfo();
    },
    [], // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois après le premier rendu
  );

  async function refreshUser() {
    // Ensure consumers can show a loading state while we refresh
    setLoading(true);
    try {
      const baseUrl = await getBaseUrl();
      const token = await getToken();

      if (baseUrl && token) {
        const result = await getUserInfo({ baseUrl, token });
        if (result.success) {
          setUser(result.data);
        }
      }
    } catch (_error) {
      // Error refreshing user info
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
