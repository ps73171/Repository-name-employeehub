```jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";


/*
 * =========================================
 * EmployeeHub - Authentication Context
 * =========================================
 *
 * Responsibilities:
 *
 * 1. Store authenticated user
 * 2. Store JWT access token
 * 3. Handle login
 * 4. Handle logout
 * 5. Restore session after page refresh
 * 6. Provide authentication state globally
 */


/* -----------------------------------------
   Create Authentication Context
   ----------------------------------------- */

const AuthContext =
  createContext(null);


/* -----------------------------------------
   Auth Provider
   ----------------------------------------- */

export function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);


  /* ---------------------------------------
     Restore Authentication Session
     --------------------------------------- */

  useEffect(() => {
    const restoreSession =
      () => {
        try {
          const token =
            localStorage.getItem(
              "access_token"
            );

          const storedUser =
            localStorage.getItem(
              "user"
            );

          if (
            token &&
            storedUser
          ) {
            const parsedUser =
              JSON.parse(
                storedUser
              );

            setUser(
              parsedUser
            );

            setIsAuthenticated(
              true
            );
          }
        } catch (error) {
          console.error(
            "Failed to restore authentication session:",
            error
          );

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user"
          );

          setUser(null);

          setIsAuthenticated(
            false
          );
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, []);


  /* ---------------------------------------
     Login
     --------------------------------------- */

  const login = async (
    username,
    password
  ) => {
    try {
      setLoading(true);

      const response =
        await authService.login(
          username,
          password
        );

      const {
        access_token,
        user: loggedInUser,
      } = response;

      localStorage.setItem(
        "access_token",
        access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          loggedInUser
        )
      );

      setUser(
        loggedInUser
      );

      setIsAuthenticated(
        true
      );

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      setUser(null);

      setIsAuthenticated(
        false
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };


  /* ---------------------------------------
     Logout
     --------------------------------------- */

  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

    setIsAuthenticated(
      false
    );
  };


  /* ---------------------------------------
     Authentication Context Value
     --------------------------------------- */

  const contextValue =
    useMemo(
      () => ({
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }),
      [
        user,
        loading,
        isAuthenticated,
      ]
    );


  /* ---------------------------------------
     Render Provider
     --------------------------------------- */

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}


/* -----------------------------------------
   Custom Auth Hook
   ----------------------------------------- */

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}


export default AuthContext;
```
