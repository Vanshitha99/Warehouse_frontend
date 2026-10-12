import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function LossReview() {
  const [lossRecords] = useState([
    {
      id: 1,
      truckNumber: "TS08AB1234",
      partyCode: "P001",
      partyName: "Sample Miller Party",
      expectedWeight: 15000,
      actualWeight: 14950,
      difference: 50,
      percentage: 0.33,
      status: "REVIEW",
    },
    {
      id: 2,
      truckNumber: "TS09CD5678",
      partyCode: "P002",
      partyName: "Rice Millers Association",
      expectedWeight: 14000,
      actualWeight: 14020,
      difference: -20,
      percentage: 0.14,
      status: "NORMAL",
    },
    {
      id: 3,
      truckNumber: "TS10EF9012",
      partyCode: "P001",
      partyName: "Sample Miller Party",
      expectedWeight: 18000,
      actualWeight: 17820,
      difference: 180,
      percentage: 1.0,
      status: "REVIEW",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRecords = lossRecords.filter((record) => {
    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      !search ||
      record.truckNumber.toLowerCase().includes(search) ||
      record.partyCode.toLowerCase().includes(search) ||
      record.partyName.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const reviewCount = lossRecords.filter(
    (record) => record.status === "REVIEW"
  ).length;

  const normalCount = lossRecords.filter(
    (record) => record.status === "NORMAL"
  ).length;

  const totalDifference = lossRecords.reduce(
    (total, record) =>
      total + Math.max(record.difference, 0),
    0
  );

  const handleClear = () => {
    setSearchText("");
    setStatusFilter("All");
  };

  return (
    <DashboardLayout>
      <div className="dashboard-page">

        {/* PAGE HEADER */}

        <div className="page-header">
          <div>
            <h1>Loss Review</h1>

            <p>
              Review weight differences and
              identify possible warehouse losses.
            </p>
          </div>
        </div>


        {/* SUMMARY */}

        <div className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">
              ⚠
            </div>

            <div>
              <p>Records Under Review</p>
              <h2>{reviewCount}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              ✓
            </div>

            <div>
              <p>Normal Records</p>
              <h2>{normalCount}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              ⚖
            </div>

            <div>
              <p>Weight Difference</p>
              <h2>{totalDifference} kg</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              ▤
            </div>

            <div>
              <p>Records Showing</p>
              <h2>{filteredRecords.length}</h2>
            </div>
          </div>

        </div>


        {/* FILTERS */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>
              <h2>Search Loss Records</h2>

              <p>
                Search by truck number, party code
                or party name.
              </p>
            </div>

          </div>


          <div className="report-history-filters">

            <div className="form-group">

              <label htmlFor="lossSearch">
                Search
              </label>

              <input
                id="lossSearch"
                type="text"
                placeholder="Search truck or party..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="lossStatus">
                Status
              </label>

              <select
                id="lossStatus"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All Records
                </option>

                <option value="REVIEW">
                  Under Review
                </option>

                <option value="NORMAL">
                  Normal
                </option>
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


        {/* LOSS TABLE */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>
              <h2>Weight Difference Records</h2>

              <p>
                Compare expected and actual
                commodity weights.
              </p>
            </div>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Truck Number</th>
                  <th>Party</th>
                  <th>Expected Weight</th>
                  <th>Actual Weight</th>
                  <th>Difference</th>
                  <th>Difference %</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {filteredRecords.length === 0 ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="empty-row"
                    >
                      No loss records found.
                    </td>
                  </tr>

                ) : (

                  filteredRecords.map((record) => (

                    <tr key={record.id}>

                      <td>
                        <strong>
                          {record.truckNumber}
                        </strong>
                      </td>


                      <td>

                        <strong>
                          {record.partyName}
                        </strong>

                        <small>
                          {record.partyCode}
                        </small>

                      </td>


                      <td>
                        {record.expectedWeight.toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </td>


                      <td>
                        {record.actualWeight.toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </td>


                      <td>

                        <strong
                          style={{
                            color:
                              record.difference > 0
                                ? "#b91c1c"
                                : "#15803d",
                          }}
                        >
                          {record.difference > 0
                            ? "-"
                            : "+"}
                          {Math.abs(
                            record.difference
                          ).toLocaleString("en-IN")}{" "}
                          kg
                        </strong>

                      </td>


                      <td>
                        {record.percentage.toFixed(2)}%
                      </td>


                      <td>

                        <span
                          className={
                            record.status === "REVIEW"
                              ? "status-badge inside"
                              : "status-badge exited"
                          }
                        >
                          {record.status}
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* CALCULATION INFORMATION */}

        <div className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>Loss Calculation</h2>

              <p>
                Weight differences are reviewed
                against the expected commodity weight.
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
                  Expected Weight
                </strong>

                <p>
                  Weight expected from the
                  operational transaction.
                </p>
              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                🚛
              </span>

              <div>
                <strong>
                  Actual Weight
                </strong>

                <p>
                  Weight recorded during
                  weighment.
                </p>
              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                ⚠
              </span>

              <div>
                <strong>
                  Difference
                </strong>

                <p>
                  Expected weight minus actual
                  weight is reviewed as a possible
                  loss.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default LossReview;