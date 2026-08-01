```javascript
/*
 * =========================================
 * EmployeeHub - Application Constants
 * =========================================
 *
 * Centralized application constants.
 *
 * Keep reusable values here instead of
 * hard-coding them throughout the app.
 */


/* =========================================
   Application Information
   ========================================= */

export const APP_NAME =
  "EmployeeHub";

export const APP_VERSION =
  "1.0.0";


/* =========================================
   Environment
   ========================================= */

export const ENVIRONMENTS = {

  DEVELOPMENT:
    "development",

  QA:
    "qa",

  UAT:
    "uat",

  PRODUCTION:
    "production",

};


/* =========================================
   API Configuration
   ========================================= */

export const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ||
  "/api/v1";


/* =========================================
   API Endpoints
   ========================================= */

export const API_ENDPOINTS = {

  AUTH: {

    LOGIN:
      "/auth/login",

    LOGOUT:
      "/auth/logout",

    ME:
      "/auth/me",

    REFRESH:
      "/auth/refresh",

    CHANGE_PASSWORD:
      "/auth/change-password",

  },


  USERS: {

    BASE:
      "/users",

    ME:
      "/users/me",

  },


  EMPLOYEES: {

    BASE:
      "/employees",

    STATS:
      "/employees/stats",

  },


  DEPARTMENTS: {

    BASE:
      "/departments",

  },


  HEALTH: {

    HEALTH:
      "/health",

    READY:
      "/health/ready",

    LIVE:
      "/health/live",

  },

};


/* =========================================
   User Roles
   ========================================= */

export const USER_ROLES = {

  ADMIN:
    "admin",

  HR:
    "hr",

  MANAGER:
    "manager",

  EMPLOYEE:
    "employee",

  VIEWER:
    "viewer",

};


/* =========================================
   Employee Status
   ========================================= */

export const EMPLOYEE_STATUS = {

  ACTIVE:
    "active",

  INACTIVE:
    "inactive",

  ON_LEAVE:
    "on_leave",

  TERMINATED:
    "terminated",

};


/* =========================================
   Department Status
   ========================================= */

export const DEPARTMENT_STATUS = {

  ACTIVE:
    "active",

  INACTIVE:
    "inactive",

};


/* =========================================
   Employment Types
   ========================================= */

export const EMPLOYMENT_TYPES = {

  FULL_TIME:
    "full_time",

  PART_TIME:
    "part_time",

  CONTRACT:
    "contract",

  INTERN:
    "intern",

};


/* =========================================
   Pagination
   ========================================= */

export const PAGINATION = {

  DEFAULT_PAGE:
    1,

  DEFAULT_PAGE_SIZE:
    10,

  PAGE_SIZE_OPTIONS: [

    10,

    20,

    50,

    100,

  ],

};


/* =========================================
   Local Storage Keys
   ========================================= */

export const STORAGE_KEYS = {

  ACCESS_TOKEN:
    "access_token",

  REFRESH_TOKEN:
    "refresh_token",

  USER:
    "user",

  THEME:
    "theme",

};


/* =========================================
   Theme
   ========================================= */

export const THEMES = {

  LIGHT:
    "light",

  DARK:
    "dark",

  SYSTEM:
    "system",

};


/* =========================================
   Date Formats
   ========================================= */

export const DATE_FORMATS = {

  DISPLAY:
    "DD MMM YYYY",

  DISPLAY_WITH_TIME:
    "DD MMM YYYY, HH:mm",

  API:
    "YYYY-MM-DD",

};


/* =========================================
   HTTP Status Codes
   ========================================= */

export const HTTP_STATUS = {

  OK:
    200,

  CREATED:
    201,

  NO_CONTENT:
    204,

  BAD_REQUEST:
    400,

  UNAUTHORIZED:
    401,

  FORBIDDEN:
    403,

  NOT_FOUND:
    404,

  CONFLICT:
    409,

  VALIDATION_ERROR:
    422,

  SERVER_ERROR:
    500,

};


/* =========================================
   Deployment Environments
   ========================================= */

export const DEPLOYMENT_ENVIRONMENTS = [

  {
    label:
      "Development",

    value:
      "development",
  },

  {
    label:
      "QA",

    value:
      "qa",
  },

  {
    label:
      "UAT",

    value:
      "uat",
  },

  {
    label:
      "Production",

    value:
      "production",
  },

];


/* =========================================
   Navigation Paths
   ========================================= */

export const ROUTES = {

  LOGIN:
    "/login",

  DASHBOARD:
    "/dashboard",

  EMPLOYEES:
    "/employees",

  DEPARTMENTS:
    "/departments",

  PROFILE:
    "/profile",

};


/* =========================================
   Toast / Notification Types
   ========================================= */

export const NOTIFICATION_TYPES = {

  SUCCESS:
    "success",

  ERROR:
    "error",

  WARNING:
    "warning",

  INFO:
    "info",

};


/* =========================================
   Application Limits
   ========================================= */

export const LIMITS = {

  MAX_NAME_LENGTH:
    100,

  MAX_EMAIL_LENGTH:
    255,

  MAX_PHONE_LENGTH:
    20,

  MAX_BIO_LENGTH:
    500,

  MIN_PASSWORD_LENGTH:
    8,

};


/* =========================================
   Export Default
   ========================================= */

const constants = {

  APP_NAME,

  APP_VERSION,

  ENVIRONMENTS,

  API_BASE_URL,

  API_ENDPOINTS,

  USER_ROLES,

  EMPLOYEE_STATUS,

  DEPARTMENT_STATUS,

  EMPLOYMENT_TYPES,

  PAGINATION,

  STORAGE_KEYS,

  THEMES,

  DATE_FORMATS,

  HTTP_STATUS,

  DEPLOYMENT_ENVIRONMENTS,

  ROUTES,

  NOTIFICATION_TYPES,

  LIMITS,

};


export default constants;
```
