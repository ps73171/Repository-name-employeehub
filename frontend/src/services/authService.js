```javascript
/*
 * =========================================
 * EmployeeHub - Authentication Service
 * =========================================
 *
 * Handles:
 *
 * - User Login
 * - User Logout
 * - Get Current User
 * - Update User Profile
 * - Change Password
 *
 * API calls are handled through:
 *
 * frontend/src/api/api.js
 */


/* -----------------------------------------
   API Client
   ----------------------------------------- */

import api from "../api/api";


/* =========================================
   Login User
   ========================================= */

const login = async (
  username,
  password
) => {

  /*
   * FastAPI OAuth2PasswordRequestForm
   * generally expects form-data.
   */

  const formData =
    new URLSearchParams();


  formData.append(
    "username",
    username
  );

  formData.append(
    "password",
    password
  );


  const response =
    await api.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );


  /*
   * Expected response:
   *
   * {
   *   access_token: "...",
   *   token_type: "bearer"
   * }
   */


  if (
    response.data?.access_token
  ) {

    localStorage.setItem(
      "access_token",
      response.data.access_token
    );

  }


  return response.data;

};


/* =========================================
   Logout User
   ========================================= */

const logout = () => {

  /*
   * Remove authentication token
   */

  localStorage.removeItem(
    "access_token"
  );


  /*
   * Remove any stored user data
   */

  localStorage.removeItem(
    "user"
  );

};


/* =========================================
   Get Current User
   ========================================= */

const getCurrentUser =
  async () => {

    const response =
      await api.get(
        "/auth/me"
      );


    /*
     * Store latest user information
     */

    if (response.data) {

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data
        )
      );

    }


    return response.data;

  };


/* =========================================
   Get Stored User
   ========================================= */

const getStoredUser = () => {

  const user =
    localStorage.getItem(
      "user"
    );


  if (!user) {

    return null;

  }


  try {

    return JSON.parse(
      user
    );

  } catch (error) {

    console.error(
      "Unable to parse stored user:",
      error
    );


    localStorage.removeItem(
      "user"
    );


    return null;

  }

};


/* =========================================
   Update User Profile
   ========================================= */

const updateProfile =
  async (
    profileData
  ) => {

    const response =
      await api.put(
        "/users/me",
        profileData
      );


    /*
     * Update locally stored user
     */

    if (response.data) {

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data
        )
      );

    }


    return response.data;

  };


/* =========================================
   Change Password
   ========================================= */

const changePassword =
  async (
    currentPassword,
    newPassword
  ) => {

    const response =
      await api.post(
        "/auth/change-password",
        {
          current_password:
            currentPassword,

          new_password:
            newPassword,
        }
      );


    return response.data;

  };


/* =========================================
   Refresh Access Token
   ========================================= */

const refreshToken =
  async () => {

    const response =
      await api.post(
        "/auth/refresh"
      );


    if (
      response.data?.access_token
    ) {

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

    }


    return response.data;

  };


/* =========================================
   Check Authentication
   ========================================= */

const isAuthenticated = () => {

  return Boolean(
    localStorage.getItem(
      "access_token"
    )
  );

};


/* =========================================
   Export Service
   ========================================= */

const authService = {

  login,

  logout,

  getCurrentUser,

  getStoredUser,

  updateProfile,

  changePassword,

  refreshToken,

  isAuthenticated,

};


export default authService;
```
