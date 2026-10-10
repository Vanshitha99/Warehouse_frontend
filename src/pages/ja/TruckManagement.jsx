
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/trucks";

function TruckManagement() {
  const [truckNumber, setTruckNumber] = useState("");
  const [loadedWeight, setLoadedWeight] = useState("");
  const [emptyWeight, setEmptyWeight] = useState("");
  const [bags, setBags] = useState("");

  const [trucks, setTrucks] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const grossWeight =
    loadedWeight !== "" && emptyWeight !== ""
      ? Number(loadedWeight) - Number(emptyWeight)
      : 0;

  const loadTrucks = async () => {
    setLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load truck records.");
      }

      const data = await response.json();
      setTrucks(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(
        error.message ||
          "Could not connect to the backend. Check that Spring Boot is running."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    const number = truckNumber.trim().toUpperCase();
    const loaded = Number(loadedWeight);
    const empty = Number(emptyWeight);
    const bagCount = Number(bags);

    if (
      !number ||
      loadedWeight === "" ||
      emptyWeight === "" ||
      bags === ""
    ) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    if (
      !Number.isFinite(loaded) ||
      !Number.isFinite(empty) ||
      loaded <= empty ||
      empty < 0
    ) {
      setMessage(
        "Loaded weight must be greater than empty weight."
      );
      setMessageType("error");
      return;
    }

    if (!Number.isInteger(bagCount) || bagCount <= 0) {
      setMessage(
        "Number of bags must be a positive whole number."
      );
      setMessageType("error");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          truckNumber: number,
          loadedWeight: loaded,
          emptyWeight: empty,
          numberOfBags: bagCount,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            (response.status === 409
              ? "Truck number already exists."
              : "Failed to save truck record.")
        );
      }

      setMessage("Truck record saved successfully.");
      setMessageType("success");

      setTruckNumber("");
      setLoadedWeight("");
      setEmptyWeight("");
      setBags("");

      await loadTrucks();
    } catch (error) {
      setMessage(
        error.message || "Could not connect to the backend."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setTruckNumber("");
    setLoadedWeight("");
    setEmptyWeight("");
    setBags("");
    setMessage("");
    setMessageType("");
  };

  const formatWeight = (weight) => {
    if (weight === null || weight === undefined || weight === "") {
      return "—";
    }

    const value = Number(weight);

    return Number.isFinite(value)
      ? `${value.toFixed(2)} kg`
      : "—";
  };

  // Read a saved timestamp from the backend.
  const getTruckTimestamp = (truck) => {
    return (
      truck.createdAt ??
      truck.createdDate ??
      truck.dateTime ??
      truck.registeredAt ??
      truck.registrationDateTime ??
      truck.date ??
      null
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "Not recorded";
    }

    // Supports ISO strings and Java LocalDateTime values.
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="gate-entry-page">
      <div className="page-header">
        <h1>Truck Management</h1>
        <p>
          Record truck weights and calculate the commodity weight.
        </p>
      </div>

      <div className="gate-entry-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="truckNumber">Truck Number</label>
            <input
              id="truckNumber"
              type="text"
              placeholder="e.g. TS08AB1234"
              value={truckNumber}
              onChange={(event) =>
                setTruckNumber(event.target.value.toUpperCase())
              }
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
            <label htmlFor="loadedWeight">
              Loaded Truck Weight (kg)
            </label>
            <input
              id="loadedWeight"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter loaded weight"
              value={loadedWeight}
              onChange={(event) =>
                setLoadedWeight(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emptyWeight">
              Empty Truck Weight (kg)
            </label>
            <input
              id="emptyWeight"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter empty weight"
              value={emptyWeight}
              onChange={(event) =>
                setEmptyWeight(event.target.value)
              }
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Gross Commodity Weight (kg)</label>
            <div className="readonly-box">
              {loadedWeight !== "" &&
              emptyWeight !== "" &&
              grossWeight > 0
                ? `${grossWeight.toFixed(2)} kg`
                : "Automatically calculated"}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Truck Record"}
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
                color:
                  messageType === "success" ? "green" : "crimson",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="gate-entry-card">
        <div className="section-heading">
          <div>
            <h2>Registered Trucks</h2>
            <p>
              Truck records retrieved from the warehouse database.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadTrucks}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Truck Number</th>
                <th>Loaded Weight</th>
                <th>Empty Weight</th>
                <th>Commodity Weight</th>
                <th>No. of Bags</th>
                <th>Date &amp; Time</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Loading truck records...
                  </td>
                </tr>
              ) : trucks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No registered trucks found.
                  </td>
                </tr>
              ) : (
                trucks.map((truck) => (
                  <tr key={truck.id}>
                    <td>
                      <strong>{truck.truckNumber}</strong>
                    </td>

                    <td>{formatWeight(truck.loadedWeight)}</td>

                    <td>{formatWeight(truck.emptyWeight)}</td>

                    <td>
                      <strong>
                        {formatWeight(
                          truck.grossWeight ??
                            (
                              Number(truck.loadedWeight) -
                              Number(truck.emptyWeight)
                            )
                        )}
                      </strong>
                    </td>

                    <td>{truck.numberOfBags ?? "—"}</td>

                    <td>
                      {formatDate(getTruckTimestamp(truck))}
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

export default TruckManagement;

