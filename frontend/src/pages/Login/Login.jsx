```jsx
import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

import "./Login.css";


/*
 * =========================================
 * EmployeeHub - Login Page
 * =========================================
 *
 * Features:
 *
 * - Username / Email login
 * - Password login
 * - Show / Hide password
 * - Remember me
 * - Login API through AuthContext
 * - Redirect after successful login
 * - Error handling
 */


/* -----------------------------------------
   Login Component
   ----------------------------------------- */

function Login() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /* ---------------------------------------
     Auth Context
     --------------------------------------- */

  const {
    user,
    login,
    loading: authLoading,
  } = useAuth();


  /* ---------------------------------------
     Form State
     --------------------------------------- */

  const [
    formData,
    setFormData,
  ] = useState({

    username: "",

    password: "",

    rememberMe: false,

  });


  /* ---------------------------------------
     UI State
     --------------------------------------- */

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* ---------------------------------------
     Redirect If Already Logged In
     --------------------------------------- */

  useEffect(() => {

    if (
      !authLoading &&
      user
    ) {

      const redirectPath =
        location.state
          ?.from
          ?.pathname ||
        "/dashboard";

      navigate(
        redirectPath,
        {
          replace: true,
        }
      );

    }

  }, [
    user,
    authLoading,
    navigate,
    location,
  ]);


  /* ---------------------------------------
     Handle Input Change
     --------------------------------------- */

  const handleChange =
    (event) => {

      const {
        name,
        value,
        type,
        checked,
      } = event.target;

      setFormData(
        (previous) => ({

          ...previous,

          [name]:
            type === "checkbox"
              ? checked
              : value,

        })
      );


      if (error) {
        setError("");
      }

    };


  /* ---------------------------------------
     Handle Login
     --------------------------------------- */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      /* Validate Username */

      if (
        !formData.username.trim()
      ) {

        setError(
          "Please enter your username or email."
        );

        return;

      }


      /* Validate Password */

      if (
        !formData.password
      ) {

        setError(
          "Please enter your password."
        );

        return;

      }


      try {

        setSubmitting(true);

        setError("");


        /*
         * AuthContext Login
         *
         * Backend authentication
         * will be handled by AuthContext.
         */

        await login(

          formData.username,

          formData.password,

          formData.rememberMe

        );


        /*
         * Redirect after login
         */

        const redirectPath =
          location.state
            ?.from
            ?.pathname ||
          "/dashboard";


        navigate(
          redirectPath,
          {
            replace: true,
          }
        );


      } catch (err) {

        console.error(
          "Login failed:",
          err
        );


        const message =
          err?.response
            ?.data
            ?.detail ||
          err?.response
            ?.data
            ?.message ||
          "Invalid username or password.";


        setError(
          message
        );


      } finally {

        setSubmitting(false);

      }

    };


  /* ---------------------------------------
     Loading State
     --------------------------------------- */

  if (authLoading) {

    return (

      <div className="login-page">

        <div className="login-loading">

          <Loader
            text="Checking authentication..."
          />

        </div>

      </div>

    );

  }


  /* ---------------------------------------
     Render
     --------------------------------------- */

  return (

    <div className="login-page">

      <div className="login-container">

        <div className="login-card">


          {/* =================================
              Logo
              ================================= */}

          <div className="login-logo">

            EH

          </div>


          {/* =================================
              Header
              ================================= */}

          <div className="login-header">

            <h1 className="login-title">

              Welcome to EmployeeHub

            </h1>


            <p className="login-subtitle">

              Sign in to manage your
              employees and organization.

            </p>

          </div>


          {/* =================================
              Error Message
              ================================= */}

          {error && (

            <div
              className="login-error"
              role="alert"
            >

              <span>
                ⚠
              </span>

              <span>
                {error}
              </span>

            </div>

          )}


          {/* =================================
              Login Form
              ================================= */}

          <form
            className="login-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* Username / Email */}

            <div className="login-form-group">

              <label
                htmlFor="username"
              >
                Username or Email
              </label>


              <input
                id="username"
                type="text"
                name="username"
                className="login-input"
                placeholder="Enter username or email"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                autoComplete="username"
                disabled={
                  submitting
                }
                required
              />

            </div>


            {/* Password */}

            <div className="login-form-group">

              <label
                htmlFor="password"
              >
                Password
              </label>


              <div className="login-input-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  className="login-input login-password-input"
                  placeholder="Enter your password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="current-password"
                  disabled={
                    submitting
                  }
                  required
                />


                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword
                    ? "🙈"
                    : "👁"}

                </button>

              </div>

            </div>


            {/* =================================
                Login Options
                ================================= */}

            <div className="login-options">


              {/* Remember Me */}

              <label className="login-remember">

                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={
                    formData.rememberMe
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    submitting
                  }
                />

                <span>
                  Remember me
                </span>

              </label>


              {/* Forgot Password */}

              <Link
                to="/forgot-password"
                className="login-forgot"
              >
                Forgot password?
              </Link>

            </div>


            {/* =================================
                Submit Button
                ================================= */}

            <button
              type="submit"
              className="login-submit"
              disabled={
                submitting
              }
            >

              {submitting ? (

                <span className="login-loading">

                  <span>
                    Signing in...
                  </span>

                </span>

              ) : (

                "Sign In"

              )}

            </button>

          </form>


          {/* =================================
              Footer
              ================================= */}

          <div className="login-footer">

            Don't have an account?

            {" "}

            <Link
              to="/register"
            >
              Create an account
            </Link>

          </div>


          {/* =================================
              Security Information
              ================================= */}

          <div className="login-security">

            <span>
              🔒
            </span>

            <span>
              Your connection is secure
            </span>

          </div>

        </div>

      </div>

    </div>

  );

}


export default Login;
```

