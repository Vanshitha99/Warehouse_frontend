
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const APPROVAL_API = "http://localhost:8080/api/approvals";
const GATE_API = "http://localhost:8080/api/gate-entries";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [gateEntries, setGateEntries] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [reviewer, setReviewer] = useState("Warehouse Manager");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [approvalResponse, gateResponse] = await Promise.all([
        fetch(APPROVAL_API),
        fetch(GATE_API),
      ]);

      if (!approvalResponse.ok || !gateResponse.ok) {
        throw new Error(
          "Unable to load approvals or gate entries. Check the backend."
        );
      }

      const [approvalData, gateData] = await Promise.all([
        approvalResponse.json(),
        gateResponse.json(),
      ]);

      setApprovals(Array.isArray(approvalData) ? approvalData : []);
      setGateEntries(Array.isArray(gateData) ? gateData : []);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const reviewApproval = async (approvalId, decision) => {
    if (!reviewer.trim()) {
      setError("Enter the reviewer name before submitting a decision.");
      return;
    }

    setBusyId(approvalId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${APPROVAL_API}/${approvalId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            remarks: remarks[approvalId] || "",
            reviewedBy: reviewer.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Could not ${decision.toLowerCase()} this approval.`
        );
      }

      setMessage(`Approval ${approvalId} was ${decision.toLowerCase()}.`);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save the decision.");
    } finally {
      setBusyId(null);
    }
  };

  const createApproval = async (gateEntryId) => {
    setBusyId(`create-${gateEntryId}`);
    setError("");
    setMessage("");

    try {
      const params = new URLSearchParams({
        gateEntryId: String(gateEntryId),
        transactionType: "Gate Entry",
      });

      const response = await fetch(`${APPROVAL_API}?${params}`, {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Could not create the approval request."
        );
      }

      setMessage(`Approval request created for gate entry ${gateEntryId}.`);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to create approval request.");
    } finally {
      setBusyId(null);
    }
  };

  const approvalByGateEntry = new Map(
    approvals.map((approval) => [approval.gateEntryId, approval])
  );

  const filteredApprovals = approvals.filter((approval) => {
    if (filterStatus === "ALL") return true;
    return approval.status?.toUpperCase() === filterStatus;
  });

  const pendingCount = approvals.filter(
    (approval) => approval.status?.toUpperCase() === "PENDING"
  ).length;

  const approvedCount = approvals.filter(
    (approval) => approval.status?.toUpperCase() === "APPROVED"
  ).length;

  const rejectedCount = approvals.filter(
    (approval) => approval.status?.toUpperCase() === "REJECTED"
  ).length;

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString("en-IN") : "—";

  const getGateEntry = (gateEntryId) =>
    gateEntries.find((entry) => entry.id === gateEntryId);

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <h1>Approvals</h1>
            <p>
              Review gate-entry requests and record Warehouse Manager
              decisions.
            </p>
          </div>
        </div>

        {message && (
          <div className="form-message" role="status">
            {message}
            <button
              type="button"
              onClick={() => setMessage("")}
              style={{
                marginLeft: "15px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="gate-entry-card">
            <p role="alert">{error}</p>
            <button
              type="button"
              className="primary-button"
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        )}

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">◷</div>
            <div>
              <p>Pending</p>
              <h2>{loading ? "…" : pendingCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <p>Approved</p>
              <h2>{loading ? "…" : approvedCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">×</div>
            <div>
              <p>Rejected</p>
              <h2>{loading ? "…" : rejectedCount}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">▤</div>
            <div>
              <p>Total Requests</p>
              <h2>{loading ? "…" : approvals.length}</h2>
            </div>
          </div>
        </div>

        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Review Settings</h2>
              <p>Enter the name to record who reviewed a request.</p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadData}
              disabled={loading || busyId !== null}
            >
              Refresh
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="reviewer">Reviewer Name</label>
            <input
              id="reviewer"
              value={reviewer}
              onChange={(event) => setReviewer(event.target.value)}
              placeholder="Enter reviewer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="approvalStatus">Approval Status</label>
            <select
              id="approvalStatus"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="ALL">All Requests</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Approval Requests</h2>
              <p>These records are loaded from the approvals API.</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Truck</th>
                  <th>Party</th>
                  <th>Transaction</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Decision</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="empty-row">
                      Loading approvals…
                    </td>
                  </tr>
                ) : filteredApprovals.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-row">
                      No approval requests found for this status.
                    </td>
                  </tr>
                ) : (
                  filteredApprovals.map((approval) => {
                    const entry = getGateEntry(approval.gateEntryId);
                    const status = approval.status?.toUpperCase();
                    const isPending = status === "PENDING";

                    return (
                      <tr key={approval.id}>
                        <td>
                          <strong>
                            GE-{String(approval.gateEntryId).padStart(3, "0")}
                          </strong>
                          <p>Approval #{approval.id}</p>
                        </td>

                        <td>{entry?.truckNumber || "—"}</td>

                        <td>
                          {entry?.partyName ||
                            entry?.party?.partyName ||
                            "—"}
                        </td>

                        <td>{approval.transactionType}</td>

                        <td>{formatDate(approval.submittedAt)}</td>

                        <td>
                          <span
                            className={`status-badge ${
                              status === "APPROVED"
                                ? "exited"
                                : status === "REJECTED"
                                ? "rejected"
                                : "inside"
                            }`}
                          >
                            {status || "UNKNOWN"}
                          </span>
                        </td>

                        <td>
                          {isPending ? (
                            <input
                              aria-label={`Remarks for approval ${approval.id}`}
                              value={remarks[approval.id] || ""}
                              onChange={(event) =>
                                setRemarks((current) => ({
                                  ...current,
                                  [approval.id]: event.target.value,
                                }))
                              }
                              placeholder="Optional remarks"
                            />
                          ) : (
                            <span>{approval.remarks || "—"}</span>
                          )}

                          {!isPending && approval.reviewedBy && (
                            <p>Reviewed by: {approval.reviewedBy}</p>
                          )}
                        </td>

                        <td>
                          {isPending ? (
                            <div className="quick-actions">
                              <button
                                type="button"
                                className="primary-button"
                                disabled={busyId !== null}
                                onClick={() =>
                                  reviewApproval(approval.id, "APPROVED")
                                }
                              >
                                {busyId === approval.id
                                  ? "Saving…"
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                className="secondary-button"
                                disabled={busyId !== null}
                                onClick={() =>
                                  reviewApproval(approval.id, "REJECTED")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span>
                              {approval.reviewedAt
                                ? formatDate(approval.reviewedAt)
                                : "Reviewed"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="gate-entry-card">
          <div className="section-heading">
            <div>
              <h2>Gate Entries Without Approval Requests</h2>
              <p>
                Create a request for a gate entry that does not already have
                an approval record.
              </p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Gate Entry</th>
                  <th>Truck</th>
                  <th>Party</th>
                  <th>Commodity</th>
                  <th>Gate Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      Loading gate entries…
                    </td>
                  </tr>
                ) : gateEntries.filter(
                    (entry) => !approvalByGateEntry.has(entry.id)
                  ).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      Every gate entry already has an approval request.
                    </td>
                  </tr>
                ) : (
                  gateEntries
                    .filter((entry) => !approvalByGateEntry.has(entry.id))
                    .map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          GE-{String(entry.id).padStart(3, "0")}
                        </td>
                        <td>
                          {entry.truckNumber || entry.truck?.truckNumber || "—"}
                        </td>
                        <td>
                          {entry.partyName || entry.party?.partyName || "—"}
                        </td>
                        <td>{entry.commodity || "—"}</td>
                        <td>{entry.status || "UNKNOWN"}</td>
                        <td>
                          <button
                            type="button"
                            className="primary-button"
                            disabled={busyId !== null}
                            onClick={() => createApproval(entry.id)}
                          >
                            {busyId === `create-${entry.id}`
                              ? "Creating…"
                              : "Create Request"}
                          </button>
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

export default Approvals;

