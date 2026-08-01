```javascript
/*
 * =========================================
 * EmployeeHub - Employee Service
 * =========================================
 *
 * Handles:
 *
 * - Get All Employees
 * - Get Employee By ID
 * - Create Employee
 * - Update Employee
 * - Delete Employee
 * - Search Employees
 * - Filter By Department
 * - Pagination
 *
 * API Client:
 *
 * frontend/src/api/api.js
 */


/* -----------------------------------------
   API Client
   ----------------------------------------- */

import api from "../api/api";


/* =========================================
   Get All Employees
   ========================================= */

const getEmployees =
  async (
    params = {}
  ) => {

    const response =
      await api.get(
        "/employees",
        {
          params,
        }
      );


    return response.data;

  };


/* =========================================
   Get Employee By ID
   ========================================= */

const getEmployeeById =
  async (
    employeeId
  ) => {

    if (!employeeId) {

      throw new Error(
        "Employee ID is required."
      );

    }


    const response =
      await api.get(
        `/employees/${employeeId}`
      );


    return response.data;

  };


/* =========================================
   Create Employee
   ========================================= */

const createEmployee =
  async (
    employeeData
  ) => {

    if (!employeeData) {

      throw new Error(
        "Employee data is required."
      );

    }


    const response =
      await api.post(
        "/employees",
        employeeData
      );


    return response.data;

  };


/* =========================================
   Update Employee
   ========================================= */

const updateEmployee =
  async (
    employeeId,
    employeeData
  ) => {

    if (!employeeId) {

      throw new Error(
        "Employee ID is required."
      );

    }


    if (!employeeData) {

      throw new Error(
        "Employee data is required."
      );

    }


    const response =
      await api.put(
        `/employees/${employeeId}`,
        employeeData
      );


    return response.data;

  };


/* =========================================
   Delete Employee
   ========================================= */

const deleteEmployee =
  async (
    employeeId
  ) => {

    if (!employeeId) {

      throw new Error(
        "Employee ID is required."
      );

    }


    const response =
      await api.delete(
        `/employees/${employeeId}`
      );


    return response.data;

  };


/* =========================================
   Search Employees
   ========================================= */

const searchEmployees =
  async (
    searchTerm
  ) => {

    const response =
      await api.get(
        "/employees",
        {
          params: {

            search:
              searchTerm,

          },
        }
      );


    return response.data;

  };


/* =========================================
   Get Employees By Department
   ========================================= */

const getEmployeesByDepartment =
  async (
    departmentId
  ) => {

    if (!departmentId) {

      throw new Error(
        "Department ID is required."
      );

    }


    const response =
      await api.get(
        "/employees",
        {
          params: {

            department_id:
              departmentId,

          },
        }
      );


    return response.data;

  };


/* =========================================
   Get Active Employees
   ========================================= */

const getActiveEmployees =
  async () => {

    const response =
      await api.get(
        "/employees",
        {
          params: {

            is_active:
              true,

          },
        }
      );


    return response.data;

  };


/* =========================================
   Get Inactive Employees
   ========================================= */

const getInactiveEmployees =
  async () => {

    const response =
      await api.get(
        "/employees",
        {
          params: {

            is_active:
              false,

          },
        }
      );


    return response.data;

  };


/* =========================================
   Get Employee Statistics
   ========================================= */

const getEmployeeStats =
  async () => {

    const response =
      await api.get(
        "/employees/stats"
      );


    return response.data;

  };


/* =========================================
   Export Employee Service
   ========================================= */

const employeeService = {

  getEmployees,

  getEmployeeById,

  createEmployee,

  updateEmployee,

  deleteEmployee,

  searchEmployees,

  getEmployeesByDepartment,

  getActiveEmployees,

  getInactiveEmployees,

  getEmployeeStats,

};


export default employeeService;
```
