import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const API = "http://localhost:8080/api";

function TADashboard() {
const [gateEntries, setGateEntries] = useState([]);
const [weighments, setWeighments] = useState([]);
const [approvals, setApprovals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const today = new Date().toLocaleDateString("en-CA");

useEffect(() => {
async function loadDashboard() {
try {
setError("");


    const [gateResponse, weighmentResponse, approvalResponse] =
      await Promise.all([
        fetch(`${API}/gate-entries`),
        fetch(`${API}/weighments`),
        fetch(`${API}/approvals`),
      ]);

    if (!gateResponse.ok || !weighmentResponse.ok || !approvalResponse.ok) {
      throw new Error("Unable to load dashboard data from the backend.");
    }

    const [gateData, weighmentData, approvalData] = await Promise.all([
      gateResponse.json(),
      weighmentResponse.json(),
      approvalResponse.json(),
    ]);

    setGateEntries(Array.isArray(gateData) ? gateData : []);
    setWeighments(Array.isArray(weighmentData) ? weighmentData : []);
    setApprovals(Array.isArray(approvalData) ? approvalData : []);
  } catch (err) {
    setError(err.message || "Could not connect to the backend.");
  } finally {
    setLoading(false);
  }
}

loadDashboard();


}, []);

const isToday = (value) => {
if (!value) return false;


const date = new Date(value);
const now = new Date();

return (
  !Number.isNaN(date.getTime()) &&
  date.getFullYear() === now.getFullYear() &&
  date.getMonth() === now.getMonth() &&
  date.getDate() === now.getDate()
);


};

const todayGateEntries = gateEntries.filter(
(entry) => isToday(entry.inTime)
);

const todayWeighments = weighments.filter(
(item) => isToday(item.createdAt)
);

const pendingApprovals = approvals.filter(
(item) => item.status?.toUpperCase() === "PENDING"
);

const completedApprovals = approvals.filter(
(item) => item.status?.toUpperCase() === "APPROVED"
);

const recentActivity = [
...gateEntries.map((item) => ({
id: `gate-${item.id}`,
title: `Gate entry — ${item.truckNumber || "Truck"}`,
detail: item.partyName || "Warehouse entry",
time: item.inTime,
type: "Gate Entry",
})),
...weighments.map((item) => ({
id: `weighment-${item.id}`,
title: `Weighment — ${item.truckNumber || "Truck"}`,
detail: item.partyName || "Warehouse weighment",
time: item.createdAt,
type: "Weighment",
})),
]
.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
.slice(0, 5);

return ( <DashboardLayout> <div className="dashboard-page"> <div className="dashboard-header"> <div> <p className="dashboard-welcome">Welcome back</p> <h1>TA Dashboard</h1> <p>Prepare and manage warehouse operational reports.</p> </div>


      <div className="dashboard-date">
        {new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>

    {error && (
      <div role="alert" className="error-message">
        {error}
      </div>
    )}

    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">▤</div>
        <div>
          <p>Today's Gate Entries</p>
          <h2>{loading ? "…" : todayGateEntries.length}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">◷</div>
        <div>
          <p>Pending Approvals</p>
          <h2>{loading ? "…" : pendingApprovals.length}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✓</div>
        <div>
          <p>Approved Requests</p>
          <h2>{loading ? "…" : completedApprovals.length}</h2>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">▣</div>
        <div>
          <p>Today's Weighments</p>
          <h2>{loading ? "…" : todayWeighments.length}</h2>
        </div>
      </div>
    </div>

    <div className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Frequently used reporting operations</p>
        </div>
      </div>

      <div className="quick-actions">
        <a href="/ta/daily-reports" className="quick-action">
          <span className="quick-icon">▤</span>
          <div>
            <strong>Daily Reports</strong>
            <p>View daily warehouse activity</p>
          </div>
          <span>→</span>
        </a>

        <a href="/ta/monthly-reports" className="quick-action">
          <span className="quick-icon">▣</span>
          <div>
            <strong>Monthly Reports</strong>
            <p>Review monthly warehouse activity</p>
          </div>
          <span>→</span>
        </a>

        <a href="/ta/generate-report" className="quick-action">
          <span className="quick-icon">＋</span>
          <div>
            <strong>Generate Report</strong>
            <p>Create a warehouse activity report</p>
          </div>
          <span>→</span>
        </a>
      </div>
    </div>

    <div className="dashboard-section">
      <div className="section-heading">
        <div>
          <h2>Recent Warehouse Activity</h2>
          <p>Latest gate entries and weighments from the database.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading activity…</p>
      ) : recentActivity.length === 0 ? (
        <div className="activity-empty">
          <div className="empty-icon">▤</div>
          <h3>No activity yet</h3>
          <p>Gate entries and weighments will appear here when recorded.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Details</th>
                <th>Type</th>
                <th>Date &amp; Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.detail}</td>
                  <td>{item.type}</td>
                  <td>
                    {item.time
                      ? new Date(item.time).toLocaleString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</DashboardLayout>


);
}

export default TADashboard;
