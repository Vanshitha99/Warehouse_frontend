import { useState } from "react";

const API = "http://localhost:8080/api";

function MonthlyReports() {
const [selectedMonth, setSelectedMonth] = useState("");
const [reports, setReports] = useState([]);
const [entries, setEntries] = useState([]);
const [weighments, setWeighments] = useState([]);
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const isInMonth = (value, month) => {
if (!value || !month) return false;

const date = new Date(value);
if (Number.isNaN(date.getTime())) return false;

const recordMonth = `${date.getFullYear()}-${String(
  date.getMonth() + 1
).padStart(2, "0")}`;

return recordMonth === month;


};

const handleViewReport = async (event) => {
event.preventDefault();
setMessage("");
setError("");


if (!selectedMonth) {
  setMessage("Please select a month.");
  return;
}

setLoading(true);

try {
  const [gateResponse, weighmentResponse] = await Promise.all([
    fetch(`${API}/gate-entries`),
    fetch(`${API}/weighments`),
  ]);

  if (!gateResponse.ok || !weighmentResponse.ok) {
    throw new Error("Could not retrieve records from the backend.");
  }

  const [gateData, weighmentData] = await Promise.all([
    gateResponse.json(),
    weighmentResponse.json(),
  ]);

  const allEntries = Array.isArray(gateData) ? gateData : [];
  const allWeighments = Array.isArray(weighmentData)
    ? weighmentData
    : [];

  const monthlyEntries = allEntries.filter((item) =>
    isInMonth(item.inTime, selectedMonth)
  );

  const monthlyWeighments = allWeighments.filter((item) =>
    isInMonth(item.createdAt, selectedMonth)
  );

  const report = {
    id: selectedMonth,
    month: selectedMonth,
    gateEntries: monthlyEntries.length,
    trucks: new Set(
      monthlyEntries
        .map((item) => item.truckNumber?.trim().toUpperCase())
        .filter(Boolean)
    ).size,
    weighments: monthlyWeighments.length,
    completed: monthlyEntries.filter(
      (item) => item.status?.toUpperCase() === "EXITED"
    ).length,
    status: "Loaded",
  };

  setEntries(monthlyEntries);
  setWeighments(monthlyWeighments);

  setReports((previous) => [
    report,
    ...previous.filter((item) => item.month !== selectedMonth),
  ]);

  setMessage(`Monthly report loaded for ${selectedMonth}.`);
} catch (err) {
  setError(
    `${err.message} Check that the backend is running and accessible.`
  );
} finally {
  setLoading(false);
}


};

const handleClear = () => {
setSelectedMonth("");
setReports([]);
setEntries([]);
setWeighments([]);
setMessage("");
setError("");
};

const hasReport = reports.some(
(item) => item.month === selectedMonth
);

return ( <div className="gate-entry-page"> <div className="page-header"> <div> <h1>Monthly Reports</h1> <p>View monthly warehouse operational reports and activity.</p> </div> </div>

```
  <div className="gate-entry-card">
    <div className="section-heading">
      <div>
        <h2>Select Reporting Month</h2>
        <p>Choose a month to view the warehouse monthly report.</p>
      </div>
    </div>

    <form onSubmit={handleViewReport}>
      <div className="form-group">
        <label htmlFor="reportMonth">Reporting Month</label>
        <input
          id="reportMonth"
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "View Report"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}
      {error && <p className="form-message" role="alert">{error}</p>}
    </form>
  </div>

  <div className="gate-entry-card">
    <div className="section-heading">
      <div>
        <h2>Monthly Report Summary</h2>
        <p>Operational summary for the selected reporting month.</p>
      </div>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Reporting Month</th>
            <th>Gate Entries</th>
            <th>Trucks</th>
            <th>Weighments</th>
            <th>Completed</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-row">
                No monthly reports selected yet.
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.month}</td>
                <td>{report.gateEntries}</td>
                <td>{report.trucks}</td>
                <td>{report.weighments}</td>
                <td>{report.completed}</td>
                <td>
                  <span className="status-badge exited">
                    {report.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>

  {hasReport && (
    <>
      <div className="gate-entry-card">
        <div className="section-heading">
          <div>
            <h2>Gate Entry Details</h2>
            <p>Entries recorded during {selectedMonth}.</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Truck Number</th>
                <th>Party</th>
                <th>Commodity</th>
                <th>Bags</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No gate entries found for this month.
                  </td>
                </tr>
              ) : (
                entries.map((item) => (
                  <tr key={item.id}>
                    <td>{item.truckNumber || "—"}</td>
                    <td>{item.partyName || "—"}</td>
                    <td>{item.commodity || "—"}</td>
                    <td>{item.numberOfBags ?? "—"}</td>
                    <td>
                      {item.inTime
                        ? new Date(item.inTime).toLocaleString("en-IN")
                        : "—"}
                    </td>
                    <td>
                      {item.outTime
                        ? new Date(item.outTime).toLocaleString("en-IN")
                        : "—"}
                    </td>
                    <td>{item.status || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="gate-entry-card">
        <div className="section-heading">
          <div>
            <h2>Weighment Details</h2>
            <p>Weighments recorded during {selectedMonth}.</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Truck Number</th>
                <th>Party</th>
                <th>Acknowledgement No.</th>
                <th>Weighbill No.</th>
                <th>Load Weight</th>
                <th>Stack</th>
                <th>Godown</th>
              </tr>
            </thead>
            <tbody>
              {weighments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No weighments found for this month.
                  </td>
                </tr>
              ) : (
                weighments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.truckNumber || "—"}</td>
                    <td>{item.partyName || "—"}</td>
                    <td>{item.acknowledgementNumber || "—"}</td>
                    <td>{item.weighBillNumber || "—"}</td>
                    <td>{item.loadedWeight ?? "—"}</td>
                    <td>{item.stackNumber || "—"}</td>
                    <td>{item.godownNumber || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

  <div className="dashboard-section">
    <div className="section-heading">
      <div>
        <h2>Monthly Report Information</h2>
        <p>
          Monthly summaries are calculated from actual warehouse
          gate-entry and weighment records.
        </p>
      </div>
    </div>

    <div className="quick-actions">
      <div className="quick-action">
        <span className="quick-icon">▤</span>
        <div>
          <strong>Gate Entry Summary</strong>
          <p>Total gate entries recorded during the month.</p>
        </div>
      </div>

      <div className="quick-action">
        <span className="quick-icon">🚛</span>
        <div>
          <strong>Truck Summary</strong>
          <p>Unique trucks recorded in monthly gate entries.</p>
        </div>
      </div>

      <div className="quick-action">
        <span className="quick-icon">⚖</span>
        <div>
          <strong>Weighment Summary</strong>
          <p>Total weighment operations during the month.</p>
        </div>
      </div>
    </div>
  </div>
</div>


);
}

export default MonthlyReports;
