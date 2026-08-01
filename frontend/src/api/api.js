```javascript
import axios from "axios";

/*
 * =========================================
 * EmployeeHub - API Client
 * =========================================
 *
 * This file is responsible for:
 *
 * 1. Creating a central Axios instance
 * 2. Connecting frontend with backend API
 * 3. Automatically attaching JWT token
 * 4. Handling common API errors
 * 5. Handling unauthorized sessions
 */


/* -----------------------------------------
   Backend API Base URL
   ----------------------------------------- */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1";


/* -----------------------------------------
   Create Axios Instance
   ----------------------------------------- */

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});


/* -----------------------------------------
   Request Interceptor
   -----------------------------------------
   
   Every API request will pass through here.
   
   JWT token stored in localStorage will be
   automatically added to Authorization header.
*/

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/* -----------------------------------------
   Response Interceptor
   -----------------------------------------
   
   Handles common API responses and errors.
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    /* -------------------------------------
       Unauthorized - Token Expired
       ------------------------------------- */

    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user"
      );

      /*
       * Redirect user to login page.
       */

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }
    }


    /* -------------------------------------
       Forbidden
       ------------------------------------- */

    if (
      error.response?.status === 403
    ) {
      console.error(
        "Access denied. You do not have permission."
      );
    }


    /* -------------------------------------
       Server Error
       ------------------------------------- */

    if (
      error.response?.status >= 500
    ) {
      console.error(
        "Server error. Please try again later."
      );
    }


    return Promise.reject(
      error
    );
  }
);


/* -----------------------------------------
   Export API Client
   ----------------------------------------- */

export default api;
```
