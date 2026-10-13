import { useState } from "react";
import { API_BASE_URL } from "../../services/api";

const API = API_BASE_URL;

function DailyReports() {
const [selectedDate, setSelectedDate] = useState("");
const [reports, setReports] = useState([]);
const [entries, setEntries] = useState([]);
const [weighments, setWeighments] = useState([]);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const isOnDate = (value, date) => {
if (!value || !date) return false;


const parsed = new Date(value);
if (Number.isNaN(parsed.getTime())) return false;

const year = parsed.getFullYear();
const month = String(parsed.getMonth() + 1).padStart(2, "0");
const day = String(parsed.getDate()).padStart(2, "0");

return `${year}-${month}-${day}` === date;


};

const handleViewReport = async (event) => {
event.preventDefault();
setMessage("");
setError("");


if (!selectedDate) {
  setMessage("Please select a date.");
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

  const dailyEntries = allEntries.filter((item) =>
    isOnDate(item.inTime, selectedDate)
  );

  const dailyWeighments = allWeighments.filter((item) =>
    isOnDate(item.createdAt, selectedDate)
  );

  const exitedEntries = dailyEntries.filter(
    (item) => item.status?.toUpperCase() === "EXITED"
  );

  const report = {
    id: selectedDate,
    date: selectedDate,
    gateEntries: dailyEntries.length,
    trucks: new Set(
      dailyEntries
        .map((item) => item.truckNumber?.trim().toUpperCase())
        .filter(Boolean)
    ).size,
    weighments: dailyWeighments.length,
    completed: exitedEntries.length,
    status: "Loaded",
  };

  setEntries(dailyEntries);
  setWeighments(dailyWeighments);

  setReports((previous) => [
    report,
    ...previous.filter((item) => item.date !== selectedDate),
  ]);

  setMessage(`Daily report loaded for ${selectedDate}.`);
} catch (err) {
  setError(
    `${err.message} Check that the backend is running and the browser can access it.`
  );
} finally {
  setLoading(false);
}


};

const handleClear = () => {
setSelectedDate("");
setReports([]);
setEntries([]);
setWeighments([]);
setMessage("");
setError("");
};

const hasReport = reports.some((item) => item.date === selectedDate);

return ( <div className="gate-entry-page"> <div className="page-header"> <div> <h1>Daily Reports</h1> <p>
View daily warehouse operational reports and activity. </p> </div> </div>

```
  <div className="gate-entry-card">
    <div className="section-heading">
      <div>
        <h2>Select Report Date</h2>
        <p>Choose a date to view the daily warehouse report.</p>
      </div>
    </div>

    <form onSubmit={handleViewReport}>
      <div className="form-group">
        <label htmlFor="reportDate">Report Date</label>
        <input
          id="reportDate"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
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
        <h2>Daily Report Summary</h2>
        <p>Operational summary for the selected date.</p>
      </div>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Report Date</th>
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
                No daily reports selected yet.
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.date}</td>
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
            <p>Truck entries recorded on {selectedDate}.</p>
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
                    No gate entries found for this date.
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
            <p>Weighments recorded on {selectedDate}.</p>
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
                    No weighments found for this date.
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
        <h2>Report Information</h2>
        <p>
          Daily summaries are calculated from actual gate-entry and
          weighment records in the backend.
        </p>
      </div>
    </div>

    <div className="quick-actions">
      <div className="quick-action">
        <span className="quick-icon">▤</span>
        <div>
          <strong>Gate Entries</strong>
          <p>Trucks recorded at the warehouse gate.</p>
        </div>
      </div>

      <div className="quick-action">
        <span className="quick-icon">🚛</span>
        <div>
          <strong>Truck Operations</strong>
          <p>Truck and bag information recorded during the day.</p>
        </div>
      </div>

      <div className="quick-action">
        <span className="quick-icon">⚖</span>
        <div>
          <strong>Weighments</strong>
          <p>Weighment transactions for the selected date.</p>
        </div>
      </div>
    </div>
  </div>
</div>


);
}

export default DailyReports;
