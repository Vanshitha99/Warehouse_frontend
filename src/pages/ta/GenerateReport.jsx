import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

function GenerateReport() {
const [reportType, setReportType] = useState("");
const [reportDate, setReportDate] = useState("");
const [reportTitle, setReportTitle] = useState("");
const [description, setDescription] = useState("");
const [generatedReports, setGeneratedReports] = useState([]);
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [preview, setPreview] = useState(null);

const isInPeriod = (value, type, period) => {
if (!value || !period) return false;


const date = new Date(value);
if (Number.isNaN(date.getTime())) return false;

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

return type === "Daily"
  ? `${year}-${month}-${day}` === period
  : `${year}-${month}` === period;


};

const fetchSavedReports = async () => {
try {
const response = await fetch(`${API}/generated-reports`);


  if (!response.ok) {
    throw new Error("Unable to load saved reports.");
  }

  const data = await response.json();

  setGeneratedReports(
    (Array.isArray(data) ? data : [])
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
  setError(err.message || "Unable to load saved reports.");
}


};

useEffect(() => {
fetchSavedReports();
}, []);

const handlePreview = async () => {
setMessage("");
setError("");
setPreview(null);


if (!reportType || !reportDate) {
  setMessage("Please select the report type and date or month.");
  return;
}

setLoading(true);

try {
  const [gateResponse, weighmentResponse] = await Promise.all([
    fetch(`${API}/gate-entries`),
    fetch(`${API}/weighments`),
  ]);

  if (!gateResponse.ok || !weighmentResponse.ok) {
    throw new Error("Unable to fetch warehouse records.");
  }

  const [gateData, weighmentData] = await Promise.all([
    gateResponse.json(),
    weighmentResponse.json(),
  ]);

  const entries = (
    Array.isArray(gateData) ? gateData : []
  ).filter((item) =>
    isInPeriod(item.inTime, reportType, reportDate)
  );

  const weighments = (
    Array.isArray(weighmentData) ? weighmentData : []
  ).filter((item) =>
    isInPeriod(item.createdAt, reportType, reportDate)
  );

  setPreview({
    gateEntryCount: entries.length,
    uniqueTruckCount: new Set(
      entries
        .map((item) => item.truckNumber?.trim().toUpperCase())
        .filter(Boolean)
    ).size,
    weighmentCount: weighments.length,
    exitedEntryCount: entries.filter(
      (item) => item.status?.toUpperCase() === "EXITED"
    ).length,
  });

  setMessage("Report data loaded from the backend.");
} catch (err) {
  setError(
    `${err.message} Check that the backend is running and accessible.`
  );
} finally {
  setLoading(false);
}


};

const handleGenerate = async () => {
setMessage("");
setError("");


if (!preview) {
  setMessage("Load the report data before generating the report.");
  return;
}

if (!reportTitle.trim()) {
  setMessage("Please enter a report title.");
  return;
}

setSaving(true);

try {
  /*
   * IMPORTANT:
   * These fields are required by your report entity classes.
   * The current preview does not calculate actual stock balances.
   * Do not treat the default zero values as real stock data.
   */
  const commonStockFields = {
    commodity: "Not specified",
    variety: "Not specified",
    openingBags: 0,
    openingWeight: 0,
  };

  let detailEndpoint;
  let detailPayload;

  if (reportType === "Daily") {
    detailEndpoint = `${API}/daily-reports`;

    detailPayload = {
      ...commonStockFields,
      reportDate: `${reportDate}T00:00:00`,
      receiptBags: 0,
      receiptWeight: 0,
      issueBags: 0,
      issueWeight: 0,
    };
  } else {
    const [year, month] = reportDate.split("-").map(Number);

    detailEndpoint = `${API}/monthly-reports`;

    detailPayload = {
      ...commonStockFields,
      month,
      year,
      totalReceiptBags: 0,
      totalReceiptWeight: 0,
      totalIssueBags: 0,
      totalIssueWeight: 0,
    };
  }

  // Save the detailed report first.
  const detailResponse = await fetch(detailEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(detailPayload),
  });

  if (!detailResponse.ok) {
    const details = await detailResponse.text();
    throw new Error(
      `Unable to save the detailed report: ${
        details || detailResponse.status
      }`
    );
  }

  // Save report history only after the detailed report succeeds.
  const historyPayload = {
    reportId: `RPT-${crypto.randomUUID()
      .slice(0, 8)
      .toUpperCase()}`,
    type: reportType,
    title: reportTitle.trim(),
    period: reportDate,
    status: "Generated",
    gateEntryCount: preview.gateEntryCount,
    uniqueTruckCount: preview.uniqueTruckCount,
    weighmentCount: preview.weighmentCount,
    exitedEntryCount: preview.exitedEntryCount,
  };

  const historyResponse = await fetch(
    `${API}/generated-reports`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(historyPayload),
    }
  );

  if (!historyResponse.ok) {
    const details = await historyResponse.text();
    throw new Error(
      `Detailed report saved, but report history failed: ${
        details || historyResponse.status
      }. Refresh before retrying to avoid duplicate records.`
    );
  }

  const savedReport = await historyResponse.json();

  setGeneratedReports((previous) => [
    savedReport,
    ...previous.filter((report) => report.id !== savedReport.id),
  ]);

  setMessage(
    "Detailed report and report history saved successfully. " +
      "Stock values currently use placeholders and must be replaced " +
      "with actual stock calculations."
  );

  setReportType("");
  setReportDate("");
  setReportTitle("");
  setDescription("");
  setPreview(null);
} catch (err) {
  setError(
    `${err.message} Check the backend logs and database before retrying.`
  );
} finally {
  setSaving(false);
}


};

