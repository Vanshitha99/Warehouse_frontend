
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { API_BASE_URL } from "../../services/api";

const GATE_API = `${API_BASE_URL}/gate-entries`;
const APPROVAL_API = `${API_BASE_URL}/approvals`;
const WEIGHMENT_API = `${API_BASE_URL}/weighments`;

function WMDashboard() {
  const [entries, setEntries] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [weighments, setWeighments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");

      const responses = await Promise.all([
        fetch(GATE_API),
        fetch(APPROVAL_API),
        fetch(WEIGHMENT_API),
      ]);

      const labels = ["Gate entries", "Approvals", "Weighments"];
      const failed = responses.findIndex((response) => !response.ok);

      if (failed !== -1) {
        throw new Error(`Unable to load ${labels[failed].toLowerCase()}.`);
      }

      const [gateData, approvalData, weighmentData] = await Promise.all(
        responses.map((response) => response.json())
      );

      setEntries(Array.isArray(gateData) ? gateData : []);
      setApprovals(Array.isArray(approvalData) ? approvalData : []);
      setWeighments(Array.isArray(weighmentData) ? weighmentData : []);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const intervalId = setInterval(loadDashboard, 30000);
    return () => clearInterval(intervalId);
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

  const todaysEntries = entries.filter((entry) =>
    isToday(entry.inTime)
  ).length;

  const trucksInside = entries.filter(
    (entry) => entry.status?.toUpperCase() === "INSIDE"
  ).length;

  const pendingApprovals = approvals.filter(
    (approval) => approval.status?.toUpperCase() === "PENDING"
  ).length;

  const todaysWeighments = weighments.filter((weighment) =>
    isToday(weighment.createdAt)
  ).length;

  const recentEntries = [...entries]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5);

  const recentWeighments = [...weighments]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5);

  const formatTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <p className="dashboard-welcome">Welcome back</p>
            <h1>WM Dashboard</h1>
            <p>
              Monitor warehouse operations, approvals, reports and analytics.
            </p>
          </div>

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
          <div className="dashboard-section">
            <p role="alert">{error}</p>
            <button type="button" onClick={loadDashboard}>
              Retry
            </button>
          </div>
        )}

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">▤</div>
            <div>
              <p>Today's Gate Entries</p>
              <h2>{loading ? "…" : todaysEntries}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚛</div>
            <div>
              <p>Trucks Inside</p>
              <h2>{loading ? "…" : trucksInside}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚖</div>
            <div>
              <p>Today's Weighments</p>
              <h2>{loading ? "…" : todaysWeighments}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <p>Pending Approvals</p>
              <h2>{loading ? "…" : pendingApprovals}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used warehouse management operations.</p>
            </div>
          </div>

          <div className="quick-actions">
            <a href="/wm/gate-entries" className="quick-action">
              <span className="quick-icon">▤</span>
              <div>
                <strong>Gate Entries</strong>
                <p>Monitor incoming and outgoing trucks.</p>
              </div>
              <span>→</span>
            </a>

            <a href="/wm/approvals" className="quick-action">
              <span className="quick-icon">✓</span>
              <div>
                <strong>Approvals</strong>
                <p>Review pending warehouse transactions.</p>
              </div>
              <span>→</span>
            </a>

            <a href="/wm/loss-review" className="quick-action">
              <span className="quick-icon">⚠</span>
              <div>
                <strong>Loss Review</strong>
                <p>Review weight differences and losses.</p>
              </div>
              <span>→</span>
            </a>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Operational Summary</h2>
              <p>Current warehouse activity.</p>
            </div>
          </div>

          <div className="quick-actions">
            <div className="quick-action">
              <span className="quick-icon">🚛</span>
              <div>
                <strong>Trucks</strong>
                <p>
                  {loading
                    ? "Loading truck activity…"
                    : `${trucksInside} truck(s) currently inside.`}
                </p>
              </div>
            </div>

            <div className="quick-action">
              <span className="quick-icon">⚖</span>
              <div>
                <strong>Weighments</strong>
                <p>
                  {loading
                    ? "Loading weighments…"
                    : `${weighments.length} weighment(s) recorded in total; ${todaysWeighments} today.`}
                </p>
              </div>
            </div>

            <div className="quick-action">
              <span className="quick-icon">✓</span>
              <div>
                <strong>Approvals</strong>
                <p>
                  {loading
                    ? "Loading approvals…"
                    : `${pendingApprovals} approval(s) waiting for review.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Recent Weighments</h2>
              <p>Latest weighment records saved in the database.</p>
            </div>
            <button type="button" onClick={loadDashboard}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading weighments…</p>
          ) : recentWeighments.length === 0 ? (
            <div className="activity-empty">
              <h3>No weighments yet</h3>
              <p>Saved weighments will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Truck Number</th>
                    <th>Party Name</th>
                    <th>Acknowledgement No.</th>
                    <th>Weighbill No.</th>
                    <th>Load Weight (kg)</th>
                    <th>Stack</th>
                    <th>Godown</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentWeighments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.truckNumber || "—"}</td>
                      <td>{item.partyName || "—"}</td>
                      <td>{item.acknowledgementNumber || "—"}</td>
                      <td>{item.weighBillNumber || "—"}</td>
                      <td>
                        {item.loadedWeight == null
                          ? "—"
                          : Number(item.loadedWeight).toLocaleString("en-IN")}
                      </td>
                      <td>{item.stackNumber || "—"}</td>
                      <td>{item.godownNumber || "—"}</td>
                      <td>{formatTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Recent Gate Activity</h2>
              <p>Latest gate entries recorded in the system.</p>
            </div>
            <button type="button" onClick={loadDashboard}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading recent activity…</p>
          ) : recentEntries.length === 0 ? (
            <div className="activity-empty">
              <h3>No activity yet</h3>
              <p>New gate entries will appear here when recorded.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Truck Number</th>
                    <th>Party Name</th>
                    <th>Commodity</th>
                    <th>In Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        {entry.truckNumber || entry.truck?.truckNumber || "—"}
                      </td>
                      <td>
                        {entry.partyName || entry.party?.partyName || "—"}
                      </td>
                      <td>{entry.commodity || "—"}</td>
                      <td>{formatTime(entry.inTime)}</td>
                      <td>{entry.status || "—"}</td>
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

export default WMDashboard;
