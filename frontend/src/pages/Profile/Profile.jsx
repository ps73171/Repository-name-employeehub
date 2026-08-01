```jsx
import React, {
  useEffect,
  useState,
} from "react";

import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

import "./Profile.css";


/*
 * =========================================
 * EmployeeHub - Profile Page
 * =========================================
 *
 * Features:
 *
 * - Display current user profile
 * - Edit profile
 * - Update profile information
 * - Account status
 * - Security section
 * - Change password section
 */


/* -----------------------------------------
   Initial Profile State
   ----------------------------------------- */

const initialProfile = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  username: "",
  job_title: "",
  department: "",
  bio: "",
};


/* -----------------------------------------
   Profile Component
   ----------------------------------------- */

function Profile() {

  /* ---------------------------------------
     Auth Context
     --------------------------------------- */

  const {
    user,
    loading: authLoading,
    updateProfile,
  } = useAuth();


  /* ---------------------------------------
     Component State
     --------------------------------------- */

  const [
    profile,
    setProfile,
  ] = useState(
    initialProfile
  );

  const [
    editMode,
    setEditMode,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  /* ---------------------------------------
     Load User Data
     --------------------------------------- */

  useEffect(() => {

    if (!user) {
      return;
    }

    setProfile({

      first_name:
        user.first_name ||
        "",

      last_name:
        user.last_name ||
        "",

      email:
        user.email ||
        "",

      phone:
        user.phone ||
        "",

      username:
        user.username ||
        "",

      job_title:
        user.job_title ||
        user.position ||
        "",

      department:
        user.department?.name ||
        user.department ||
        "",

      bio:
        user.bio ||
        "",

    });

  }, [user]);


  /* ---------------------------------------
     Handle Input Change
     --------------------------------------- */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;

      setProfile(
        (previous) => ({

          ...previous,

          [name]:
            value,

        })
      );


      if (message.text) {

        setMessage({
          type: "",
          text: "",
        });

      }

    };


  /* ---------------------------------------
     Start Editing
     --------------------------------------- */

  const handleEdit =
    () => {

      setEditMode(
        true
      );

      setMessage({
        type: "",
        text: "",
      });

    };


  /* ---------------------------------------
     Cancel Editing
     --------------------------------------- */

  const handleCancel =
    () => {

      if (!user) {
        return;
      }

      setProfile({

        first_name:
          user.first_name ||
          "",

        last_name:
          user.last_name ||
          "",

        email:
          user.email ||
          "",

        phone:
          user.phone ||
          "",

        username:
          user.username ||
          "",

        job_title:
          user.job_title ||
          user.position ||
          "",

        department:
          user.department?.name ||
          user.department ||
          "",

        bio:
          user.bio ||
          "",

      });

      setEditMode(
        false
      );

      setMessage({
        type: "",
        text: "",
      });

    };


  /* ---------------------------------------
     Save Profile
     --------------------------------------- */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      try {

        setSaving(true);

        setMessage({
          type: "",
          text: "",
        });


        /*
         * updateProfile()
         *
         * AuthContext should call
         * backend profile update API.
         */

        if (
          typeof updateProfile ===
          "function"
        ) {

          await updateProfile(
            profile
          );

        }


        setEditMode(
          false
        );

        setMessage({

          type: "success",

          text:
            "Profile updated successfully.",

        });

      } catch (error) {

        console.error(
          "Profile update failed:",
          error
        );

        setMessage({

          type: "error",

          text:
            error?.response
              ?.data
              ?.detail ||
            "Unable to update profile.",

        });

      } finally {

        setSaving(false);

      }

    };


  /* ---------------------------------------
     Get User Initials
     --------------------------------------- */

  const getInitials =
    () => {

      const firstName =
        profile.first_name
          ?.charAt(0)
          ?.toUpperCase() ||
        "";

      const lastName =
        profile.last_name
          ?.charAt(0)
          ?.toUpperCase() ||
        "";

      return (
        firstName +
        lastName
      ) || "U";

    };


  /* ---------------------------------------
     Loading State
     --------------------------------------- */

  if (authLoading) {

    return (

      <div className="profile-loading">

        <Loader
          text="Loading profile..."
        />

      </div>

    );

  }


  /* ---------------------------------------
     No User State
     --------------------------------------- */

  if (!user) {

    return (

      <div className="profile-loading">

        <p>
          Unable to load user profile.
        </p>

      </div>

    );

  }


  /* ---------------------------------------
     Render
     --------------------------------------- */

  return (

    <div className="profile-page">


      {/* =================================
          Page Header
          ================================= */}

      <div className="profile-header">

        <div className="profile-header-content">

          <h1 className="profile-title">
            My Profile
          </h1>

          <p className="profile-subtitle">
            Manage your personal information
            and account settings.
          </p>

        </div>

      </div>


      {/* =================================
          Profile Content
          ================================= */}

      <div className="profile-content">


        {/* =================================
            Profile Sidebar
            ================================= */}

        <aside className="profile-sidebar">


          {/* Cover */}

          <div className="profile-cover">
          </div>


          {/* Avatar */}

          <div className="profile-avatar-section">

            <div className="profile-avatar">

              {user.profile_image ? (

                <img
                  src={
                    user.profile_image
                  }
                  alt={
                    `${profile.first_name} ${profile.last_name}`
                  }
                />

              ) : (

                getInitials()

              )}

            </div>


            <div className="profile-basic-info">

              <h2 className="profile-name">

                {
                  profile.first_name
                }

                {" "}

                {
                  profile.last_name
                }

              </h2>


              <p className="profile-role">

                {
                  profile.job_title ||
                  "Employee"
                }

              </p>


              <span
                className={
                  user.is_active !==
                  false
                    ? "profile-status active"
                    : "profile-status inactive"
                }
              >

                {
                  user.is_active !==
                  false
                    ? "Active"
                    : "Inactive"
                }

              </span>

            </div>

          </div>


          {/* Quick Information */}

          <div className="profile-quick-info">


            {/* Email */}

            <div className="profile-quick-item">

              <div className="profile-quick-icon">
                ✉
              </div>

              <div className="profile-quick-content">

                <p className="profile-quick-label">
                  Email
                </p>

                <p className="profile-quick-value">
                  {
                    profile.email ||
                    "-"
                  }
                </p>

              </div>

            </div>


            {/* Phone */}

            <div className="profile-quick-item">

              <div className="profile-quick-icon">
                ☎
              </div>

              <div className="profile-quick-content">

                <p className="profile-quick-label">
                  Phone
                </p>

                <p className="profile-quick-value">
                  {
                    profile.phone ||
                    "-"
                  }
                </p>

              </div>

            </div>


            {/* Department */}

            <div className="profile-quick-item">

              <div className="profile-quick-icon">
                #
              </div>

              <div className="profile-quick-content">

                <p className="profile-quick-label">
                  Department
                </p>

                <p className="profile-quick-value">
                  {
                    profile.department ||
                    "-"
                  }
                </p>

              </div>

            </div>


            {/* Username */}

            <div className="profile-quick-item">

              <div className="profile-quick-icon">
                @
              </div>

              <div className="profile-quick-content">

                <p className="profile-quick-label">
                  Username
                </p>

                <p className="profile-quick-value">
                  {
                    profile.username ||
                    "-"
                  }
                </p>

              </div>

            </div>

          </div>

        </aside>


        {/* =================================
            Main Profile Area
            ================================= */}

        <main className="profile-main">


          {/* =================================
              Alert Message
              ================================= */}

          {message.text && (

            <div
              className={
                `profile-alert ${message.type}`
              }
              role="alert"
            >

              <span>

                {
                  message.type ===
                  "success"
                    ? "✓"
                    : "⚠"
                }

              </span>

              <span>
                {
                  message.text
                }
              </span>

            </div>

          )}


          {/* =================================
              Personal Information Card
              ================================= */}

          <div className="profile-card">


            {/* Card Header */}

            <div className="profile-card-header">

              <div>

                <h2 className="profile-card-title">
                  Personal Information
                </h2>

                <p className="profile-card-description">
                  Update your personal
                  and professional details.
                </p>

              </div>


              {!editMode && (

                <button
                  type="button"
                  className="profile-edit-button"
                  onClick={
                    handleEdit
                  }
                >
                  ✎ Edit Profile
                </button>

              )}

            </div>


            {/* Profile Form */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="profile-form-grid">


                {/* First Name */}

                <div className="profile-form-group">

                  <label htmlFor="first_name">
                    First Name
                  </label>

                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    className="profile-form-input"
                    value={
                      profile.first_name
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editMode ||
                      saving
                    }
                    required
                  />

                </div>


                {/* Last Name */}

                <div className="profile-form-group">

                  <label htmlFor="last_name">
                    Last Name
                  </label>

                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    className="profile-form-input"
                    value={
                      profile.last_name
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editMode ||
                      saving
                    }
                    required
                  />

                </div>


                {/* Username */}

                <div className="profile-form-group">

                  <label htmlFor="username">
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    name="username"
                    className="profile-form-input"
                    value={
                      profile.username
                    }
                    disabled
                  />

                </div>


                {/* Email */}

                <div className="profile-form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="profile-form-input"
                    value={
                      profile.email
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editMode ||
                      saving
                    }
                    required
                  />

                </div>


                {/* Phone */}

                <div className="profile-form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="profile-form-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={
                      profile.phone
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editMode ||
                      saving
                    }
                  />

                </div>


                {/* Job Title */}

                <div className="profile-form-group">

                  <label htmlFor="job_title">
                    Job Title
                  </label>

                  <input
                    id="job_title"
                    type="text"
                    name="job_title"
                    className="profile-form-input"
                    placeholder="e.g. DevOps Engineer"
                    value={
                      profile.job_title
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editMode ||
                      saving
                    }
                  />

                </div>


                {/* Department */}

                <div className="profile-form-group">

                  <label htmlFor="department">
                    Department
                  </label>

                  <input
                    id="department"
                    type="text"
                    name="department"
                    className="profile-form-input"
                    value={
                      profile.department
                    }
                    disabled
                  />

                </div>


                {/* Bio */}

                <div className="profile-form-group full-width">

                  <label htmlFor="bio">
                    About Me
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    className="profile-form-textarea"
                    placeholder="Tell us something about yourself..."
                    value={
                      profile.bio
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editMode ||
                      saving
                    }
                  />

                </div>

              </div>


              {/* Form Actions */}

              {editMode && (

                <div className="profile-form-actions">

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      saving
                    }
                  >
                    Cancel
                  </button>


                  <Button
                    type="submit"
                    loading={
                      saving
                    }
                  >
                    Save Changes
                  </Button>

                </div>

              )}

            </form>

          </div>


          {/* =================================
              Security Card
              ================================= */}

          <div className="profile-card">


            <div className="profile-card-header">

              <div>

                <h2 className="profile-card-title">
                  Security
                </h2>

                <p className="profile-card-description">
                  Manage your password
                  and account security.
                </p>

              </div>

            </div>


            {/* Password */}

            <div className="profile-security-item">

              <div className="profile-security-info">

                <div className="profile-security-icon">
                  🔒
                </div>

                <div>

                  <h3 className="profile-security-title">
                    Password
                  </h3>

                  <p className="profile-security-description">
                    Change your account
                    password regularly
                    to keep your account secure.
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="profile-change-password"
                onClick={() =>
                  alert(
                    "Change password feature will be connected to the backend API."
                  )
                }
              >
                Change Password
              </button>

            </div>


            {/* Account Status */}

            <div className="profile-security-item">

              <div className="profile-security-info">

                <div className="profile-security-icon">
                  🛡
                </div>

                <div>

                  <h3 className="profile-security-title">
                    Account Status
                  </h3>

                  <p className="profile-security-description">
                    Your account is currently
                    {
                      user.is_active !==
                      false
                        ? " active."
                        : " inactive."
                    }
                  </p>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}


export default Profile;
```
