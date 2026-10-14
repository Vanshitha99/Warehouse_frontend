import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const GATE_API = `${API_BASE_URL}/gate-entries`;

function GateEntry() {
  const [partyCode, setPartyCode] = useState("");
  const [partyName, setPartyName] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [commodity, setCommodity] = useState("");
  const [bags, setBags] = useState("");
  const [entries, setEntries] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(GATE_API);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `Unable to load gate entries (HTTP ${response.status}).`
        );
      }

      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      showMessage(error.message || "Could not connect to the backend.");
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

    const cleanPartyCode = partyCode.trim();
    const cleanPartyName = partyName.trim();
    const cleanTruckNumber = truckNumber.trim();
    const cleanCommodity = commodity.trim();

    if (!cleanPartyCode || !cleanPartyName || !cleanTruckNumber || !cleanCommodity || !bags) {
      showMessage("Please fill in Party Code, Party Name, Truck Number, Commodity, and No. of Bags.");
      return;
    }

    if (!Number.isInteger(Number(bags)) || Number(bags) <= 0) {
      showMessage("Number of bags must be a positive whole number.");
      return;
    }

    setSaving(true);
    try {
      const params = new URLSearchParams({
        partyCode: cleanPartyCode,
        partyName: cleanPartyName,
        truckNumber: cleanTruckNumber,
        commodity: cleanCommodity,
        numberOfBags: bags,
      });

      const response = await fetch(`${GATE_API}?${params.toString()}`, {
        method: "POST",
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message ||
          `Gate entry failed (HTTP ${response.status}). The backend may need to be updated to accept manual party names and truck numbers.`
        );
      }

      showMessage("Gate entry saved successfully.", "success");
      setPartyCode("");
      setPartyName("");
      setTruckNumber("");
      setCommodity("");
      setBags("");
      await loadData();
    } catch (error) {
      showMessage(error.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkOut = async (id) => {
    setMessage("");
    try {
      const response = await fetch(`${GATE_API}/${id}/out`, { method: "PUT" });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || result.message || `Could not mark truck out (HTTP ${response.status}).`
        );
      }

      showMessage("Truck exit recorded successfully.", "success");
      await loadData();
    } catch (error) {
      showMessage(error.message || "Could not connect to the backend.");
    }
  };

  const handleClear = () => {
    setPartyCode("");
    setPartyName("");
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
          <p>Record incoming trucks and track their entry and exit.</p>
        </div>
      </div>

      <div className="gate-entry-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="partyCode">Party / Miller Code</label>
            <input
              id="partyCode"
              name="partyCode"
              type="text"
              value={partyCode}
              onChange={(event) => setPartyCode(event.target.value)}
              placeholder="Enter party / miller code"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="partyName">Party / Miller Name</label>
            <input
              id="partyName"
              name="partyName"
              type="text"
              value={partyName}
              onChange={(event) => setPartyName(event.target.value)}
              placeholder="Enter party / miller name"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="truckNumber">Truck Number</label>
            <input
              id="truckNumber"
              name="truckNumber"
              type="text"
              value={truckNumber}
              onChange={(event) => setTruckNumber(event.target.value.toUpperCase())}
              placeholder="Enter truck number"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="commodity">Commodity</label>
            <input
              id="commodity"
              name="commodity"
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
              name="numberOfBags"
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
            <div className="readonly-box">Automatically recorded when saved</div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save Gate Entry"}
            </button>
            <button type="button" className="secondary-button" onClick={handleClear} disabled={saving}>
              Clear
            </button>
          </div>

          {message && (
            <p
              className="form-message"
              role="status"
              style={{ color: messageType === "success" ? "green" : "crimson" }}
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
          <button type="button" className="secondary-button" onClick={loadData} disabled={loading}>
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
                <tr><td colSpan="8" className="empty-row">Loading gate entries...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan="8" className="empty-row">No gate entries found.</td></tr>
              ) : (
                [...entries].sort((a, b) => Number(b.id) - Number(a.id)).map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      {entry.partyName || entry.party?.partyName || "—"}
                      <small>{entry.party?.partyCode || entry.partyCode || ""}</small>
                    </td>
                    <td>{entry.truckNumber || entry.truck?.truckNumber || "—"}</td>
                    <td>{entry.commodity || "—"}</td>
                    <td>{entry.numberOfBags ?? "—"}</td>
                    <td>{formatTime(entry.inTime)}</td>
                    <td>{formatTime(entry.outTime)}</td>
                    <td>
                      <span className={entry.status === "INSIDE" ? "status-badge inside" : "status-badge exited"}>
                        {entry.status || "—"}
                      </span>
                    </td>
                    <td>
                      {entry.status === "INSIDE" ? (
                        <button type="button" className="mark-out-button" onClick={() => handleMarkOut(entry.id)}>
                          Mark Out
                        </button>
                      ) : "—"}
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
