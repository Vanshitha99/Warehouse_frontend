
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { API_BASE_URL } from "../../services/api";

const API_BASE = API_BASE_URL;

function getApprovalStatus(approval) {
  return String(
    approval.status ??
      approval.approvalStatus ??
      approval.decisionStatus ??
      ""
  )
    .trim()
    .toUpperCase();
}

function getApprovalDate(approval) {
  const value =
    approval.createdAt ??
    approval.submittedAt ??
    approval.requestedAt ??
    approval.date ??
    null;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPeriodStart(period) {
  const now = new Date();
  const start = new Date(now);

  if (period === "Today") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "This Week") {
    start.setHours(0, 0, 0, 0);

    // Monday is the first day of the week.
    const day = start.getDay();
    const daysSinceMonday = (day + 6) % 7;

    start.setDate(start.getDate() - daysSinceMonday);
  } else if (period === "This Month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return start;
}

function Analytics() {
  const [period, setPeriod] = useState("Today");
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary operational figures.
  // These will be connected to their APIs separately.
  const operationalData = {
    Today: {
      gateEntries: 24,
      trucks: 21,
      weighments: 18,
      commodityWeight: 285000,
      completed: 20,
      reviewed: 15,
    },
    "This Week": {
      gateEntries: 142,
      trucks: 128,
      weighments: 119,
      commodityWeight: 1685000,
      completed: 125,
      reviewed: 102,
    },
    "This Month": {
      gateEntries: 486,
      trucks: 451,
      weighments: 428,
      commodityWeight: 5820000,
      completed: 439,
      reviewed: 387,
    },
  };

  // Fetch actual approval records from Spring Boot.
  useEffect(() => {
    const controller = new AbortController();

    async function loadApprovals() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE}/approvals`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Approvals API returned HTTP ${response.status}.`
          );
        }

        const result = await response.json();

        // Support an array or common wrapped API responses.
        const records = Array.isArray(result)
          ? result
          : Array.isArray(result.content)
          ? result.content
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.approvals)
          ? result.approvals
          : null;

        if (!records) {
          throw new Error(
            "The Approvals API did not return an approval list."
          );
        }

        setApprovals(records);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Unable to load approvals:", err);
          setError(
            err.message || "Unable to load approval records."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadApprovals();

    return () => controller.abort();
  }, []);

  // Period-filtered approvals, available if needed for
  // future period-specific analytics.
  const periodApprovals = useMemo(() => {
    const start = getPeriodStart(period);
    const end = new Date();

    return approvals.filter((approval) => {
      const date = getApprovalDate(approval);

      // Keep records with missing dates rather than silently
      // excluding them.
      if (!date) return true;

      return date >= start && date <= end;
    });
  }, [approvals, period]);

  // Count ALL approval records, matching the overall
  // approval totals shown on the Approvals page.
  const approvalCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    for (const approval of approvals) {
      const status = getApprovalStatus(approval);

      if (
        status.includes("PENDING") ||
        status === "SUBMITTED" ||
        status === "UNDER_REVIEW" ||
        status === "WAITING"
      ) {
        pending++;
      } else if (
        status.includes("APPROV") ||
        status === "ACCEPTED"
      ) {
        approved++;
      } else if (
        status.includes("REJECT") ||
        status === "DECLINED"
      ) {
        rejected++;
      }
    }

    return {
      pending,
      approved,
      rejected,
      total: approvals.length,
    };
  }, [approvals]);

  const data = operationalData[period];

  const completionRate =
    data.gateEntries > 0
      ? ((data.completed / data.gateEntries) * 100).toFixed(1)
      : "0.0";

  const approvalRate =
    data.weighments > 0
      ? ((data.reviewed / data.weighments) * 100).toFixed(1)
      : "0.0";

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <h1>Analytics</h1>
            <p>
              Analyze warehouse operational performance and activity.
            </p>
          </div>
        </div>

        {/* PERIOD FILTER */}
        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Analytics Period</h2>
              <p>
                Select the period for the operational analysis.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="analyticsPeriod">Period</label>
            <select
              id="analyticsPeriod"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>

        {/* MAIN STATISTICS */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">▤</div>
            <div>
              <p>Gate Entries</p>
              <h2>{data.gateEntries}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚛</div>
            <div>
              <p>Trucks</p>
              <h2>{data.trucks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚖</div>
            <div>
              <p>Weighments</p>
              <h2>{data.weighments}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">◈</div>
            <div>
              <p>Commodity Weight</p>
              <h2>
                {data.commodityWeight.toLocaleString("en-IN")}
              </h2>
            </div>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Performance Overview</h2>
              <p>Key operational performance indicators.</p>
            </div>
          </div>

          <div className="quick-actions">
            <div className="quick-action">
              <span className="quick-icon">✓</span>
              <div>
                <strong>Completion Rate</strong>
                <p>
                  {completionRate}% of gate entries completed.
                </p>
              </div>
            </div>

            <div className="quick-action">
              <span className="quick-icon">✓</span>
              <div>
                <strong>Review Rate</strong>
                <p>
                  {approvalRate}% of weighments reviewed.
                </p>
              </div>
            </div>

            <div className="quick-action">
              <span className="quick-icon">⚠</span>
              <div>
                <strong>Pending Approvals</strong>
                <p>
                  {loading
                    ? "Loading approval records..."
                    : error
                    ? "Approval count unavailable."
                    : `${approvalCounts.pending} transactions currently pending.`}
                </p>

                {error && (
                  <p role="alert" style={{ color: "#b91c1c" }}>
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OPERATIONAL BREAKDOWN */}
        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Operational Breakdown</h2>
              <p>Summary of major warehouse activities.</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Interpretation</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Gate Entries</td>
                  <td>{data.gateEntries}</td>
                  <td>Trucks recorded at the warehouse gate.</td>
                </tr>

                <tr>
                  <td>Trucks</td>
                  <td>{data.trucks}</td>
                  <td>Truck records processed during the period.</td>
                </tr>

                <tr>
                  <td>Weighments</td>
                  <td>{data.weighments}</td>
                  <td>Weighment transactions recorded.</td>
                </tr>

                <tr>
                  <td>Commodity Weight</td>
                  <td>
                    {data.commodityWeight.toLocaleString("en-IN")} kg
                  </td>
                  <td>Total commodity weight recorded.</td>
                </tr>

                <tr>
                  <td>Completed Entries</td>
                  <td>{data.completed}</td>
                  <td>Gate entries completed successfully.</td>
                </tr>

                <tr>
                  <td>Pending Approvals</td>
                  <td>
                    {loading
                      ? "Loading..."
                      : error
                      ? "Unavailable"
                      : approvalCounts.pending}
                  </td>
                  <td>Transactions waiting for manager review.</td>
                </tr>

                <tr>
                  <td>Approved Requests</td>
                  <td>
                    {loading
                      ? "Loading..."
                      : error
                      ? "Unavailable"
                      : approvalCounts.approved}
                  </td>
                  <td>Requests approved by the manager.</td>
                </tr>

                <tr>
                  <td>Rejected Requests</td>
                  <td>
                    {loading
                      ? "Loading..."
                      : error
                      ? "Unavailable"
                      : approvalCounts.rejected}
                  </td>
                  <td>Requests rejected by the manager.</td>
                </tr>

                <tr>
                  <td>Total Approval Requests</td>
                  <td>
                    {loading
                      ? "Loading..."
                      : error
                      ? "Unavailable"
                      : approvalCounts.total}
                  </td>
                  <td>All approval records in the database.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALYTICS INSIGHTS */}
        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Analytics Insights</h2>
              <p>
                Areas that can be analyzed from the warehouse database.
              </p>
            </div>
          </div>

          <div className="quick-actions">
            <div className="quick-action">
              <span className="quick-icon">🚛</span>
              <div>
                <strong>Truck Movement</strong>
                <p>
                  Analyze incoming, outgoing and active trucks.
                </p>
              </div>
            </div>

            <div className="quick-action">
              <span className="quick-icon">⚖</span>
              <div>
                <strong>Weight Analysis</strong>
                <p>
                  Analyze commodity weights and weight differences.
                </p>
              </div>
            </div>

            <div className="quick-action">
              <span className="quick-icon">◈</span>
              <div>
                <strong>Operational Trends</strong>
                <p>
                  Compare warehouse activity across different periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;