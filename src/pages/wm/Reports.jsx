import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Reports() {
  const [reportType, setReportType] = useState("Daily");
  const [reportDate, setReportDate] = useState("");

  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");

  const handleViewReport = (event) => {
    event.preventDefault();

    setMessage("");

    if (!reportDate) {
      setMessage("Please select a date or month.");
      return;
    }

    /*
     * TEMPORARY REPORT DATA
     *
     * Later this will come from:
     * Spring Boot → MySQL
     */

    const generatedReport = {
      type: reportType,
      period: reportDate,
      gateEntries: 24,
      trucks: 21,
      weighments: 18,
      commodityWeight: 285000,
      pendingApprovals: 3,
      completedEntries: 20,
    };

    setReport(generatedReport);

    setMessage(
      `${reportType} report loaded successfully.`
    );
  };

  const handleClear = () => {
    setReportType("Daily");
    setReportDate("");
    setReport(null);
    setMessage("");
  };

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              Reports
            </h1>

            <p>
              View warehouse operational reports
              and performance summaries.
            </p>

          </div>

        </div>


        {/* REPORT FILTER */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>

              <h2>
                Select Report
              </h2>

              <p>
                Choose a report type and reporting
                period.
              </p>

            </div>

          </div>


          <form onSubmit={handleViewReport}>

            <div className="form-group">

              <label htmlFor="wmReportType">
                Report Type
              </label>

              <select
                id="wmReportType"
                value={reportType}
                onChange={(event) =>
                  setReportType(event.target.value)
                }
              >

                <option value="Daily">
                  Daily Report
                </option>

                <option value="Monthly">
                  Monthly Report
                </option>

              </select>

            </div>


            <div className="form-group">

              <label htmlFor="wmReportDate">
                {reportType === "Monthly"
                  ? "Reporting Month"
                  : "Report Date"}
              </label>

              <input
                id="wmReportDate"
                type={
                  reportType === "Monthly"
                    ? "month"
                    : "date"
                }
                value={reportDate}
                onChange={(event) =>
                  setReportDate(event.target.value)
                }
              />

            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                View Report
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleClear}
              >
                Clear
              </button>

            </div>


            {message && (
              <p className="form-message">
                {message}
              </p>
            )}

          </form>

        </div>


        {/* REPORT SUMMARY */}

        {report && (

          <>

            <div className="dashboard-stats">

              <div className="stat-card">

                <div className="stat-icon">
                  ▤
                </div>

                <div>

                  <p>
                    Gate Entries
                  </p>

                  <h2>
                    {report.gateEntries}
                  </h2>

                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  🚛
                </div>

                <div>

                  <p>
                    Trucks
                  </p>

                  <h2>
                    {report.trucks}
                  </h2>

                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  ⚖
                </div>

                <div>

                  <p>
                    Weighments
                  </p>

                  <h2>
                    {report.weighments}
                  </h2>

                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  ⚠
                </div>

                <div>

                  <p>
                    Pending Approvals
                  </p>

                  <h2>
                    {report.pendingApprovals}
                  </h2>

                </div>

              </div>

            </div>


            {/* WEIGHT SUMMARY */}

            <div className="gate-entry-card">

              <div className="section-heading">

                <div>

                  <h2>
                    Weight Summary
                  </h2>

                  <p>
                    Total commodity weight recorded
                    during the selected period.
                  </p>

                </div>

              </div>


              <div className="quick-actions">

                <div className="quick-action">

                  <span className="quick-icon">
                    ⚖
                  </span>

                  <div>

                    <strong>
                      Commodity Weight
                    </strong>

                    <p>
                      {report.commodityWeight.toLocaleString(
                        "en-IN"
                      )}{" "}
                      kg
                    </p>

                  </div>

                </div>


                <div className="quick-action">

                  <span className="quick-icon">
                    ✓
                  </span>

                  <div>

                    <strong>
                      Completed Entries
                    </strong>

                    <p>
                      {report.completedEntries}
                    </p>

                  </div>

                </div>


                <div className="quick-action">

                  <span className="quick-icon">
                    ◷
                  </span>

                  <div>

                    <strong>
                      Pending Approvals
                    </strong>

                    <p>
                      {report.pendingApprovals}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* REPORT DETAILS */}

            <div className="gate-entry-card">

              <div className="section-heading">

                <div>

                  <h2>
                    Report Details
                  </h2>

                  <p>
                    Operational summary for the
                    selected reporting period.
                  </p>

                </div>

              </div>


              <div className="table-container">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Metric
                      </th>

                      <th>
                        Value
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr>

                      <td>
                        Gate Entries
                      </td>

                      <td>
                        {report.gateEntries}
                      </td>

                      <td>
                        <span className="status-badge exited">
                          Recorded
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Trucks
                      </td>

                      <td>
                        {report.trucks}
                      </td>

                      <td>
                        <span className="status-badge exited">
                          Recorded
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Weighments
                      </td>

                      <td>
                        {report.weighments}
                      </td>

                      <td>
                        <span className="status-badge exited">
                          Recorded
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Commodity Weight
                      </td>

                      <td>
                        {report.commodityWeight.toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </td>

                      <td>
                        <span className="status-badge exited">
                          Recorded
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Completed Entries
                      </td>

                      <td>
                        {report.completedEntries}
                      </td>

                      <td>
                        <span className="status-badge exited">
                          Completed
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Pending Approvals
                      </td>

                      <td>
                        {report.pendingApprovals}
                      </td>

                      <td>
                        <span className="status-badge inside">
                          Pending
                        </span>
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}


        {/* EMPTY STATE */}

        {!report && (

          <div className="gate-entry-card">

            <div className="activity-empty">

              <div className="empty-icon">
                ▤
              </div>

              <h3>
                No Report Selected
              </h3>

              <p>
                Select a report type and reporting
                period to view the warehouse
                operational summary.
              </p>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Reports;