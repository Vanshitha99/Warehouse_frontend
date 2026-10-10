import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

function Trucks() {
  const [searchText, setSearchText] = useState("");

  /*
   * Temporary frontend data.
   *
   * Later this will come from:
   * Spring Boot → MySQL → trucks table
   *
   * JA records the truck weights.
   * WM reviews the records here.
   */

  const [trucks] = useState([
    {
      id: 1,
      truckNumber: "TS08AB1234",
      loadedWeight: 25450,
      emptyWeight: 10450,
      commodityWeight: 15000,
      bags: 300,
      date: "03 Oct 2026, 10:30 AM",
    },
    {
      id: 2,
      truckNumber: "TS09CD5678",
      loadedWeight: 23800,
      emptyWeight: 9800,
      commodityWeight: 14000,
      bags: 280,
      date: "03 Oct 2026, 11:45 AM",
    },
  ]);

  const filteredTrucks = trucks.filter((truck) => {
    const search =
      searchText.trim().toLowerCase();

    return (
      !search ||
      truck.truckNumber
        .toLowerCase()
        .includes(search)
    );
  });

  const totalCommodityWeight =
    filteredTrucks.reduce(
      (total, truck) =>
        total + truck.commodityWeight,
      0
    );

  const totalBags =
    filteredTrucks.reduce(
      (total, truck) =>
        total + truck.bags,
      0
    );

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              Trucks
            </h1>

            <p>
              Review truck weights and commodity
              quantities recorded by JA.
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>

              <h2>
                Search Trucks
              </h2>

              <p>
                Search truck records using the
                truck number.
              </p>

            </div>

          </div>


          <div className="report-history-filters">

            <div className="form-group">

              <label htmlFor="truckSearch">
                Truck Number
              </label>

              <input
                id="truckSearch"
                type="text"
                placeholder="Search truck number..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
              />

            </div>


            <div></div>


            <div className="report-filter-action">

              <button
                type="button"
                className="secondary-button"
                onClick={handleClear}
              >
                Clear Search
              </button>

            </div>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              🚛
            </div>

            <div>

              <p>
                Total Trucks
              </p>

              <h2>
                {filteredTrucks.length}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⚖
            </div>

            <div>

              <p>
                Commodity Weight
              </p>

              <h2>
                {totalCommodityWeight.toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ▤
            </div>

            <div>

              <p>
                Total Bags
              </p>

              <h2>
                {totalBags.toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>

              <p>
                Records Showing
              </p>

              <h2>
                {filteredTrucks.length}
              </h2>

            </div>

          </div>

        </div>


        {/* TRUCK TABLE */}

        <div className="gate-entry-card">

          <div className="section-heading">

            <div>

              <h2>
                Truck Records
              </h2>

              <p>
                Centralized truck weight records.
              </p>

            </div>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Truck Number
                  </th>

                  <th>
                    Loaded Weight
                  </th>

                  <th>
                    Empty Weight
                  </th>

                  <th>
                    Commodity Weight
                  </th>

                  <th>
                    No. of Bags
                  </th>

                  <th>
                    Date & Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredTrucks.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="empty-row"
                    >
                      No truck records found.
                    </td>

                  </tr>

                ) : (

                  filteredTrucks.map(
                    (truck) => (

                      <tr key={truck.id}>

                        <td>

                          <strong>
                            {truck.truckNumber}
                          </strong>

                        </td>


                        <td>
                          {truck.loadedWeight.toLocaleString(
                            "en-IN"
                          )}{" "}
                          kg
                        </td>


                        <td>
                          {truck.emptyWeight.toLocaleString(
                            "en-IN"
                          )}{" "}
                          kg
                        </td>


                        <td>

                          <strong>
                            {truck.commodityWeight.toLocaleString(
                              "en-IN"
                            )}{" "}
                            kg
                          </strong>

                        </td>


                        <td>
                          {truck.bags.toLocaleString(
                            "en-IN"
                          )}
                        </td>


                        <td>
                          {truck.date}
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* INFORMATION */}

        <div className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Weight Calculation
              </h2>

              <p>
                Commodity weight is calculated
                from the truck's loaded and empty
                weights.
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
                  Loaded Weight
                </strong>

                <p>
                  Total weight of the loaded
                  truck.
                </p>

              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                🚛
              </span>

              <div>

                <strong>
                  Empty Weight
                </strong>

                <p>
                  Weight of the empty truck.
                </p>

              </div>

            </div>


            <div className="quick-action">

              <span className="quick-icon">
                ✓
              </span>

              <div>

                <strong>
                  Commodity Weight
                </strong>

                <p>
                  Loaded weight − empty weight.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Trucks;