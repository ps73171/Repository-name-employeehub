```jsx
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";

import "./Employees.css";


/*
 * =========================================
 * EmployeeHub - Employees Page
 * =========================================
 *
 * Features:
 *
 * - Employee listing
 * - Search employees
 * - Filter by department
 * - Add employee
 * - Edit employee
 * - Delete employee
 * - Active / Inactive status
 * - Employee statistics
 */


/* -----------------------------------------
   Initial Form State
   ----------------------------------------- */

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  position: "",
  department_id: "",
  is_active: true,
};


/* -----------------------------------------
   Employees Component
   ----------------------------------------- */

function Employees() {

  const [
    employees,
    setEmployees,
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

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("");

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState(
    initialForm
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


/* =========================================
   Load Employees
   ========================================= */

  const loadEmployees =
    async () => {

      try {

        setLoading(true);

        setError(null);

        /*
         * GET /employees
         */

        const response =
          await employeeService
            .getEmployees();

        setEmployees(
          response?.data || []
        );

      } catch (err) {

        console.error(
          "Failed to load employees:",
          err
        );

        setError(
          "Unable to load employees."
        );

      } finally {

        setLoading(false);

      }
    };


/* =========================================
   Load Departments
   ========================================= */

  const loadDepartments =
    async () => {

      try {

        /*
         * GET /departments
         */

        const response =
          await departmentService
            .getDepartments();

        setDepartments(
          response?.data || []
        );

      } catch (err) {

        console.error(
          "Failed to load departments:",
          err
        );

      }
    };


/* =========================================
   Initial Data Load
   ========================================= */

  useEffect(() => {

    const loadData =
      async () => {

        await Promise.all([
          loadEmployees(),
          loadDepartments(),
        ]);

      };

    loadData();

  }, []);


/* =========================================
   Filter Employees
   ========================================= */

  const filteredEmployees =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return employees.filter(
        (employee) => {

          const fullName =
            `${employee.first_name || ""} ${
              employee.last_name || ""
            }`.toLowerCase();

          const matchesSearch =
            !search ||
            fullName.includes(
              search
            ) ||
            employee.email
              ?.toLowerCase()
              .includes(search) ||
            employee.position
              ?.toLowerCase()
              .includes(search);

          const matchesDepartment =
            !departmentFilter ||
            String(
              employee.department_id
            ) ===
              String(
                departmentFilter
              );

          return (
            matchesSearch &&
            matchesDepartment
          );
        }
      );

    }, [
      employees,
      searchTerm,
      departmentFilter,
    ]);


/* =========================================
   Open Add Employee Modal
   ========================================= */

  const handleAddEmployee =
    () => {

      setSelectedEmployee(
        null
      );

      setFormData(
        initialForm
      );

      setIsModalOpen(
        true
      );
    };


/* =========================================
   Open Edit Employee Modal
   ========================================= */

  const handleEditEmployee =
    (employee) => {

      setSelectedEmployee(
        employee
      );

      setFormData({

        first_name:
          employee.first_name ||
          "",

        last_name:
          employee.last_name ||
          "",

        email:
          employee.email ||
          "",

        phone:
          employee.phone ||
          "",

        position:
          employee.position ||
          "",

        department_id:
          employee.department_id ||
          "",

        is_active:
          employee.is_active !==
          false,

      });

      setIsModalOpen(
        true
      );
    };


/* =========================================
   Open Delete Modal
   ========================================= */

  const handleDeleteClick =
    (employee) => {

      setSelectedEmployee(
        employee
      );

      setIsDeleteModalOpen(
        true
      );
    };


/* =========================================
   Form Change
   ========================================= */

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
    };


/* =========================================
   Create / Update Employee
   ========================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (
        !formData.first_name.trim() ||
        !formData.last_name.trim() ||
        !formData.email.trim()
      ) {
        return;
      }

      try {

        setSubmitting(true);

        setError(null);


        if (
          selectedEmployee
        ) {

          /*
           * Update Employee
           */

          await employeeService
            .updateEmployee(

              selectedEmployee.id,

              formData

            );

        } else {

          /*
           * Create Employee
           */

          await employeeService
            .createEmployee(
              formData
            );

        }


        setIsModalOpen(
          false
        );

        setSelectedEmployee(
          null
        );

        setFormData(
          initialForm
        );


        await loadEmployees();

      } catch (err) {

        console.error(
          "Failed to save employee:",
          err
        );

        setError(
          "Unable to save employee."
        );

      } finally {

        setSubmitting(false);

      }
    };


/* =========================================
   Delete Employee
   ========================================= */

  const handleDelete =
    async () => {

      if (
        !selectedEmployee
      ) {
        return;
      }

      try {

        setSubmitting(true);

        setError(null);


        await employeeService
          .deleteEmployee(
            selectedEmployee.id
          );


        setIsDeleteModalOpen(
          false
        );

        setSelectedEmployee(
          null
        );


        await loadEmployees();

      } catch (err) {

        console.error(
          "Failed to delete employee:",
          err
        );

        setError(
          "Unable to delete employee."
        );

      } finally {

        setSubmitting(false);

      }
    };


/* =========================================
   Employee Statistics
   ========================================= */

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.is_active !==
        false
    ).length;

  const inactiveEmployees =
    totalEmployees -
    activeEmployees;

  const totalDepartments =
    departments.length;


/* =========================================
   Get Department Name
   ========================================= */

  const getDepartmentName =
    (departmentId) => {

      const department =
        departments.find(
          (item) =>
            String(
              item.id
            ) ===
            String(
              departmentId
            )
        );

      return (
        department?.name ||
        "No Department"
      );
    };


/* =========================================
   Loading State
   ========================================= */

  if (loading) {

    return (

      <div className="employees-loading">

        <Loader
          text="Loading employees..."
        />

      </div>

    );
  }


/* =========================================
   Render
   ========================================= */

  return (

    <div className="employees-page">


      {/* =================================
          Header
          ================================= */}

      <div className="employees-header">

        <div className="employees-header-content">

          <h1 className="employees-title">
            Employees
          </h1>

          <p className="employees-subtitle">
            Manage employees,
            departments and
            employee information.
          </p>

        </div>


        <div className="employees-actions">

          <Button
            onClick={
              handleAddEmployee
            }
          >
            + Add Employee
          </Button>

        </div>

      </div>


      {/* =================================
          Statistics
          ================================= */}

      <div className="employee-stats">


        {/* Total Employees */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            👥
          </div>

          <div className="employee-stat-content">

            <p className="employee-stat-label">
              Total Employees
            </p>

            <h2 className="employee-stat-value">
              {totalEmployees}
            </h2>

          </div>

        </div>


        {/* Active Employees */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            ✓
          </div>

          <div className="employee-stat-content">

            <p className="employee-stat-label">
              Active Employees
            </p>

            <h2 className="employee-stat-value">
              {activeEmployees}
            </h2>

          </div>

        </div>


        {/* Inactive Employees */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            !
          </div>

          <div className="employee-stat-content">

            <p className="employee-stat-label">
              Inactive Employees
            </p>

            <h2 className="employee-stat-value">
              {inactiveEmployees}
            </h2>

          </div>

        </div>


        {/* Departments */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            #
          </div>

          <div className="employee-stat-content">

            <p className="employee-stat-label">
              Departments
            </p>

            <h2 className="employee-stat-value">
              {totalDepartments}
            </h2>

          </div>

        </div>

      </div>


      {/* =================================
          Toolbar
          ================================= */}

      <div className="employees-toolbar">


        {/* Search */}

        <div className="employee-search">

          <input
            type="search"
            placeholder="Search employees..."
            value={
              searchTerm
            }
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        {/* Department Filter */}

        <div className="employee-filter">

          <select
            value={
              departmentFilter
            }
            onChange={(event) =>
              setDepartmentFilter(
                event.target.value
              )
            }
          >

            <option value="">
              All Departments
            </option>

            {departments.map(
              (department) => (

                <option
                  key={
                    department.id
                  }
                  value={
                    department.id
                  }
                >
                  {
                    department.name
                  }
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =================================
          Error Message
          ================================= */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* =================================
          Employee Grid
          ================================= */}

      {filteredEmployees.length ===
      0 ? (

        <div className="employees-empty">

          <div className="employees-empty-icon">
            👤
          </div>

          <h3>
            No Employees Found
          </h3>

          <p>
            {searchTerm ||
            departmentFilter
              ? "No employees match your search or filter."
              : "Add your first employee to get started."}
          </p>

          {!searchTerm &&
            !departmentFilter && (

              <Button
                onClick={
                  handleAddEmployee
                }
              >
                + Add Employee
              </Button>

            )}

        </div>

      ) : (

        <div className="employees-grid">

          {filteredEmployees.map(
            (employee) => (

              <div
                className="employee-card"
                key={
                  employee.id
                }
              >


                {/* =================================
                    Employee Card Header
                    ================================= */}

                <div className="employee-card-header">

                  <div className="employee-profile">

                    <div className="employee-card-avatar">

                      {employee.profile_image ? (

                        <img
                          src={
                            employee.profile_image
                          }
                          alt={
                            `${employee.first_name} ${employee.last_name}`
                          }
                        />

                      ) : (

                        `${employee.first_name?.charAt(0) || ""}${employee.last_name?.charAt(0) || ""}`

                      )}

                    </div>


                    <div className="employee-card-info">

                      <h3 className="employee-card-name">

                        {
                          employee.first_name
                        }
                        {" "}
                        {
                          employee.last_name
                        }

                      </h3>

                      <p className="employee-card-position">

                        {
                          employee.position ||
                          "Employee"
                        }

                      </p>

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="employee-card-actions">

                    <button
                      type="button"
                      className="employee-action-btn"
                      onClick={() =>
                        handleEditEmployee(
                          employee
                        )
                      }
                      aria-label="Edit employee"
                    >
                      ✎
                    </button>


                    <button
                      type="button"
                      className="employee-action-btn delete"
                      onClick={() =>
                        handleDeleteClick(
                          employee
                        )
                      }
                      aria-label="Delete employee"
                    >
                      🗑
                    </button>

                  </div>

                </div>


                {/* =================================
                    Employee Card Body
                    ================================= */}

                <div className="employee-card-body">


                  <div className="employee-detail">

                    <span className="employee-detail-label">
                      Email
                    </span>

                    <span className="employee-detail-value">
                      {
                        employee.email ||
                        "-"
                      }
                    </span>

                  </div>


                  <div className="employee-detail">

                    <span className="employee-detail-label">
                      Phone
                    </span>

                    <span className="employee-detail-value">
                      {
                        employee.phone ||
                        "-"
                      }
                    </span>

                  </div>


                  <div className="employee-detail">

                    <span className="employee-detail-label">
                      Department
                    </span>

                    <span className="employee-detail-value">

                      {
                        getDepartmentName(
                          employee.department_id
                        )
                      }

                    </span>

                  </div>

                </div>


                {/* =================================
                    Employee Card Footer
                    ================================= */}

                <div className="employee-card-footer">

                  <span
                    className={
                      employee.is_active !==
                      false
                        ? "status-badge status-active"
                        : "status-badge status-inactive"
                    }
                  >

                    {employee.is_active !==
                    false
                      ? "Active"
                      : "Inactive"}

                  </span>

                  <span>
                    ID: {
                      employee.id
                    }
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* =================================
          Add / Edit Employee Modal
          ================================= */}

      <Modal
        isOpen={
          isModalOpen
        }
        onClose={() =>
          setIsModalOpen(
            false
          )
        }
        title={
          selectedEmployee
            ? "Edit Employee"
            : "Add Employee"
        }
        footer={

          <>

            <Button
              variant="secondary"
              onClick={() =>
                setIsModalOpen(
                  false
                )
              }
              disabled={
                submitting
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="employee-form"
              loading={
                submitting
              }
            >
              {selectedEmployee
                ? "Update Employee"
                : "Create Employee"}
            </Button>

          </>

        }
      >

        <form
          id="employee-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* First Name */}

          <div className="form-group">

            <label htmlFor="first-name">
              First Name
            </label>

            <input
              id="first-name"
              type="text"
              name="first_name"
              placeholder="Enter first name"
              value={
                formData.first_name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          {/* Last Name */}

          <div className="form-group">

            <label htmlFor="last-name">
              Last Name
            </label>

            <input
              id="last-name"
              type="text"
              name="last_name"
              placeholder="Enter last name"
              value={
                formData.last_name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label htmlFor="employee-email">
              Email
            </label>

            <input
              id="employee-email"
              type="email"
              name="email"
              placeholder="employee@example.com"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          {/* Phone */}

          <div className="form-group">

            <label htmlFor="employee-phone">
              Phone
            </label>

            <input
              id="employee-phone"
              type="tel"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
            />

          </div>


          {/* Position */}

          <div className="form-group">

            <label htmlFor="employee-position">
              Position
            </label>

            <input
              id="employee-position"
              type="text"
              name="position"
              placeholder="e.g. DevOps Engineer"
              value={
                formData.position
              }
              onChange={
                handleChange
              }
            />

          </div>


          {/* Department */}

          <div className="form-group">

            <label htmlFor="employee-department">
              Department
            </label>

            <select
              id="employee-department"
              name="department_id"
              value={
                formData.department_id
              }
              onChange={
                handleChange
              }
            >

              <option value="">
                Select Department
              </option>

              {departments.map(
                (department) => (

                  <option
                    key={
                      department.id
                    }
                    value={
                      department.id
                    }
                  >
                    {
                      department.name
                    }
                  </option>

                )
              )}

            </select>

          </div>


          {/* Active Status */}

          <div className="form-group">

            <label>

              <input
                type="checkbox"
                name="is_active"
                checked={
                  formData.is_active
                }
                onChange={
                  handleChange
                }
              />

              {" "}
              Active Employee

            </label>

          </div>

        </form>

      </Modal>


      {/* =================================
          Delete Confirmation Modal
          ================================= */}

      <Modal
        isOpen={
          isDeleteModalOpen
        }
        onClose={() =>
          setIsDeleteModalOpen(
            false
          )
        }
        title="Delete Employee"
        size="small"
        footer={

          <>

            <Button
              variant="secondary"
              onClick={() =>
                setIsDeleteModalOpen(
                  false
                )
              }
              disabled={
                submitting
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={
                handleDelete
              }
              loading={
                submitting
              }
            >
              Delete
            </Button>

          </>

        }
      >

        <p>

          Are you sure you want to
          delete{" "}

          <strong>

            {
              selectedEmployee
                ?.first_name
            }

            {" "}

            {
              selectedEmployee
                ?.last_name
            }

          </strong>
          ?

        </p>

        <p>
          This action cannot be
          undone.
        </p>

      </Modal>

    </div>
  );
}


export default Employees;
```
