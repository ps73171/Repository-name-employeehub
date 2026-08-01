```javascript
/*
 * =========================================
 * EmployeeHub - Helper Utilities
 * =========================================
 *
 * Reusable utility functions used
 * throughout the EmployeeHub frontend.
 */


/* =========================================
   Format Full Name
   ========================================= */

export const getFullName = (
  firstName = "",
  lastName = ""
) => {

  return `${firstName} ${lastName}`
    .trim();

};


/* =========================================
   Get User Initials
   ========================================= */

export const getInitials = (
  firstName = "",
  lastName = ""
) => {

  const firstInitial =
    firstName
      .trim()
      .charAt(0)
      .toUpperCase();

  const lastInitial =
    lastName
      .trim()
      .charAt(0)
      .toUpperCase();

  return (
    firstInitial +
    lastInitial
  ) || "U";

};


/* =========================================
   Get Initials From Full Name
   ========================================= */

export const getNameInitials = (
  name = ""
) => {

  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (
    words.length === 0
  ) {

    return "U";

  }


  if (
    words.length === 1
  ) {

    return words[0]
      .charAt(0)
      .toUpperCase();

  }


  return (

    words[0]
      .charAt(0)
      .toUpperCase() +

    words[
      words.length - 1
    ]
      .charAt(0)
      .toUpperCase()

  );

};


/* =========================================
   Format Date
   ========================================= */

export const formatDate = (
  date,
  options = {}
) => {

  if (!date) {

    return "-";

  }


  const dateObject =
    new Date(date);


  if (
    Number.isNaN(
      dateObject.getTime()
    )
  ) {

    return "-";

  }


  const defaultOptions = {

    day:
      "2-digit",

    month:
      "short",

    year:
      "numeric",

  };


  return dateObject.toLocaleDateString(
    "en-IN",
    {
      ...defaultOptions,
      ...options,
    }
  );

};


/* =========================================
   Format Date & Time
   ========================================= */

export const formatDateTime = (
  date
) => {

  if (!date) {

    return "-";

  }


  const dateObject =
    new Date(date);


  if (
    Number.isNaN(
      dateObject.getTime()
    )
  ) {

    return "-";

  }


  return dateObject.toLocaleString(
    "en-IN",
    {

      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

    }
  );

};


/* =========================================
   Format Currency
   ========================================= */

export const formatCurrency = (
  amount,
  currency = "INR"
) => {

  if (
    amount === null ||
    amount === undefined ||
    amount === ""
  ) {

    return "-";

  }


  const numericAmount =
    Number(amount);


  if (
    Number.isNaN(
      numericAmount
    )
  ) {

    return "-";

  }


  return new Intl.NumberFormat(
    "en-IN",
    {

      style:
        "currency",

      currency,

      maximumFractionDigits:
        2,

    }
  ).format(
    numericAmount
  );

};


/* =========================================
   Format Number
   ========================================= */

export const formatNumber = (
  value
) => {

  if (
    value === null ||
    value === undefined
  ) {

    return "0";

  }


  return new Intl.NumberFormat(
    "en-IN"
  ).format(
    Number(value) || 0
  );

};


/* =========================================
   Capitalize First Letter
   ========================================= */

export const capitalize = (
  value = ""
) => {

  if (!value) {

    return "";

  }


  return (

    value
      .charAt(0)
      .toUpperCase() +

    value
      .slice(1)
      .toLowerCase()

  );

};


/* =========================================
   Convert Snake Case To Title Case
   ========================================= */

export const snakeToTitle = (
  value = ""
) => {

  if (!value) {

    return "";

  }


  return value

    .replace(
      /_/g,
      " "
    )

    .replace(
      /\w\S*/g,
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word
          .slice(1)
          .toLowerCase()
    );

};


/* =========================================
   Convert Kebab Case To Title Case
   ========================================= */

export const kebabToTitle = (
  value = ""
) => {

  if (!value) {

    return "";

  }


  return snakeToTitle(
    value.replace(
      /-/g,
      "_"
    )
  );

};


/* =========================================
   Email Validation
   ========================================= */

export const isValidEmail = (
  email = ""
) => {

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(
    email.trim()
  );

};


/* =========================================
   Phone Validation
   ========================================= */

export const isValidPhone = (
  phone = ""
) => {

  const phoneRegex =
    /^[+]?[0-9\s-]{10,15}$/;

  return phoneRegex.test(
    phone.trim()
  );

};


/* =========================================
   Password Validation
   ========================================= */

export const validatePassword = (
  password = ""
) => {

  const errors = [];


  if (
    password.length < 8
  ) {

    errors.push(
      "Password must contain at least 8 characters."
    );

  }


  if (
    !/[A-Z]/.test(
      password
    )
  ) {

    errors.push(
      "Password must contain at least one uppercase letter."
    );

  }


  if (
    !/[a-z]/.test(
      password
    )
  ) {

    errors.push(
      "Password must contain at least one lowercase letter."
    );

  }


  if (
    !/[0-9]/.test(
      password
    )
  ) {

    errors.push(
      "Password must contain at least one number."
    );

  }


  return {

    isValid:
      errors.length === 0,

    errors,

  };

};


/* =========================================
   Debounce Function
   ========================================= */

export const debounce = (
  callback,
  delay = 500
) => {

  let timeoutId;


  return (
    ...args
  ) => {

    clearTimeout(
      timeoutId
    );


    timeoutId =
      setTimeout(
        () => {

          callback(
            ...args
          );

        },
        delay
      );

  };

};


/* =========================================
   Throttle Function
   ========================================= */

export const throttle = (
  callback,
  limit = 500
) => {

  let waiting = false;


  return (
    ...args
  ) => {

    if (waiting) {

      return;

    }


    callback(
      ...args
    );


    waiting = true;


    setTimeout(
      () => {

        waiting = false;

      },
      limit
    );

  };

};


/* =========================================
   Sleep / Delay
   ========================================= */

export const sleep = (
  milliseconds
) => {

  return new Promise(
    (resolve) => {

      setTimeout(
        resolve,
        milliseconds
      );

    }
  );

};


/* =========================================
   Extract API Error Message
   ========================================= */

export const getErrorMessage = (
  error,
  fallbackMessage =
    "Something went wrong. Please try again."
) => {

  return (

    error
      ?.response
      ?.data
      ?.detail ||

    error
      ?.response
      ?.data
      ?.message ||

    error
      ?.message ||

    fallbackMessage

  );

};


/* =========================================
   Check API Error Status
   ========================================= */

export const isApiError = (
  error,
  statusCode
) => {

  return (
    error
      ?.response
      ?.status ===
    statusCode
  );

};


/* =========================================
   Check Empty Value
   ========================================= */

export const isEmpty = (
  value
) => {

  if (
    value === null ||
    value === undefined
  ) {

    return true;

  }


  if (
    typeof value ===
    "string"
  ) {

    return (
      value.trim()
        .length === 0
    );

  }


  if (
    Array.isArray(value)
  ) {

    return (
      value.length === 0
    );

  }


  if (
    typeof value ===
    "object"
  ) {

    return (
      Object.keys(value)
        .length === 0
    );

  }


  return false;

};


/* =========================================
   Convert Object To Query String
   ========================================= */

export const objectToQueryString = (
  params = {}
) => {

  const searchParams =
    new URLSearchParams();


  Object.entries(
    params
  ).forEach(
    ([key, value]) => {

      if (
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {

        searchParams.append(
          key,
          value
        );

      }

    }
  );


  return searchParams.toString();

};


/* =========================================
   Get Pagination Info
   ========================================= */

export const getPaginationInfo = (
  totalItems = 0,
  currentPage = 1,
  pageSize = 10
) => {

  const totalPages =
    Math.ceil(
      totalItems /
      pageSize
    );


  return {

    totalItems,

    currentPage,

    pageSize,

    totalPages,

    hasNextPage:
      currentPage <
      totalPages,

    hasPreviousPage:
      currentPage >
      1,

  };

};


/* =========================================
   Get File Extension
   ========================================= */

export const getFileExtension = (
  fileName = ""
) => {

  const parts =
    fileName.split(
      "."
    );


  if (
    parts.length <= 1
  ) {

    return "";

  }


  return parts
    .pop()
    .toLowerCase();

};


/* =========================================
   Validate File Size
   ========================================= */

export const isValidFileSize = (
  file,
  maxSizeInMB = 5
) => {

  if (!file) {

    return false;

  }


  const maxSizeInBytes =
    maxSizeInMB *
    1024 *
    1024;


  return (
    file.size <=
    maxSizeInBytes
  );

};


/* =========================================
   Validate Image File
   ========================================= */

export const isValidImage = (
  file
) => {

  if (!file) {

    return false;

  }


  const allowedTypes = [

    "image/jpeg",

    "image/png",

    "image/webp",

  ];


  return allowedTypes.includes(
    file.type
  );

};


/* =========================================
   Download Blob File
   ========================================= */

export const downloadBlob = (
  blob,
  fileName
) => {

  const url =
    window.URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;

  link.download =
    fileName;


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  window.URL.revokeObjectURL(
    url
  );

};


/* =========================================
   Safe JSON Parse
   ========================================= */

export const safeJsonParse = (
  value,
  fallback = null
) => {

  try {

    return JSON.parse(
      value
    );

  } catch {

    return fallback;

  }

};


/* =========================================
   Export Default Helpers
   ========================================= */

const helpers = {

  getFullName,

  getInitials,

  getNameInitials,

  formatDate,

  formatDateTime,

  formatCurrency,

  formatNumber,

  capitalize,

  snakeToTitle,

  kebabToTitle,

  isValidEmail,

  isValidPhone,

  validatePassword,

  debounce,

  throttle,

  sleep,

  getErrorMessage,

  isApiError,

  isEmpty,

  objectToQueryString,

  getPaginationInfo,

  getFileExtension,

  isValidFileSize,

  isValidImage,

  downloadBlob,

  safeJsonParse,

};


export default helpers;
```
