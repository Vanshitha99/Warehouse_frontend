
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const API_URL = `${API_BASE_URL}/generated-reports`;

function ReportHistory() {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to load reports (${response.status})`);
      }

      const data = await response.json();

      // Display only supported report types.
      setReports(
        data
          .filter(
            (report) =>
              report.type === "Daily" || report.type === "Monthly"
          )
          .sort(
            (a, b) =>
              new Date(b.generatedAt) - new Date(a.generatedAt)
          )
      );
    } catch (err) {
      setError(
        "Could not load report history. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const search = searchText.trim().toLowerCase();

  const filteredReports = reports.filter((report) => {
    const matchesType =
      filterType === "All" || report.type === filterType;

    const matchesSearch =
      !search ||
      String(report.reportId || "").toLowerCase().includes(search) ||
      String(report.title || "").toLowerCase().includes(search) ||
      String(report.period || "").toLowerCase().includes(search);

    return matchesType && matchesSearch;
  });

  const handleClear = () => {
    setSearchText("");
    setFilterType("All");
  };

  const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString();
  };

  return (
    <div className="gate-entry-page">
      <div className="page-header">
        <div>
          <h1>Report History</h1>
          <p>View previously generated warehouse reports and their status.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={fetchReports}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Reports"}
        </button>
      </div>

      <div className="gate-entry-card">
        <div className="section-heading">
          <div>
            <h2>Search Reports</h2>
            <p>Search by report ID, title or reporting period.</p>
          </div>
        </div>

        <div className="report-history-filters">
          <div className="form-group">
            <label htmlFor="searchReports">Search</label>
            <input
              id="searchReports"
              type="text"
              placeholder="Search reports..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reportTypeFilter">Report Type</label>
            <select
              id="reportTypeFilter"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
            >
              <option value="All">All Reports</option>
              <option value="Daily">Daily Reports</option>
              <option value="Monthly">Monthly Reports</option>
            </select>
          </div>

          <div className="report-filter-action">
            <button
              type="button"
              className="secondary-button"
              onClick={handleClear}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="gate-entry-card">
        <div className="section-heading">
          <div>
            <h2>Generated Reports</h2>
            <p>Previously generated daily and monthly reports.</p>
          </div>

          <div>
            <strong>{filteredReports.length}</strong>{" "}
            report{filteredReports.length !== 1 ? "s" : ""}
          </div>
        </div>

        {error && (
          <div role="alert" className="error-message">
            {error}
            <button type="button" onClick={fetchReports}>
              Try Again
            </button>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Type</th>
                <th>Report Title</th>
                <th>Reporting Period</th>
                <th>Generated At</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Loading reports...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Reports could not be loaded.
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No saved reports found. Generate a daily or monthly
                    report first.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <strong>{report.reportId}</strong>
                    </td>
                    <td>{report.type}</td>
                    <td>{report.title}</td>
                    <td>{report.period}</td>
                    <td>{formatDateTime(report.generatedAt)}</td>
                    <td>
                      <span className="status-badge exited">
                        {report.status || "Generated"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Report History Information</h2>
            <p>
              Reports saved in the database remain available when you
              reopen this page.
            </p>
          </div>
        </div>

        <div className="quick-actions">
          <div className="quick-action">
            <span className="quick-icon">▤</span>
            <div>
              <strong>Daily Reports</strong>
              <p>Previously generated daily warehouse reports.</p>
            </div>
          </div>

          <div className="quick-action">
            <span className="quick-icon">▣</span>
            <div>
              <strong>Monthly Reports</strong>
              <p>Previously generated monthly warehouse reports.</p>
            </div>
          </div>

          <div className="quick-action">
            <span className="quick-icon">✓</span>
            <div>
              <strong>Report Status</strong>
              <p>Track the status of saved reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportHistory;

