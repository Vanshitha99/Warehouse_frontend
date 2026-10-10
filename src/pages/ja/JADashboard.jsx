import DashboardLayout from "../../layouts/DashboardLayout";

function JADashboard() {
  return (
    <DashboardLayout>

      <div className="dashboard-page">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <p className="dashboard-welcome">
              Welcome back
            </p>

            <h1>
              JA Dashboard
            </h1>

            <p>
              Manage gate entries, trucks and weighments.
            </p>
          </div>

          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>

        </div>


        {/* STAT CARDS */}

        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              ▤
            </div>

            <div>
              <p>Today's Gate Entries</p>
              <h2>0</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🚛
            </div>

            <div>
              <p>Trucks Inside</p>
              <h2>0</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⚖
            </div>

            <div>
              <p>Today's Weighments</p>
              <h2>0</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <p>Completed Entries</p>
              <h2>0</h2>
            </div>

          </div>

        </div>


        {/* QUICK ACTIONS */}

        <div className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used operations
              </p>
            </div>

          </div>


          <div className="quick-actions">

            <a
              href="/ja/gate-entry"
              className="quick-action"
            >
              <span className="quick-icon">
                ▤
              </span>

              <div>
                <strong>
                  New Gate Entry
                </strong>

                <p>
                  Register an incoming truck
                </p>
              </div>

              <span>→</span>
            </a>


            <a
              href="/ja/truck-management"
              className="quick-action"
            >
              <span className="quick-icon">
                🚛
              </span>

              <div>
                <strong>
                  Truck Management
                </strong>

                <p>
                  Record truck weights
                </p>
              </div>

              <span>→</span>
            </a>


            <a
              href="/ja/weighment"
              className="quick-action"
            >
              <span className="quick-icon">
                ⚖
              </span>

              <div>
                <strong>
                  New Weighment
                </strong>

                <p>
                  Record truck weighment
                </p>
              </div>

              <span>→</span>
            </a>

          </div>

        </div>


        {/* RECENT ACTIVITY */}

        <div className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Latest operations recorded today
              </p>
            </div>

          </div>


          <div className="activity-empty">

            <div className="empty-icon">
              ▤
            </div>

            <h3>
              No activity yet
            </h3>

            <p>
              Gate entries and weighments will
              appear here once operations begin.
            </p>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default JADashboard;