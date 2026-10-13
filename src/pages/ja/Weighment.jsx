
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const WEIGHMENT_API = `${API_BASE_URL}/weighments`;
const PARTY_API = `${API_BASE_URL}/miller-parties`;

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
  const [parties, setParties] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [weighmentResponse, partyResponse] = await Promise.all([
        fetch(WEIGHMENT_API),
        fetch(PARTY_API),
      ]);

      if (!weighmentResponse.ok) {
        throw new Error("Unable to load weighments.");
      }

      if (!partyResponse.ok) {
        throw new Error("Unable to load party details.");
      }

      const [weighmentData, partyData] = await Promise.all([
        weighmentResponse.json(),
        partyResponse.json(),
      ]);

      setWeighments(
        Array.isArray(weighmentData) ? weighmentData : []
      );
      setParties(Array.isArray(partyData) ? partyData : []);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePartyCode = (value) => {
    const code = value.trim().toUpperCase();
    setPartyCode(code);

    const party = parties.find(
      (item) => item.partyCode?.toUpperCase() === code
    );

    setPartyName(party?.partyName || "");
  };

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
      !partyName ||
      !acknowledgementNumber.trim() ||
      !weighbillNumber.trim() ||
      truckLoadWeight === "" ||
      !stackNumber.trim() ||
      !godownNumber.trim()
    ) {
      setError("Please fill all required fields using a valid party code.");
      return;
    }

    const weight = Number(truckLoadWeight);

    if (!Number.isFinite(weight) || weight <= 0) {
      setError("Truck load weight must be greater than 0.");
      return;
    }

    const payload = {
      truckNumber: truckNumber.trim().toUpperCase(),
      partyName,
      partyCode,
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

      await loadData();
      resetForm();
      setMessage("Weighment saved successfully to the database.");
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
              type="text"
              placeholder="e.g. TS08AB1234"
              value={truckNumber}
              onChange={(event) => setTruckNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="weighmentPartyCode">Miller / Party Code</label>
            <input
              id="weighmentPartyCode"
              type="text"
              placeholder="Enter registered party code"
              value={partyCode}
              onChange={(event) => handlePartyCode(event.target.value)}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Miller / Party Name</label>
            <div className="party-name-box">
              {partyName || "Enter a registered party code"}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="acknowledgementNumber">
              Acknowledgement Number
            </label>
            <input
              id="acknowledgementNumber"
              type="text"
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
              type="text"
              value={weighbillNumber}
              onChange={(event) => setWeighbillNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="truckLoadWeight">Truck Load Weight (kg)</label>
            <input
              id="truckLoadWeight"
              type="number"
              min="0.01"
              step="0.01"
              value={truckLoadWeight}
              onChange={(event) => setTruckLoadWeight(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stackNumber">Stack Number</label>
            <input
              id="stackNumber"
              type="text"
              value={stackNumber}
              onChange={(event) => setStackNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="godownNumber">Godown Number</label>
            <input
              id="godownNumber"
              type="text"
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
              {weighments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    {loading ? "Loading weighments..." : "No saved weighments yet."}
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

