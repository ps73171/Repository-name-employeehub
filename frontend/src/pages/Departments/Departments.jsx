```jsx
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

import departmentService from "../../services/departmentService";

import "./Departments.css";


/*
 * =========================================
 * EmployeeHub - Departments
 * =========================================
 *
 * Features:
 *
 * - View departments
 * - Search departments
 * - Add department
 * - Edit department
 * - Delete department
 * - Employee count
 */


/* -----------------------------------------
   Initial Form State
   ----------------------------------------- */

const initialForm = {
  name: "",
  description: "",
};


/* -----------------------------------------
   Departments Component
   ----------------------------------------- */

function Departments() {

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
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    selectedDepartment,
    setSelectedDepartment,
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
   Load Departments
   ========================================= */

  const loadDepartments =
    async () => {

      try {

        setLoading(true);

        setError(null);

        /*
         * Backend API call
         *
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

        setError(
          "Unable to load departments."
        );

      } finally {

        setLoading(false);

      }
    };


/* =========================================
   Initial Load
   ========================================= */

  useEffect(() => {

    loadDepartments();

  }, []);


/* =========================================
   Filter Departments
   ========================================= */

  const filteredDepartments =
    useMemo(() => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      if (!search) {
        return departments;
      }

      return departments.filter(
        (department) =>
          department.name
            ?.toLowerCase()
            .includes(search) ||
          department.description
            ?.toLowerCase()
            .includes(search)
      );

    }, [
      departments,
      searchTerm,
    ]);


/* =========================================
   Open Add Modal
   ========================================= */

  const handleAddDepartment =
    () => {

      setSelectedDepartment(
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
   Open Edit Modal
   ========================================= */

  const handleEditDepartment =
    (department) => {

      setSelectedDepartment(
        department
      );

      setFormData({
        name:
          department.name || "",

        description:
          department.description ||
          "",
      });

      setIsModalOpen(
        true
      );
    };


/* =========================================
   Open Delete Modal
   ========================================= */

  const handleDeleteClick =
    (department) => {

      setSelectedDepartment(
        department
      );

      setIsDeleteModalOpen(
        true
      );
    };


/* =========================================
   Form Input Handler
   ========================================= */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;

      setFormData(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


/* =========================================
   Create / Update Department
   ========================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      if (!formData.name.trim()) {
        return;
      }

      try {

        setSubmitting(true);

        if (
          selectedDepartment
        ) {

          /*
           * Update Department
           */

          await departmentService
            .updateDepartment(
              selectedDepartment.id,
              formData
            );

        } else {

          /*
           * Create Department
           */

          await departmentService
            .createDepartment(
              formData
            );
        }

        setIsModalOpen(
          false
        );

        setFormData(
          initialForm
        );

        setSelectedDepartment(
          null
        );

        await loadDepartments();

      } catch (err) {

        console.error(
          "Failed to save department:",
          err
        );

        setError(
          "Unable to save department."
        );

      } finally {

        setSubmitting(false);

      }
    };


/* =========================================
   Delete Department
   ========================================= */

  const handleDelete =
    async () => {

      if (
        !selectedDepartment
      ) {
        return;
      }

      try {

        setSubmitting(true);

        await departmentService
          .deleteDepartment(
            selectedDepartment.id
          );

        setIsDeleteModalOpen(
          false
        );

        setSelectedDepartment(
          null
        );

        await loadDepartments();

      } catch (err) {

        console.error(
          "Failed to delete department:",
          err
        );

        setError(
          "Unable to delete department."
        );

      } finally {

        setSubmitting(false);

      }
    };


/* =========================================
   Statistics
   ========================================= */

  const totalDepartments =
    departments.length;

  const totalEmployees =
    departments.reduce(
      (
        total,
        department
      ) =>
        total +
        (
          department.employee_count ||
          0
        ),
      0
    );

  const activeDepartments =
    departments.filter(
      (department) =>
        department.is_active !==
        false
    ).length;


/* =========================================
   Loading State
   ========================================= */

  if (loading) {

    return (
      <div className="departments-loading">

        <Loader
          text="Loading departments..."
        />

      </div>
    );
  }


/* =========================================
   Render
   ========================================= */

  return (

    <div className="departments-page">


      {/* =================================
          Header
          ================================= */}

      <div className="departments-header">

        <div className="departments-header-content">

          <h1 className="departments-title">
            Departments
          </h1>

          <p className="departments-subtitle">
            Manage your organization's
            departments and teams.
          </p>

        </div>


        <div className="departments-actions">

          <Button
            onClick={
              handleAddDepartment
            }
          >
            + Add Department
          </Button>

        </div>

      </div>


      {/* =================================
          Statistics
          ================================= */}

      <div className="department-stats">


        <div className="department-stat-card">

          <div className="department-stat-icon">
            #
          </div>

          <div className="department-stat-content">

            <p className="department-stat-label">
              Total Departments
            </p>

            <h2 className="department-stat-value">
              {totalDepartments}
            </h2>

          </div>

        </div>


        <div className="department-stat-card">

          <div className="department-stat-icon">
            👥
          </div>

          <div className="department-stat-content">

            <p className="department-stat-label">
              Total Employees
            </p>

            <h2 className="department-stat-value">
              {totalEmployees}
            </h2>

          </div>

        </div>


        <div className="department-stat-card">

          <div className="department-stat-icon">
            ✓
          </div>

          <div className="department-stat-content">

            <p className="department-stat-label">
              Active Departments
            </p>

            <h2 className="department-stat-value">
              {activeDepartments}
            </h2>

          </div>

        </div>

      </div>


      {/* =================================
          Search Toolbar
          ================================= */}

      <div className="departments-toolbar">

        <div className="department-search">

          <input
            type="search"
            placeholder="Search departments..."
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

      </div>


      {/* =================================
          Error
          ================================= */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* =================================
          Department Cards
          ================================= */}

      {filteredDepartments.length ===
      0 ? (

        <div className="departments-empty">

          <div className="departments-empty-icon">
            #
          </div>

          <h3>
            No Departments Found
          </h3>

          <p>
            {searchTerm
              ? "No department matches your search."
              : "Create your first department to get started."}
          </p>

          {!searchTerm && (

            <Button
              onClick={
                handleAddDepartment
              }
            >
              + Add Department
            </Button>

          )}

        </div>

      ) : (

        <div className="departments-grid">

          {filteredDepartments.map(
            (department) => (

              <div
                className="department-card"
                key={
                  department.id
                }
              >


                {/* Card Header */}

                <div className="department-card-header">

                  <div className="department-card-icon">
                    #
                  </div>


                  <div className="department-card-actions">

                    <button
                      type="button"
                      className="department-action-btn"
                      onClick={() =>
                        handleEditDepartment(
                          department
                        )
                      }
                      aria-label="Edit department"
                    >
                      ✎
                    </button>


                    <button
                      type="button"
                      className="department-action-btn delete"
                      onClick={() =>
                        handleDeleteClick(
                          department
                        )
                      }
                      aria-label="Delete department"
                    >
                      🗑
                    </button>

                  </div>

                </div>


                {/* Card Body */}

                <div className="department-card-body">

                  <h3 className="department-card-title">
                    {department.name}
                  </h3>

                  <p className="department-card-description">
                    {department.description ||
                      "No description available."}
                  </p>


                  <div className="department-employee-count">

                    <span className="department-employee-label">
                      Employees
                    </span>

                    <span className="department-employee-number">
                      {
                        department.employee_count ||
                        0
                      }
                    </span>

                  </div>

                </div>


                {/* Card Footer */}

                <div className="department-card-footer">

                  <span>
                    {department.is_active ===
                    false
                      ? "Inactive"
                      : "Active"}
                  </span>

                  <a
                    href={`/employees?department=${department.id}`}
                    className="department-view-link"
                  >
                    View Employees →
                  </a>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* =================================
          Add / Edit Modal
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
          selectedDepartment
            ? "Edit Department"
            : "Add Department"
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
              form="department-form"
              loading={
                submitting
              }
            >
              {selectedDepartment
                ? "Update Department"
                : "Create Department"}
            </Button>

          </>

        }
      >

        <form
          id="department-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-group">

            <label htmlFor="department-name">
              Department Name
            </label>

            <input
              id="department-name"
              type="text"
              name="name"
              placeholder="e.g. Engineering"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="department-description">
              Description
            </label>

            <textarea
              id="department-description"
              name="description"
              placeholder="Enter department description..."
              rows="4"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
            />

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
        title="Delete Department"
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
              selectedDepartment?.name
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


export default Departments;
```
