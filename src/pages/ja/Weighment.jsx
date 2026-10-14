import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const WEIGHMENT_API = `${API_BASE_URL}/weighments`;

function Weighment() {
  const [truckNumber, setTruckNumber] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [partyName, setPartyName] = useState("");
  const [acknowledgementNumber, setAcknowledgementNumber] = useState("");
  const [weighbillNumber, setWeighbillNumber] = useState("");
  const [truckLoadWeight, setTruckLoadWeight] = useState("");
  const [stackNumber, setStackNumber] = useState("");
  const [godownNumber, setGodownNumber] = useState("");

  const [weighments, setWeighments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [recordsError, setRecordsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setRecordsError("");

    try {
      const weighmentResponse = await fetch(WEIGHMENT_API);

      if (!weighmentResponse.ok) {
        throw new Error(`Unable to load existing weighment records (HTTP ${weighmentResponse.status}).`);
      }

      const weighmentData = await weighmentResponse.json();
      setWeighments(Array.isArray(weighmentData) ? weighmentData : []);
    } catch (err) {
      setRecordsError(
        err.message?.includes("Unable to load")
          ? err.message
          : `Unable to load existing weighment records: ${err.message || "Could not connect to the backend."}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setTruckNumber("");
    setPartyCode("");
    setPartyName("");
    setAcknowledgementNumber("");
    setWeighbillNumber("");
    setTruckLoadWeight("");
    setStackNumber("");
    setGodownNumber("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !truckNumber.trim() ||
      !partyCode.trim() ||
      !partyName.trim() ||
      !acknowledgementNumber.trim() ||
      !weighbillNumber.trim() ||
      truckLoadWeight === "" ||
      !stackNumber.trim() ||
      !godownNumber.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const weight = Number(truckLoadWeight);

    if (!Number.isFinite(weight) || weight <= 0) {
      setError("Truck load weight must be greater than 0.");
      return;
    }

    const payload = {
      truckNumber: truckNumber.trim().toUpperCase(),
      partyName: partyName.trim(),
      partyCode: partyCode.trim().toUpperCase(),
      acknowledgementNumber: acknowledgementNumber.trim(),
      weighBillNumber: weighbillNumber.trim(),
      loadedWeight: weight,
      stackNumber: stackNumber.trim(),
      godownNumber: godownNumber.trim(),
    };

    setSaving(true);

    try {
      const response = await fetch(WEIGHMENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
          result.error ||
          responseText ||
          `Save failed with HTTP ${response.status}.`
        );
      }

      resetForm();
      setMessage("Weighment saved successfully to the database.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save weighment.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    resetForm();
    setMessage("");
    setError("");
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  return (
    <div className="gate-entry-page">
      <div className="page-header">
        <h1>Weighment</h1>
        <p>Record truck weighment and warehouse storage details.</p>
      </div>

      <div className="gate-entry-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="weighmentTruckNumber">Truck Number</label>
            <input
              id="weighmentTruckNumber"
              name="truckNumber"
              type="text"
              placeholder="e.g. TS08AB1234"
              value={truckNumber}
              onChange={(event) => setTruckNumber(event.target.value.toUpperCase())}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weighmentPartyCode">Miller / Party Code</label>
            <input
              id="weighmentPartyCode"
              name="partyCode"
              type="text"
              placeholder="Enter party code"
              value={partyCode}
              onChange={(event) => setPartyCode(event.target.value.toUpperCase())}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="weighmentPartyName">Miller / Party Name</label>
            <input
              id="weighmentPartyName"
              name="partyName"
              type="text"
              placeholder="Enter party or miller name"
              value={partyName}
              onChange={(event) => setPartyName(event.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="acknowledgementNumber">
              Acknowledgement Number
            </label>
            <input
              id="acknowledgementNumber"
              name="acknowledgementNumber"
              type="text"
              placeholder="Enter acknowledgement number"
              value={acknowledgementNumber}
              onChange={(event) =>
                setAcknowledgementNumber(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weighbillNumber">Weighbill Number</label>
            <input
              id="weighbillNumber"
              name="weighbillNumber"
              type="text"
              placeholder="Enter weighbill number"
              value={weighbillNumber}
              onChange={(event) => setWeighbillNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="truckLoadWeight">Truck Load Weight (kg)</label>
            <input
              id="truckLoadWeight"
              name="truckLoadWeight"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter loaded weight in kg"
              value={truckLoadWeight}
              onChange={(event) => setTruckLoadWeight(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stackNumber">Stack Number</label>
            <input
              id="stackNumber"
              name="stackNumber"
              type="text"
              placeholder="Enter stack number"
              value={stackNumber}
              onChange={(event) => setStackNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="godownNumber">Godown Number</label>
            <input
              id="godownNumber"
              name="godownNumber"
              type="text"
              placeholder="Enter godown number"
              value={godownNumber}
              onChange={(event) => setGodownNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Weighment"}
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
            <p className="form-message" role="status">{message}</p>
          )}

          {error && <p className="form-message" role="alert">{error}</p>}
        </form>
      </div>

      <div className="gate-entry-card">
        <div className="section-heading">
          <div>
            <h2>Recent Weighments</h2>
            <p>Records saved in the database.</p>
          </div>

          <button type="button" onClick={loadData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {recordsError && (
          <p className="form-message" role="alert" style={{ marginBottom: "16px" }}>
            {recordsError}
          </p>
        )}

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
                <th>Date &amp; Time</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    Loading weighments...
                  </td>
                </tr>
              ) : recordsError ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    {recordsError}
                  </td>
                </tr>
              ) : weighments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    No saved weighments yet.
                  </td>
                </tr>
              ) : (
                weighments.map((weighment) => (
                  <tr key={weighment.id}>
                    <td><strong>{weighment.truckNumber}</strong></td>
                    <td>
                      <strong>{weighment.partyName}</strong>
                      <br />
                      <small>{weighment.partyCode}</small>
                    </td>
                    <td>{weighment.acknowledgementNumber}</td>
                    <td>{weighment.weighBillNumber}</td>
                    <td>{Number(weighment.loadedWeight).toFixed(2)} kg</td>
                    <td>{weighment.stackNumber}</td>
                    <td>{weighment.godownNumber}</td>
                    <td>{formatDate(weighment.createdAt)}</td>
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

export default Weighment;
