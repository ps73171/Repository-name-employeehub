import React from "react";
import "./app.css";

function App() {
const stats = [
{ title: "Total Employees", value: "248", icon: "👥" },
{ title: "Departments", value: "12", icon: "🏢" },
{ title: "Active Users", value: "231", icon: "✅" },
{ title: "Pending Requests", value: "17", icon: "⏳" },
];

const employees = [
{ name: "Rahul Sharma", role: "DevOps Engineer", department: "IT", status: "Active" },
{ name: "Priya Singh", role: "HR Manager", department: "Human Resources", status: "Active" },
{ name: "Amit Kumar", role: "Software Engineer", department: "Engineering", status: "Active" },
{ name: "Neha Verma", role: "Finance Executive", department: "Finance", status: "Inactive" },
];

return ( <div className="app-container"> <aside className="sidebar"> <div className="logo"> <div className="logo-icon">E</div> <div> <h2>EmployeeHub</h2> <span>Management Platform</span> </div> </div>

```
    <nav className="navigation">
      <a className="nav-item active" href="#">
        📊 <span>Dashboard</span>
      </a>
      <a className="nav-item" href="#">
        👥 <span>Employees</span>
      </a>
      <a className="nav-item" href="#">
        🏢 <span>Departments</span>
      </a>
      <a className="nav-item" href="#">
        👤 <span>Users</span>
      </a>
      <a className="nav-item" href="#">
        📋 <span>Audit Logs</span>
      </a>
    </nav>

    <div className="sidebar-bottom">
      <a className="nav-item" href="#">
        ⚙️ <span>Settings</span>
      </a>
      <a className="nav-item logout" href="#">
        🚪 <span>Logout</span>
      </a>
    </div>
  </aside>

  <main className="main-content">
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your organization.</p>
      </div>

      <div className="user-profile">
        <div className="notification">🔔</div>
        <div className="avatar">SA</div>
        <div>
          <strong>Admin User</strong>
          <small>Administrator</small>
        </div>
      </div>
    </header>

    <section className="stats-grid">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.title}>
          <div className="stat-icon">{stat.icon}</div>
          <div>
            <p>{stat.title}</p>
            <h2>{stat.value}</h2>
          </div>
        </div>
      ))}
    </section>

    <section className="content-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Recent Employees</h2>
            <p>Recently added employees</p>
          </div>
          <button className="primary-button">View All</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.name}>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {employee.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")}
                      </div>
                      <strong>{employee.name}</strong>
                    </div>
                  </td>
                  <td>{employee.role}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span
                      className={
                        employee.status === "Active"
                          ? "status active-status"
                          : "status inactive-status"
                      }
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel quick-actions">
        <div className="panel-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Manage your organization</p>
          </div>
        </div>

        <button className="action-button">
          <span>➕</span>
          <div>
            <strong>Add Employee</strong>
            <small>Create a new employee profile</small>
          </div>
        </button>

        <button className="action-button">
          <span>🏢</span>
          <div>
            <strong>Add Department</strong>
            <small>Create a new department</small>
          </div>
        </button>

        <button className="action-button">
          <span>👤</span>
          <div>
            <strong>Manage Users</strong>
            <small>View and manage system users</small>
          </div>
        </button>

        <button className="action-button">
          <span>📋</span>
          <div>
            <strong>View Audit Logs</strong>
            <small>Review system activities</small>
          </div>
        </button>
      </div>
    </section>
  </main>
</div>
```

);
}

export default App;
