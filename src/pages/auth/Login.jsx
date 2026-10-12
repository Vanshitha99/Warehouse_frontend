import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const id = employeeId.trim().toUpperCase();

    /*
      TEMPORARY FRONTEND LOGIN

      Later this will be replaced with
      Spring Boot + MySQL authentication.
    */

    const users = {
      JA001: {
        employeeId: "JA001",
        name: "Junior Assistant",
        role: "JA",
        password: "password123",
      },

      WM001: {
        employeeId: "WM001",
        name: "Warehouse Manager",
        role: "WM",
        password: "password123",
      },

      TA001: {
        employeeId: "TA001",
        name: "Technical Assistant",
        role: "TA",
        password: "password123",
      },
    };

    const user = users[id];

    if (!user || user.password !== password) {
      setError("Invalid Employee ID or Password.");
      return;
    }

    login({
      employeeId: user.employeeId,
      name: user.name,
      role: user.role,
    });

    if (user.role === "JA") {
      navigate("/ja");
    } else if (user.role === "WM") {
      navigate("/wm");
    } else if (user.role === "TA") {
      navigate("/ta");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>TGSWC</h1>

          <h2>
            Digital Warehouse Management System
          </h2>

          <p>
            Employee Login
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="employeeId">
              Employee ID
            </label>

            <input
              id="employeeId"
              type="text"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChange={(event) =>
                setEmployeeId(event.target.value)
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>


        <div className="login-footer">

          <p>
            Telangana State Warehousing Corporation
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;