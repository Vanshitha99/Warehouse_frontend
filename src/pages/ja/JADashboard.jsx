
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { API_BASE_URL } from "../../services/api";

const API = API_BASE_URL;

function JADashboard() {
  const [gateEntries, setGateEntries] = useState([]);
  const [weighments, setWeighments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [gateResponse, weighmentResponse] = await Promise.all([
          fetch(`${API}/gate-entries`),
          fetch(`${API}/weighments`),
        ]);

        if (!gateResponse.ok) {
          throw new Error("Could not load gate entries.");
        }

        if (!weighmentResponse.ok) {
          throw new Error("Could not load weighments.");
        }

        const gateData = await gateResponse.json();
        const weighmentData = await weighmentResponse.json();

        if (!Array.isArray(gateData) || !Array.isArray(weighmentData)) {
          throw new Error("The backend returned an unexpected data format.");
        }

        if (!cancelled) {
          setGateEntries(gateData);
          setWeighments(weighmentData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // Use the browser's local calendar date.
  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Backend inTime values look like 2026-10-10T15:09:10.
  function isToday(value) {
    return typeof value === "string" && value.slice(0, 10) === todayKey;
  }

  const todayEntries = gateEntries.filter(
    (entry) => isToday(entry.inTime)
  );

  const trucksInside = gateEntries.filter(
    (entry) => entry.status === "INSIDE"
  );

  const todayWeighments = weighments.filter(
    (item) => isToday(item.createdAt)
  );

  const completedEntries = todayEntries.filter(
    (entry) => entry.status === "EXITED"
  );

  const recentActivity = [
    ...todayEntries.map((entry) => ({
      id: `gate-${entry.id}`,
      type: "Gate Entry",
      truckNumber: entry.truckNumber || "Unknown truck",
      time: entry.inTime,
      status: entry.status || "Recorded",
    })),
    ...todayWeighments.map((item) => ({
      id: `weighment-${item.id}`,
      type: "Weighment",
      truckNumber:
        item.truckNumber ||
        item.truck?.truckNumber ||
        "Weighment recorded",
      time: item.createdAt,
      status: "Recorded",
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <p className="dashboard-welcome">Welcome back</p>
            <h1>JA Dashboard</h1>
            <p>Manage gate entries, trucks and weighments.</p>
          </div>

          <div className="dashboard-date">
            {today.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {error && (
          <div className="dashboard-section" role="alert">
            <p>{error}</p>
            <p>
              Check that your Spring Boot backend is running on port 8080
              and that both API endpoints are accessible.
            </p>
          </div>
        )}

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">▤</div>
            <div>
              <p>Today's Gate Entries</p>
              <h2>{loading ? "..." : todayEntries.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚛</div>
            <div>
              <p>Trucks Inside</p>
              <h2>{loading ? "..." : trucksInside.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚖</div>
            <div>
              <p>Today's Weighments</p>
              <h2>{loading ? "..." : todayWeighments.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <p>Completed Entries</p>
              <h2>{loading ? "..." : completedEntries.length}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used operations</p>
            </div>
          </div>

          <div className="quick-actions">
            <a href="/ja/gate-entry" className="quick-action">
              <span className="quick-icon">▤</span>
              <div>
                <strong>New Gate Entry</strong>
                <p>Register an incoming truck</p>
              </div>
              <span>→</span>
            </a>

            <a href="/ja/truck-management" className="quick-action">
              <span className="quick-icon">🚛</span>
              <div>
                <strong>Truck Management</strong>
                <p>Record truck weights</p>
              </div>
              <span>→</span>
            </a>

            <a href="/ja/weighment" className="quick-action">
              <span className="quick-icon">⚖</span>
              <div>
                <strong>New Weighment</strong>
                <p>Record truck weighment</p>
              </div>
              <span>→</span>
            </a>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest operations recorded today</p>
            </div>
          </div>

          {loading ? (
            <p>Loading recent activity...</p>
          ) : recentActivity.length === 0 ? (
            <div className="activity-empty">
              <div className="empty-icon">▤</div>
              <h3>No activity yet</h3>
              <p>Gate entries and weighments will appear here.</p>
            </div>
          ) : (
            <div className="recent-activity-list">
              {recentActivity.map((activity) => (
                <div className="quick-action" key={activity.id}>
                  <div>
                    <strong>{activity.type}</strong>
                    <p>{activity.truckNumber}</p>
                    <p>
                      {activity.time
                        ? new Date(activity.time).toLocaleString("en-IN")
                        : "Time unavailable"}
                    </p>
                  </div>
                  <span>{activity.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default JADashboard;

