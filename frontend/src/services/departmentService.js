```javascript
/*
 * =========================================
 * EmployeeHub - Department Service
 * =========================================
 *
 * Handles:
 *
 * - Get All Departments
 * - Get Department By ID
 * - Create Department
 * - Update Department
 * - Delete Department
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
   Get All Departments
   ========================================= */

const getDepartments =
  async (
    params = {}
  ) => {

    const response =
      await api.get(
        "/departments",
        {
          params,
        }
      );


    return response.data;

  };


/* =========================================
   Get Department By ID
   ========================================= */

const getDepartmentById =
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
        `/departments/${departmentId}`
      );


    return response.data;

  };


/* =========================================
   Create Department
   ========================================= */

const createDepartment =
  async (
    departmentData
  ) => {

    if (
      !departmentData?.name
    ) {

      throw new Error(
        "Department name is required."
      );

    }


    const response =
      await api.post(
        "/departments",
        departmentData
      );


    return response.data;

  };


/* =========================================
   Update Department
   ========================================= */

const updateDepartment =
  async (
    departmentId,
    departmentData
  ) => {

    if (!departmentId) {

      throw new Error(
        "Department ID is required."
      );

    }


    const response =
      await api.put(
        `/departments/${departmentId}`,
        departmentData
      );


    return response.data;

  };


/* =========================================
   Delete Department
   ========================================= */

const deleteDepartment =
  async (
    departmentId
  ) => {

    if (!departmentId) {

      throw new Error(
        "Department ID is required."
      );

    }


    const response =
      await api.delete(
        `/departments/${departmentId}`
      );


    return response.data;

  };


/* =========================================
   Search Departments
   ========================================= */

const searchDepartments =
  async (
    searchTerm
  ) => {

    const response =
      await api.get(
        "/departments",
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
   Get Department Employees
   ========================================= */

const getDepartmentEmployees =
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
        `/departments/${departmentId}/employees`
      );


    return response.data;

  };


/* =========================================
   Export Department Service
   ========================================= */

const departmentService = {

  getDepartments,

  getDepartmentById,

  createDepartment,

  updateDepartment,

  deleteDepartment,

  searchDepartments,

  getDepartmentEmployees,

};


export default departmentService;
```
