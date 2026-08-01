```javascript
import {
  useContext,
} from "react";

import AuthContext from "../context/AuthContext";


/*
 * =========================================
 * EmployeeHub - useAuth Custom Hook
 * =========================================
 *
 * This hook provides easy access to:
 *
 * - Current logged-in user
 * - Authentication status
 * - Login function
 * - Logout function
 * - Authentication loading state
 *
 * Usage:
 *
 * const {
 *   user,
 *   isAuthenticated,
 *   login,
 *   logout,
 *   loading,
 * } = useAuth();
 */


/* -----------------------------------------
   Custom Authentication Hook
   ----------------------------------------- */

function useAuth() {
  const context =
    useContext(
      AuthContext
    );


  /* ---------------------------------------
     Validate Auth Context
     --------------------------------------- */

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  /* ---------------------------------------
     Return Authentication Context
     --------------------------------------- */

  return context;
}


export default useAuth;
```
