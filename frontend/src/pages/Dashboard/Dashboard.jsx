```jsx
import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";

import "./Dashboard.css";


/*
 * =========================================
 * EmployeeHub - Dashboard
 * =========================================
 *
 * Dashboard Features:
 *
 * - Welcome message
 * - Employee statistics
 * - Active employees
 * - Departments
 * - Recent employees
 * - Department overview
 * - Quick actions
 *
 * API integration can be connected
 * when dashboard API is available.
 */


/* -----------------------------------------
   Initial Dashboard Data
   ----------------------------------------- */

const initialStats = {
  totalEmployees: 0,
  activeEmployees: 0,
  inactiveEmployees: 0,
  totalDepartments: 0,
};


/* -----------------------------------------
   Dashboard Component
   ----------------------------------------- */

function Dashboard() {
  const {
    user,
  } = useAuth();

  const [
    stats,
    setStats,
  ] = useState(
    initialStats
  );

  const [
    recentEmployees,
    setRecentEmployees,
  ] = useState([]);

  const [
    departments,
    setDepartments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);


  /* ---------------------------------------
     Load Dashboard Data
     --------------------------------------- */

  useEffect(() => {
    const loadDashboardData =
      async () => {
        try {
          setLoading(true);

          setError(null);

          /*
           * TODO:
           *
           * Connect dashboard APIs here.
           *
           * Example:
           *
           * const response =
           * await dashboardService
           *   .getDashboardStats();
           *
           * setStats(
           *   response.data
           * );
           */


          /*
           * Temporary empty data.
           *
           * This will be replaced by
           * real backend API response.
           */

          setStats({
            totalEmployees: 0,
            activeEmployees: 0,
            inactiveEmployees: 0,
            totalDepartments: 0,
          });

          setRecentEmployees([]);

          setDepartments([]);
        } catch (err) {
          console.error(
            "Failed to load dashboard data:",
            err
          );

          setError(
            "Unable to load dashboard data."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboardData();
  }, []);


  /* ---------------------------------------
     Loading State
     --------------------------------------- */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader
          size="medium"
          text="Loading dashboard..."
        />
      </div>
    );
  }


  /* ---------------------------------------
     Error State
     --------------------------------------- */

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }


  /* ---------------------------------------
     Render Dashboard
     --------------------------------------- */

  return (
    <div className="dashboard-page">

      {/* =================================
          Dashboard Header
          ================================= */}

      <div className="dashboard-header">

        <div className="dashboard-header-content">

          <h1 className="dashboard-title">
            Dashboard
          </h1>

          <p className="dashboard-welcome">
            Welcome back,
            {" "}
            <strong>
              {user?.username ||
                "User"}
            </strong>
            !
            {" "}
            Here's what's happening
            with your organization.
          </p>

        </div>


        <div className="dashboard-actions">

          <Link
            to="/employees"
            className="btn btn-primary"
          >
            Add Employee
          </Link>

        </div>

      </div>


      {/* =================================
          Statistics Cards
          ================================= */}

      <div className="dashboard-stats">

        {/* Total Employees */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Total Employees
            </p>

            <h2 className="dashboard-stat-value">
              {stats.totalEmployees}
            </h2>

          </div>

          <div className="dashboard-stat-icon">
            👥
          </div>

        </div>


        {/* Active Employees */}

        <div className="dashboard-stat-card success">

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Active Employees
            </p>

            <h2 className="dashboard-stat-value">
              {stats.activeEmployees}
            </h2>

          </div>

          <div className="dashboard-stat-icon">
            ✓
          </div>

        </div>


        {/* Inactive Employees */}

        <div className="dashboard-stat-card danger">

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Inactive Employees
            </p>

            <h2 className="dashboard-stat-value">
              {stats.inactiveEmployees}
            </h2>

          </div>

          <div className="dashboard-stat-icon">
            !
          </div>

        </div>


        {/* Departments */}

        <div className="dashboard-stat-card warning">

          <div className="dashboard-stat-content">

            <p className="dashboard-stat-label">
              Departments
            </p>

            <h2 className="dashboard-stat-value">
              {stats.totalDepartments}
            </h2>

          </div>

          <div className="dashboard-stat-icon">
            #
          </div>

        </div>

      </div>


      {/* =================================
          Dashboard Content
          ================================= */}

      <div className="dashboard-content">

        {/* =================================
            Recent Employees
            ================================= */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <h2 className="dashboard-card-title">
              Recent Employees
            </h2>

            <Link
              to="/employees"
              className="dashboard-card-link"
            >
              View All
            </Link>

          </div>


          <div className="dashboard-card-body">

            {recentEmployees.length ===
            0 ? (

              <div className="dashboard-empty">

                <div className="empty-state-icon">
                  👤
                </div>

                <h3>
                  No Employees Found
                </h3>

                <p>
                  Add your first employee
                  to see them here.
                </p>

              </div>

            ) : (

              <div className="recent-employees">

                {recentEmployees.map(
                  (employee) => (
                    <div
                      className="recent-employee"
                      key={
                        employee.id
                      }
                    >

                      <div className="employee-avatar">
                        {employee.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div className="employee-info">

                        <p className="employee-name">
                          {employee.name}
                        </p>

                        <p className="employee-role">
                          {employee.position ||
                            "Employee"}
                        </p>

                      </div>

                      <div className="employee-status">

                        <span
                          className={
                            employee.is_active
                              ? "status-badge status-active"
                              : "status-badge status-inactive"
                          }
                        >
                          {employee.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </div>


        {/* =================================
            Department Overview
            ================================= */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <h2 className="dashboard-card-title">
              Departments
            </h2>

            <Link
              to="/departments"
              className="dashboard-card-link"
            >
              View All
            </Link>

          </div>


          <div className="dashboard-card-body">

            {departments.length ===
            0 ? (

              <div className="dashboard-empty">

                <div className="empty-state-icon">
                  #
                </div>

                <h3>
                  No Departments
                </h3>

                <p>
                  Departments will appear
                  here once created.
                </p>

              </div>

            ) : (

              <div className="department-list">

                {departments.map(
                  (department) => (
                    <div
                      className="department-item"
                      key={
                        department.id
                      }
                    >

                      <div className="department-header">

                        <span className="department-name">
                          {department.name}
                        </span>

                        <span className="department-count">
                          {
                            department.employee_count
                          }
                          {" "}
                          Employees
                        </span>

                      </div>

                      <div className="progress-container">

                        <div
                          className="progress-bar"
                          style={{
                            width: `${Math.min(
                              department.percentage ||
                                0,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>


      {/* =================================
          Quick Actions
          ================================= */}

      <div className="dashboard-card">

        <div className="dashboard-card-header">

          <h2 className="dashboard-card-title">
            Quick Actions
          </h2>

        </div>


        <div className="dashboard-card-body">

          <div className="quick-actions">

            <Link
              to="/employees"
              className="quick-action"
            >
              <span className="quick-action-icon">
                👥
              </span>

              <span className="quick-action-label">
                Manage Employees
              </span>
            </Link>


            <Link
              to="/departments"
              className="quick-action"
            >
              <span className="quick-action-icon">
                #
              </span>

              <span className="quick-action-label">
                Manage Departments
              </span>
            </Link>


            <Link
              to="/profile"
              className="quick-action"
            >
              <span className="quick-action-icon">
                👤
              </span>

              <span className="quick-action-label">
                My Profile
              </span>
            </Link>


            <Link
              to="/employees"
              className="quick-action"
            >
              <span className="quick-action-icon">
                +
              </span>

              <span className="quick-action-label">
                Add Employee
              </span>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Dashboard;
```
