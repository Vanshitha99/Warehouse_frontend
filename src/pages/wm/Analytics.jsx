import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Analytics() {
  const [period, setPeriod] = useState("Today");

  /*
   * TEMPORARY ANALYTICS DATA
   *
   * Later this will be calculated from:
   * Spring Boot → MySQL
   */

  const analyticsData = {
    Today: {
      gateEntries: 24,
      trucks: 21,
      weighments: 18,
      commodityWeight: 285000,
      completed: 20,
      pending: 3,
      reviewed: 15,
    },

    "This Week": {
      gateEntries: 142,
      trucks: 128,
      weighments: 119,
      commodityWeight: 1685000,
      completed: 125,
      pending: 7,
      reviewed: 102,
    },

    "This Month": {
      gateEntries: 486,
      trucks: 451,
      weighments: 428,
      commodityWeight: 5820000,
      completed: 439,
      pending: 12,
      reviewed: 387,
    },
  };

  const data = analyticsData[period];

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

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              Analytics
            </h1>

            <p>
              Analyze warehouse operational
              performance and activity.
            </p>

          </div>

        </div>


        {/* PERIOD FILTER */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>

              <h2>
                Analytics Period
              </h2>

              <p>
                Select the period for the
                operational analysis.
              </p>

            </div>

          </div>


          <div className="form-group">

            <label htmlFor="analyticsPeriod">
              Period
            </label>

            <select
              id="analyticsPeriod"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
            >

              <option value="Today">
                Today
              </option>

              <option value="This Week">
                This Week
              </option>

              <option value="This Month">
                This Month
              </option>

            </select>

          </div>

        </div>


        {/* MAIN STATISTICS */}

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
                {data.gateEntries}
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
                {data.trucks}
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
                {data.weighments}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ◈
            </div>

            <div>

              <p>
                Commodity Weight
              </p>

              <h2>
                {data.commodityWeight.toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

          </div>

        </div>


        {/* PERFORMANCE */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>

              <h2>
                Performance Overview
              </h2>

              <p>
                Key operational performance
                indicators.
              </p>

            </div>

          </div>


          <div className="quick-actions">

            <div className="quick-action">

              <span className="quick-icon">
                ✓
              </span>

              <div>

                <strong>
                  Completion Rate
                </strong>

                <p>
                  {completionRate}% of gate entries
                  completed.
                </p>

              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                ✓
              </span>

              <div>

                <strong>
                  Review Rate
                </strong>

                <p>
                  {approvalRate}% of weighments
                  reviewed.
                </p>

              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                ⚠
              </span>

              <div>

                <strong>
                  Pending Approvals
                </strong>

                <p>
                  {data.pending} transactions
                  currently pending.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* OPERATIONAL BREAKDOWN */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>

              <h2>
                Operational Breakdown
              </h2>

              <p>
                Summary of major warehouse
                activities.
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
                    Interpretation
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td>
                    Gate Entries
                  </td>

                  <td>
                    {data.gateEntries}
                  </td>

                  <td>
                    Trucks recorded at the
                    warehouse gate.
                  </td>

                </tr>


                <tr>

                  <td>
                    Trucks
                  </td>

                  <td>
                    {data.trucks}
                  </td>

                  <td>
                    Truck records processed
                    during the period.
                  </td>

                </tr>


                <tr>

                  <td>
                    Weighments
                  </td>

                  <td>
                    {data.weighments}
                  </td>

                  <td>
                    Weighment transactions
                    recorded.
                  </td>

                </tr>


                <tr>

                  <td>
                    Commodity Weight
                  </td>

                  <td>
                    {data.commodityWeight.toLocaleString(
                      "en-IN"
                    )}{" "}
                    kg
                  </td>

                  <td>
                    Total commodity weight
                    recorded.
                  </td>

                </tr>


                <tr>

                  <td>
                    Completed Entries
                  </td>

                  <td>
                    {data.completed}
                  </td>

                  <td>
                    Gate entries completed
                    successfully.
                  </td>

                </tr>


                <tr>

                  <td>
                    Pending Approvals
                  </td>

                  <td>
                    {data.pending}
                  </td>

                  <td>
                    Transactions waiting for
                    manager review.
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* ANALYTICS INFORMATION */}

        <div className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Analytics Insights
              </h2>

              <p>
                Areas that can be analyzed from
                the warehouse database.
              </p>

            </div>

          </div>


          <div className="quick-actions">

            <div className="quick-action">

              <span className="quick-icon">
                🚛
              </span>

              <div>

                <strong>
                  Truck Movement
                </strong>

                <p>
                  Analyze incoming, outgoing and
                  active trucks.
                </p>

              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                ⚖
              </span>

              <div>

                <strong>
                  Weight Analysis
                </strong>

                <p>
                  Analyze commodity weights and
                  weight differences.
                </p>

              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                ◈
              </span>

              <div>

                <strong>
                  Operational Trends
                </strong>

                <p>
                  Compare warehouse activity
                  across different periods.
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