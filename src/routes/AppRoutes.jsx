import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";

import DashboardLayout from "../layouts/DashboardLayout";
import GateEntries from "../pages/wm/GateEntries";
import Trucks from "../pages/wm/Trucks";
import Approvals from "../pages/wm/Approvals";
import LossReview from "../pages/wm/LossReview";
import Reports from "../pages/wm/Reports";
import Analytics from "../pages/wm/Analytics";
/* ================================
   JA PAGES
================================ */

import JADashboard from "../pages/ja/JADashboard";
import GateEntry from "../pages/ja/GateEntry";
import TruckManagement from "../pages/ja/TruckManagement";
import Weighment from "../pages/ja/Weighment";

/* ================================
   TA PAGES
================================ */

import TADashboard from "../pages/ta/TADashboard";
import DailyReports from "../pages/ta/DailyReports";
import MonthlyReports from "../pages/ta/MonthlyReports";
import GenerateReport from "../pages/ta/GenerateReport";
import ReportHistory from "../pages/ta/ReportHistory";

/* ================================
   WM PAGES
================================ */

import WMDashboard from "../pages/wm/WMDashboard";


/* =====================================================
   TEMPORARY WM PAGES
   These will be replaced with proper pages next.
===================================================== */

function WMGateEntries() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="page-header">
          <h1>Gate Entries</h1>

          <p>
            Monitor incoming and outgoing
            warehouse trucks.
          </p>
        </div>

        <div className="gate-entry-card">

          <div className="activity-empty">

            <div className="empty-icon">
              ▤
            </div>

            <h3>
              Gate Entries
            </h3>

            <p>
              Gate entry records will appear here
              from the central warehouse database.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


function WMTrucks() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="page-header">
          <h1>Trucks</h1>

          <p>
            Monitor truck movement and
            recorded weights.
          </p>
        </div>

        <div className="gate-entry-card">

          <div className="activity-empty">

            <div className="empty-icon">
              🚛
            </div>

            <h3>
              Truck Management
            </h3>

            <p>
              Truck records will appear here
              from the central warehouse database.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


function WMApprovals() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="page-header">
          <h1>Approvals</h1>

          <p>
            Review and approve pending
            warehouse transactions.
          </p>
        </div>

        <div className="gate-entry-card">

          <div className="activity-empty">

            <div className="empty-icon">
              ✓
            </div>

            <h3>
              Pending Approvals
            </h3>

            <p>
              Transactions requiring manager
              approval will appear here.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


function WMLossReview() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="page-header">
          <h1>Loss Review</h1>

          <p>
            Review weight differences and
            warehouse losses.
          </p>
        </div>

        <div className="gate-entry-card">

          <div className="activity-empty">

            <div className="empty-icon">
              ⚠
            </div>

            <h3>
              Loss Review
            </h3>

            <p>
              Weight differences and loss records
              will appear here.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


function WMReports() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="page-header">
          <h1>Reports</h1>

          <p>
            View warehouse operational reports.
          </p>
        </div>

        <div className="gate-entry-card">

          <div className="activity-empty">

            <div className="empty-icon">
              ▤
            </div>

            <h3>
              Warehouse Reports
            </h3>

            <p>
              Operational reports will be
              displayed here.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


function WMAnalytics() {
  return (
    <DashboardLayout>
      <div className="dashboard-page">

        <div className="page-header">
          <h1>Analytics</h1>

          <p>
            Analyze warehouse operational
            performance.
          </p>
        </div>

        <div className="gate-entry-card">

          <div className="activity-empty">

            <div className="empty-icon">
              ◈
            </div>

            <h3>
              Warehouse Analytics
            </h3>

            <p>
              Operational analytics will appear
              here once database data is available.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}


/* =====================================================
   UNAUTHORIZED PAGE
===================================================== */

function Unauthorized() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f7fb",
        padding: "20px",
      }}
    >

      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid #e2e8f0",
        }}
      >

        <h1
          style={{
            color: "#123e68",
            fontSize: "40px",
          }}
        >
          403
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#64748b",
          }}
        >
          You are not authorized to access
          this page.
        </p>

        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 18px",
            borderRadius: "7px",
            background: "#123e68",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Back to Login
        </a>

      </div>

    </div>
  );
}


/* =====================================================
   APP ROUTES
===================================================== */

function AppRoutes() {

  return (
    <Routes>

      {/* =================================================
          LOGIN
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =================================================
          JA ROUTES
      ================================================= */}

      <Route
        path="/ja"
        element={
          <ProtectedRoute allowedRoles={["JA"]}>
            <JADashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/ja/gate-entry"
        element={
          <ProtectedRoute allowedRoles={["JA"]}>
            <DashboardLayout>
              <GateEntry />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/ja/truck-management"
        element={
          <ProtectedRoute allowedRoles={["JA"]}>
            <DashboardLayout>
              <TruckManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/ja/weighment"
        element={
          <ProtectedRoute allowedRoles={["JA"]}>
            <DashboardLayout>
              <Weighment />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      {/* =================================================
          TA ROUTES
      ================================================= */}

      <Route
        path="/ta"
        element={
          <ProtectedRoute allowedRoles={["TA"]}>
            <TADashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/ta/daily-reports"
        element={
          <ProtectedRoute allowedRoles={["TA"]}>
            <DashboardLayout>
              <DailyReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/ta/monthly-reports"
        element={
          <ProtectedRoute allowedRoles={["TA"]}>
            <DashboardLayout>
              <MonthlyReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/ta/generate-report"
        element={
          <ProtectedRoute allowedRoles={["TA"]}>
            <DashboardLayout>
              <GenerateReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/ta/report-history"
        element={
          <ProtectedRoute allowedRoles={["TA"]}>
            <DashboardLayout>
              <ReportHistory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />


      {/* =================================================
          WM ROUTES
      ================================================= */}

      <Route
        path="/wm"
        element={
          <ProtectedRoute allowedRoles={["WM"]}>
            <WMDashboard />
          </ProtectedRoute>
        }
      />


      <Route
  path="/wm/gate-entries"
  element={
    <ProtectedRoute allowedRoles={["WM"]}>
      <GateEntries />
    </ProtectedRoute>
  }
/>

      <Route
  path="/wm/trucks"
  element={
    <ProtectedRoute allowedRoles={["WM"]}>
      <Trucks />
    </ProtectedRoute>
  }
/>


      <Route
  path="/wm/approvals"
  element={
    <ProtectedRoute allowedRoles={["WM"]}>
      <Approvals />
    </ProtectedRoute>
  }
/>


      <Route
  path="/wm/loss-review"
  element={
    <ProtectedRoute allowedRoles={["WM"]}>
      <LossReview />
    </ProtectedRoute>
  }
/>

     <Route
  path="/wm/reports"
  element={
    <ProtectedRoute allowedRoles={["WM"]}>
      <Reports />
    </ProtectedRoute>
  }
/> 

<Route
  path="/wm/analytics"
  element={
    <ProtectedRoute allowedRoles={["WM"]}>
      <Analytics />
    </ProtectedRoute>
  }
/>


      {/* =================================================
          UNAUTHORIZED
      ================================================= */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* =================================================
          DEFAULT ROUTE
      ================================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =================================================
          UNKNOWN URL
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;