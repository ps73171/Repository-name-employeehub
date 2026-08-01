```sql
-- =========================================
-- EmployeeHub - Database Initialization
-- =========================================

-- Create Database User
-- NOTE:
-- In production, database user/password should
-- be managed through Kubernetes Secrets,
-- Vault, or a cloud secret manager.

CREATE USER employeehub_user
WITH PASSWORD 'change_me';


-- Create Database

CREATE DATABASE employeehub
OWNER employeehub_user;


-- Connect to EmployeeHub Database

\c employeehub;


-- =========================================
-- Departments Table
-- =========================================

CREATE TABLE IF NOT EXISTS departments (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    is_active BOOLEAN
        DEFAULT TRUE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- Employees Table
-- =========================================

CREATE TABLE IF NOT EXISTS employees (

    id SERIAL PRIMARY KEY,

    employee_code VARCHAR(50)
        NOT NULL UNIQUE,

    first_name VARCHAR(100)
        NOT NULL,

    last_name VARCHAR(100)
        NOT NULL,

    email VARCHAR(255)
        NOT NULL UNIQUE,

    phone VARCHAR(20),

    job_title VARCHAR(100),

    department_id INTEGER,

    employment_type VARCHAR(50)
        DEFAULT 'full_time',

    is_active BOOLEAN
        DEFAULT TRUE,

    joining_date DATE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_department

        FOREIGN KEY (
            department_id
        )

        REFERENCES departments(id)

        ON DELETE SET NULL

);


-- =========================================
-- Users Table
-- =========================================

CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    username VARCHAR(100)
        NOT NULL UNIQUE,

    email VARCHAR(255)
        NOT NULL UNIQUE,

    password_hash TEXT
        NOT NULL,

    first_name VARCHAR(100),

    last_name VARCHAR(100),

    role VARCHAR(50)
        DEFAULT 'employee',

    is_active BOOLEAN
        DEFAULT TRUE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

);


-- =========================================
-- Audit Logs Table
-- =========================================

CREATE TABLE IF NOT EXISTS audit_logs (

    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    action VARCHAR(100)
        NOT NULL,

    resource VARCHAR(100),

    resource_id INTEGER,

    details JSONB,

    ip_address VARCHAR(50),

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user

        FOREIGN KEY (
            user_id
        )

        REFERENCES users(id)

        ON DELETE SET NULL

);


-- =========================================
-- Indexes
-- =========================================

CREATE INDEX IF NOT EXISTS
idx_employees_email

ON employees(email);


CREATE INDEX IF NOT EXISTS
idx_employees_department

ON employees(department_id);


CREATE INDEX IF NOT EXISTS
idx_employees_active

ON employees(is_active);


CREATE INDEX IF NOT EXISTS
idx_users_email

ON users(email);


CREATE INDEX IF NOT EXISTS
idx_audit_logs_user

ON audit_logs(user_id);


CREATE INDEX IF NOT EXISTS
idx_audit_logs_created_at

ON audit_logs(created_at);


-- =========================================
-- Initial Departments
-- =========================================

INSERT INTO departments (
    name,
    description
)

VALUES

(
    'Engineering',
    'Software development and technology team'
),

(
    'Human Resources',
    'Employee management and recruitment team'
),

(
    'Finance',
    'Finance and accounting team'
),

(
    'Operations',
    'Business operations team'
)

ON CONFLICT (
    name
)

DO NOTHING;


-- =========================================
-- Initial Admin User
-- =========================================
--
-- IMPORTANT:
-- Do NOT store plain-text passwords.
-- The password_hash below is only a placeholder.
-- The backend should create the first admin user
-- using a secure password hashing mechanism.
--

-- INSERT INTO users (
--     username,
--     email,
--     password_hash,
--     first_name,
--     last_name,
--     role
-- )
-- VALUES (
--     'admin',
--     'admin@employeehub.local',
--     '<BCRYPT_HASH>',
--     'System',
--     'Administrator',
--     'admin'
-- );


-- =========================================
-- Database Initialization Completed
-- =========================================
```
