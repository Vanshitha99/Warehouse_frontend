
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const GATE_API = `${API_BASE_URL}/gate-entries`;
const TRUCK_API = `${API_BASE_URL}/trucks`;
const PARTY_API = `${API_BASE_URL}/miller-parties`;

function GateEntry() {
  const [partyCode, setPartyCode] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [commodity, setCommodity] = useState("");
  const [bags, setBags] = useState("");

  const [parties, setParties] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [entries, setEntries] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedParty = parties.find(
    (party) => party.partyCode === partyCode
  );

  const selectedTruck = trucks.find(
    (truck) => truck.truckNumber === truckNumber
  );

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const [partyResponse, truckResponse, entryResponse] =
        await Promise.all([
          fetch(PARTY_API),
          fetch(TRUCK_API),
          fetch(GATE_API),
        ]);

      if (!partyResponse.ok || !truckResponse.ok || !entryResponse.ok) {
        throw new Error(
          "Unable to load gate entry data. Check backend endpoints and permissions."
        );
      }

      const [partyData, truckData, entryData] = await Promise.all([
        partyResponse.json(),
        truckResponse.json(),
        entryResponse.json(),
      ]);

      setParties(Array.isArray(partyData) ? partyData : []);
      setTrucks(Array.isArray(truckData) ? truckData : []);
      setEntries(Array.isArray(entryData) ? entryData : []);
    } catch (error) {
      showMessage(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!partyCode || !truckNumber || !commodity.trim() || !bags) {
      showMessage("Please fill all required fields.");
      return;
    }

    if (!selectedParty) {
      showMessage("Select a valid party code.");
      return;
    }

    if (!selectedTruck) {
      showMessage("Select a registered truck.");
      return;
    }

    if (!Number.isInteger(Number(bags)) || Number(bags) <= 0) {
      showMessage("Number of bags must be a positive whole number.");
      return;
    }

    setSaving(true);

    try {
      const params = new URLSearchParams({
        partyCode,
        truckNumber,
        commodity: commodity.trim(),
        numberOfBags: bags,
      });

      const response = await fetch(`${GATE_API}?${params.toString()}`, {
        method: "POST",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            `Gate entry failed (HTTP ${response.status}).`
        );
      }

      showMessage("Gate entry saved successfully.", "success");
      setPartyCode("");
      setTruckNumber("");
      setCommodity("");
      setBags("");

      await loadData();
    } catch (error) {
      showMessage(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMarkOut = async (id) => {
    setMessage("");

    try {
      const response = await fetch(`${GATE_API}/${id}/out`, {
        method: "PUT",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            `Could not mark truck out (HTTP ${response.status}).`
        );
      }

      showMessage("Truck exit recorded successfully.", "success");
      await loadData();
    } catch (error) {
      showMessage(
        error.message || "Could not connect to the backend."
      );
    }
  };

  const handleClear = () => {
    setPartyCode("");
    setTruckNumber("");
    setCommodity("");
    setBags("");
    setMessage("");
    setMessageType("");
  };

  const formatTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value).replace("T", " ")
      : date.toLocaleString("en-IN");
  };

  return (
    <div className="gate-entry-page">
      <div className="page-header">
        <div>
          <h1>Gate Entry</h1>
          <p>
            Record incoming trucks and track their entry and exit.
          </p>
        </div>
      </div>

      <div className="gate-entry-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label htmlFor="partyCode">Party / Miller Code</label>
            <div className="party-row">
              <select
                id="partyCode"
                value={partyCode}
                onChange={(event) => setPartyCode(event.target.value)}
                required
              >
                <option value="">Select party code</option>
                {parties.map((party) => (
                  <option key={party.id} value={party.partyCode}>
                    {party.partyCode}
                  </option>
                ))}
              </select>

              <div className="party-name-box">
                {selectedParty?.partyName ||
                  "Party name will appear here"}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="truckNumber">Truck Number</label>
            <select
              id="truckNumber"
              value={truckNumber}
              onChange={(event) => setTruckNumber(event.target.value)}
              required
            >
              <option value="">Select registered truck</option>
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.truckNumber}>
                  {truck.truckNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="commodity">Commodity</label>
            <input
              id="commodity"
              type="text"
              placeholder="Enter commodity"
              value={commodity}
              onChange={(event) => setCommodity(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bags">No. of Bags</label>
            <input
              id="bags"
              type="number"
              min="1"
              step="1"
              placeholder="Enter number of bags"
              value={bags}
              onChange={(event) => setBags(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>In Time</label>
            <div className="readonly-box">
              Automatically recorded when saved
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save Gate Entry"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleClear}
              disabled={saving}
            >
              Clear
            </button>
          </div>

          {message && (
            <p
              className="form-message"
              role="status"
              style={{
                color: messageType === "success" ? "green" : "crimson",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="gate-entry-card">
        <div className="section-header">
          <div>
            <h2>Recent Gate Entries</h2>
            <p>Entries retrieved from the warehouse database.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Party</th>
                <th>Truck</th>
                <th>Commodity</th>
                <th>Bags</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    Loading gate entries...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    No gate entries found.
                  </td>
                </tr>
              ) : (
                [...entries]
                  .sort((a, b) => Number(b.id) - Number(a.id))
                  .map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        {entry.partyName || entry.party?.partyName || "—"}
                        <small>
                          {entry.party?.partyCode || ""}
                        </small>
                      </td>
                      <td>{entry.truckNumber || entry.truck?.truckNumber}</td>
                      <td>{entry.commodity}</td>
                      <td>{entry.numberOfBags ?? "—"}</td>
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
                          {entry.status}
                        </span>
                      </td>
                      <td>
                        {entry.status === "INSIDE" ? (
                          <button
                            type="button"
                            className="mark-out-button"
                            onClick={() => handleMarkOut(entry.id)}
                          >
                            Mark Out
                          </button>
                        ) : (
                          "—"
                        )}
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

export default GateEntry;