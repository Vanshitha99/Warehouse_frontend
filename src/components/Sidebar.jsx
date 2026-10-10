import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleName = () => {
    if (role === "JA") return "Junior Assistant";
    if (role === "WM") return "Warehouse Manager";
    if (role === "TA") return "Technical Assistant";

    return "Employee";
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}

      <div className="sidebar-brand">

        <div className="sidebar-logo">
          TGSWC
        </div>

        <div>
          <h2>Digital Warehouse</h2>
          <p>Management System</p>
        </div>

      </div>


      {/* USER */}

      <div className="sidebar-user">

        <div className="user-avatar">
          {user?.name?.charAt(0) || "U"}
        </div>

        <div>
          <strong>
            {user?.name || getRoleName()}
          </strong>

          <span>
            {user?.employeeId || "Employee"}
          </span>
        </div>

      </div>


      {/* NAVIGATION */}

      <nav className="sidebar-nav">

        <p className="nav-title">
          MAIN MENU
        </p>


        {/* =====================
            JA MENU
        ===================== */}

        {role === "JA" && (
          <>
            <NavLink
              to="/ja"
              end
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▣</span>
              Dashboard
            </NavLink>


            <NavLink
              to="/ja/gate-entry"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▤</span>
              Gate Entry
            </NavLink>


            <NavLink
              to="/ja/truck-management"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>🚛</span>
              Truck Management
            </NavLink>


            <NavLink
              to="/ja/weighment"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>⚖</span>
              Weighment
            </NavLink>
          </>
        )}


        {/* =====================
            WM MENU
        ===================== */}

        {role === "WM" && (
          <>
            <NavLink
              to="/wm"
              end
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▣</span>
              Dashboard
            </NavLink>


            <NavLink
              to="/wm/gate-entries"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▤</span>
              Gate Entries
            </NavLink>


            <NavLink
              to="/wm/trucks"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>🚛</span>
              Trucks
            </NavLink>


            <NavLink
              to="/wm/approvals"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>✓</span>
              Approvals
            </NavLink>


            <NavLink
              to="/wm/loss-review"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>⚠</span>
              Loss Review
            </NavLink>


            <NavLink
              to="/wm/reports"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▤</span>
              Reports
            </NavLink>


            <NavLink
              to="/wm/analytics"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>◈</span>
              Analytics
            </NavLink>
          </>
        )}


        {/* =====================
            TA MENU
        ===================== */}

        {role === "TA" && (
          <>
            <NavLink
              to="/ta"
              end
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▣</span>
              Dashboard
            </NavLink>


            <NavLink
              to="/ta/daily-reports"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▤</span>
              Daily Reports
            </NavLink>


            <NavLink
              to="/ta/monthly-reports"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>▤</span>
              Monthly Reports
            </NavLink>


            <NavLink
              to="/ta/generate-report"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>＋</span>
              Generate Report
            </NavLink>


            <NavLink
              to="/ta/report-history"
              className={({ isActive }) =>
                isActive
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <span>◷</span>
              Report History
            </NavLink>
          </>
        )}

      </nav>


      {/* LOGOUT */}

      <div className="sidebar-bottom">

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;