const handleClear = () => {
setReportType("");
setReportDate("");
setReportTitle("");
setDescription("");
setPreview(null);
setMessage("");
setError("");
};

return ( <div className="gate-entry-page"> <div className="page-header"> <div> <h1>Generate Report</h1> <p>Create a daily or monthly warehouse operational report.</p> </div> </div>


  <div className="gate-entry-card">
    <div className="section-heading">
      <div>
        <h2>Report Details</h2>
        <p>
          Enter the required information and load actual warehouse data.
        </p>
      </div>
    </div>

    <form
      onSubmit={(event) => {
        event.preventDefault();
        handlePreview();
      }}
    >
      <div className="form-group">
        <label htmlFor="reportType">Report Type</label>
        <select
          id="reportType"
          value={reportType}
          onChange={(event) => {
            setReportType(event.target.value);
            setReportDate("");
            setPreview(null);
            setMessage("");
            setError("");
          }}
          required
        >
          <option value="">Select report type</option>
          <option value="Daily">Daily Report</option>
          <option value="Monthly">Monthly Report</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="reportDate">Report Date / Month</label>
        <input
          id="reportDate"
          type={reportType === "Monthly" ? "month" : "date"}
          value={reportDate}
          onChange={(event) => {
            setReportDate(event.target.value);
            setPreview(null);
            setMessage("");
            setError("");
          }}
          required
          disabled={!reportType}
        />
      </div>

      <div className="form-group">
        <label htmlFor="reportTitle">Report Title</label>
        <input
          id="reportTitle"
          type="text"
          placeholder="Enter report title"
          value={reportTitle}
          onChange={(event) => setReportTitle(event.target.value)}
          required
        />
      </div>

      <div className="form-group full-width">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows="5"
          placeholder="Enter report description or remarks"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={loading || saving}
        >
          {loading ? "Loading..." : "Load Report Data"}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={handleClear}
          disabled={loading || saving}
        >
          Clear
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}

      {error && (
        <p className="form-message" role="alert">
          {error}
        </p>
      )}
    </form>
  </div>

  {preview && (
    <div className="gate-entry-card">
      <div className="section-heading">
        <div>
          <h2>Report Preview</h2>
          <p>Calculated from the selected period's backend records.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">▤</div>
          <div>
            <p>Gate Entries</p>
            <h2>{preview.gateEntryCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <div>
            <p>Unique Trucks</p>
            <h2>{preview.uniqueTruckCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖</div>
          <div>
            <p>Weighments</p>
            <h2>{preview.weighmentCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <p>Completed Exits</p>
            <h2>{preview.exitedEntryCount}</h2>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="primary-button"
          onClick={handleGenerate}
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Generate & Save Report"}
        </button>
      </div>
    </div>
  )}

  <div className="gate-entry-card">
    <div className="section-heading">
      <div>
        <h2>Recently Generated Reports</h2>
        <p>Reports saved in the database.</p>
      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={fetchSavedReports}
      >
        Refresh
      </button>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Report Type</th>
            <th>Reporting Period</th>
            <th>Report Title</th>
            <th>Gate Entries</th>
            <th>Trucks</th>
            <th>Weighments</th>
            <th>Generated At</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {generatedReports.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-row">
                No saved reports found yet.
              </td>
            </tr>
          ) : (
            generatedReports.map((report) => (
              <tr key={report.id}>
                <td>
                  <strong>{report.reportId}</strong>
                </td>
                <td>{report.type}</td>
                <td>{report.period}</td>
                <td>{report.title}</td>
                <td>{report.gateEntryCount ?? 0}</td>
                <td>{report.uniqueTruckCount ?? 0}</td>
                <td>{report.weighmentCount ?? 0}</td>
                <td>
                  {report.generatedAt
                    ? new Date(report.generatedAt).toLocaleString()
                    : "—"}
                </td>
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
</div>


);
}

export default GenerateReport;
