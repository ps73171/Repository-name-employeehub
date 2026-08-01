```jsx
import React from "react";

import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Employees from "../pages/Employees/Employees";
import Departments from "../pages/Departments/Departments";
import Profile from "../pages/Profile/Profile";


/*
 * =========================================
 * EmployeeHub - Application Routes
 * =========================================
 *
 * Public Routes:
 *
 * /login
 *
 *
 * Protected Routes:
 *
 * /dashboard
 * /employees
 * /departments
 * /profile
 */


/* =========================================
   Protected Route
   ========================================= */

function ProtectedRoute() {

  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();


  /* ---------------------------------------
     Authentication Loading
     --------------------------------------- */

  if (loading) {

    return (
      <div className="route-loading">
        Loading...
      </div>
    );

  }


  /* ---------------------------------------
     User Not Logged In
     --------------------------------------- */

  if (!user) {

    return (

      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />

    );

  }


  /* ---------------------------------------
     Authenticated User
     --------------------------------------- */

  return (
    <Outlet />
  );

}


/* =========================================
   Public Route
   ========================================= */

function PublicRoute() {

  const {
    user,
    loading,
  } = useAuth();


  /* ---------------------------------------
     Authentication Loading
     --------------------------------------- */

  if (loading) {

    return (
      <div className="route-loading">
        Loading...
      </div>
    );

  }


  /* ---------------------------------------
     Already Logged In
     --------------------------------------- */

  if (user) {

    return (

      <Navigate
        to="/dashboard"
        replace
      />

    );

  }


  /* ---------------------------------------
     Not Logged In
     --------------------------------------- */

  return (
    <Outlet />
  );

}


/* =========================================
   Application Routes
   ========================================= */

function AppRoutes() {

  return (

    <Routes>


      {/* =================================
          Public Routes
          ================================= */}

      <Route element={<PublicRoute />}>

        {/* Login */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

      </Route>


      {/* =================================
          Protected Routes
          ================================= */}

      <Route
        element={
          <ProtectedRoute />
        }
      >


        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />


        {/* Employees */}

        <Route
          path="/employees"
          element={
            <Employees />
          }
        />


        {/* Departments */}

        <Route
          path="/departments"
          element={
            <Departments />
          }
        />


        {/* Profile */}

        <Route
          path="/profile"
          element={
            <Profile />
          }
        />

      </Route>


      {/* =================================
          Default Route
          ================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />


      {/* =================================
          404 Route
          ================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>

  );

}


export default AppRoutes;
```
