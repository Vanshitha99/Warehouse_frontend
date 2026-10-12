
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { API_BASE_URL } from "../../services/api";

const API_URL = `${API_BASE_URL}/gate-entries`;

function GateEntries() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEntries = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Unable to load gate entries (HTTP ${response.status}).`
        );
      }

      const data = await response.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Could not connect to the warehouse backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const getPartyCode = (entry) =>
    entry.party?.partyCode || entry.partyCode || "";

  const getPartyName = (entry) =>
    entry.partyName || entry.party?.partyName || "—";

  const getTruckNumber = (entry) =>
    entry.truckNumber || entry.truck?.truckNumber || "—";

  const formatTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? String(value).replace("T", " ")
      : date.toLocaleString("en-IN");
  };

  const filteredEntries = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return entries.filter((entry) => {
      const searchableValues = [
        getPartyCode(entry),
        getPartyName(entry),
        getTruckNumber(entry),
        entry.commodity || "",
      ];

      const matchesSearch =
        !search ||
        searchableValues.some((value) =>
          String(value).toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "All" ||
        entry.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [entries, searchText, statusFilter]);

  const insideCount = entries.filter(
    (entry) => entry.status === "INSIDE"
  ).length;

  const exitedCount = entries.filter(
    (entry) => entry.status === "EXITED"
  ).length;

  const handleClear = () => {
    setSearchText("");
    setStatusFilter("All");
  };

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <h1>Gate Entries</h1>
            <p>
              Monitor incoming and outgoing warehouse trucks.
            </p>
          </div>
        </div>

        {error && (
          <div className="form-message" role="alert">
            {error}
            <button
              type="button"
              className="secondary-button"
              onClick={loadEntries}
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}

        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Search Gate Entries</h2>
              <p>Search by party, truck number or commodity.</p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadEntries}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="report-history-filters">
            <div className="form-group">
              <label htmlFor="gateSearch">Search</label>
              <input
                id="gateSearch"
                type="text"
                placeholder="Search party, truck or commodity..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="statusFilter">Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Entries</option>
                <option value="INSIDE">Inside</option>
                <option value="EXITED">Exited</option>
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

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">▤</div>
            <div>
              <p>Total Entries</p>
              <h2>{entries.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚛</div>
            <div>
              <p>Trucks Inside</p>
              <h2>{insideCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <p>Exited Trucks</p>
              <h2>{exitedCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">▣</div>
            <div>
              <p>Showing</p>
              <h2>{filteredEntries.length}</h2>
            </div>
          </div>
        </div>

        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Gate Entry Records</h2>
              <p>
                Centralized view of warehouse gate-entry transactions.
              </p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Party</th>
                  <th>Truck Number</th>
                  <th>Commodity</th>
                  <th>Bags</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      Loading gate entries...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      No gate entries found.
                    </td>
                  </tr>
                ) : (
                  [...filteredEntries]
                    .sort((a, b) => Number(b.id) - Number(a.id))
                    .map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          <strong>{getPartyName(entry)}</strong>
                          <small>{getPartyCode(entry)}</small>
                        </td>

                        <td>
                          <strong>{getTruckNumber(entry)}</strong>
                        </td>

                        <td>{entry.commodity || "—"}</td>
                        <td>{entry.numberOfBags ?? entry.bags ?? "—"}</td>
                        <td>{formatTime(entry.inTime)}</td>
                        <td>{formatTime(entry.outTime)}</td>

                        <td>
                          <span
                            className={
                              entry.status === "INSIDE"
                                ? "status-badge inside"
                                : "status-badge exited"
                            }
                          >
                            {entry.status || "—"}
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
    </DashboardLayout>
  );
}

export default GateEntries;