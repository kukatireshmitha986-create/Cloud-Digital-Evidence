import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import UploadEvidence from "./UploadEvidence";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const addAuditLog = (action, filename = "") => {
    const log = {
      action,
      filename,
      user: auth.currentUser?.email || "Unknown",
      time: new Date().toLocaleString(),
    };

    setAuditLogs((previous) => [log, ...previous]);
  };

  const loadEvidence = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/evidence`);

      if (!response.ok) {
        throw new Error("Unable to load evidence");
      }

      const data = await response.json();

      setEvidence(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setEvidence([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadEvidence();
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        setMessage("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    addAuditLog("User Logout");

    await signOut(auth);

    setUser(null);
    setPage("dashboard");
  };

  const handleDelete = async (item) => {
    const filename =
      typeof item === "string"
        ? item
        : item?.filename;

    if (!filename) {
      alert("File name is missing.");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ${filename}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/evidence/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Delete failed."
        );
      }

      addAuditLog("Evidence Deleted", filename);

      alert("Evidence deleted successfully.");

      await loadEvidence();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleView = (item) => {
    const filename =
      typeof item === "string"
        ? item
        : item?.filename;

    if (!filename) {
      alert("File name is missing.");
      return;
    }

    addAuditLog("Evidence Viewed", filename);

    const url =
      `${API_URL}/api/evidence/file/` +
      encodeURIComponent(filename);

    window.open(url, "_blank");
  };

  const filteredEvidence = evidence.filter((item) => {
    const filename =
      item.originalName ||
      item.filename ||
      "";

    const matchesSearch =
      filename
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      filterType === "All" ||
      item.category === filterType;

    return matchesSearch && matchesType;
  });

  const totalEvidence = evidence.length;

  const imageCount = evidence.filter(
    (item) => item.category === "Image"
  ).length;

  const documentCount = evidence.filter(
    (item) => item.category === "Document"
  ).length;

  const videoCount = evidence.filter(
    (item) => item.category === "Video"
  ).length;

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-box">

          <h1>🔐 Cloud Digital Evidence</h1>

          <h2>Management System</h2>

          <form onSubmit={handleAuth}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              {isSignup
                ? "Create Account"
                : "Login"}
            </button>

          </form>

          {message && (
            <p>{message}</p>
          )}

          <button
            className="secondary-button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Create new account"}
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="app-container">

      <header className="top-header">

        <h1>🔐 Cloud Digital Evidence</h1>

        <div>
          <span>👤 {user.email}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </header>

      <div className="main-layout">

        <aside className="sidebar">

          <h2>Menu</h2>

          <button onClick={() => setPage("dashboard")}>
            🏠 Dashboard
          </button>

          <button
            onClick={() => {
              setPage("evidence");
              loadEvidence();
            }}
          >
            📁 Evidence
          </button>

          <button onClick={() => setPage("upload")}>
            ⬆️ Upload Evidence
          </button>

          <button onClick={() => setPage("search")}>
            🔍 Search Evidence
          </button>

          <button onClick={() => setPage("audit")}>
            📋 Audit Logs
          </button>

          <button onClick={() => setPage("settings")}>
            ⚙️ Settings
          </button>

        </aside>

        <main className="content">

          {/* DASHBOARD */}

          {page === "dashboard" && (
            <div>

              <h2>Dashboard</h2>

              <p>
                Welcome to the Cloud Digital Evidence
                Management System.
              </p>

              <div className="stats">

                <div className="stat-card">
                  <h3>📁 Total Evidence</h3>
                  <strong>{totalEvidence}</strong>
                </div>

                <div className="stat-card">
                  <h3>🖼️ Images</h3>
                  <strong>{imageCount}</strong>
                </div>

                <div className="stat-card">
                  <h3>📄 Documents</h3>
                  <strong>{documentCount}</strong>
                </div>

                <div className="stat-card">
                  <h3>🎥 Videos</h3>
                  <strong>{videoCount}</strong>
                </div>

              </div>

              <h2>Recent Evidence</h2>

              {evidence.length === 0 ? (
                <p>No evidence uploaded yet.</p>
              ) : (
                evidence.slice(0, 5).map((item) => (
                  <div
                    className="evidence-card"
                    key={item.filename}
                  >
                    <strong>
                      {item.originalName ||
                        item.filename}
                    </strong>

                    <p>
                      Type: {item.category}
                    </p>

                    <button
                      onClick={() =>
                        handleView(item)
                      }
                    >
                      👁️ View
                    </button>
                  </div>
                ))
              )}

            </div>
          )}

          {/* EVIDENCE */}

          {page === "evidence" && (
            <div>

              <h2>📁 Evidence Management</h2>

              <button onClick={loadEvidence}>
                🔄 Refresh
              </button>

              {loading && (
                <p>Loading evidence...</p>
              )}

              {!loading &&
                evidence.length === 0 && (
                  <p>
                    No evidence uploaded yet.
                  </p>
                )}

              <div className="evidence-list">

                {evidence.map((item) => (

                  <div
                    className="evidence-card"
                    key={item.filename}
                  >

                    <h3>
                      📄{" "}
                      {item.originalName ||
                        item.filename}
                    </h3>

                    <p>
                      <strong>
                        Type:
                      </strong>{" "}
                      {item.category}
                    </p>

                    <p>
                      <strong>
                        Size:
                      </strong>{" "}
                      {item.size} bytes
                    </p>

                    <p>
                      <strong>
                        Uploaded:
                      </strong>{" "}
                      {item.uploadedAt
                        ? new Date(
                            item.uploadedAt
                          ).toLocaleString()
                        : "Unknown"}
                    </p>

                    <button
                      onClick={() =>
                        handleView(item)
                      }
                    >
                      👁️ View
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* UPLOAD */}

          {page === "upload" && (
            <UploadEvidence
              onUploadSuccess={() => {
                loadEvidence();
                setPage("evidence");
                addAuditLog("Evidence Uploaded");
              }}
            />
          )}

          {/* SEARCH */}

          {page === "search" && (
            <div>

              <h2>🔍 Search Evidence</h2>

              <input
                type="text"
                placeholder="Search evidence..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value)
                }
              >
                <option value="All">
                  All Types
                </option>

                <option value="Image">
                  Images
                </option>

                <option value="Document">
                  Documents
                </option>

                <option value="Video">
                  Videos
                </option>

                <option value="Audio">
                  Audio
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              <h3>
                Results: {filteredEvidence.length}
              </h3>

              {filteredEvidence.length === 0 ? (
                <p>
                  No matching evidence found.
                </p>
              ) : (

                filteredEvidence.map((item) => (

                  <div
                    className="evidence-card"
                    key={item.filename}
                  >

                    <h3>
                      📄{" "}
                      {item.originalName ||
                        item.filename}
                    </h3>

                    <p>
                      Type: {item.category}
                    </p>

                    <button
                      onClick={() =>
                        handleView(item)
                      }
                    >
                      👁️ View
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                ))

              )}

            </div>
          )}

          {/* AUDIT LOGS */}

          {page === "audit" && (
            <div>

              <h2>📋 Audit Logs</h2>

              {auditLogs.length === 0 ? (

                <p>
                  No activity recorded in this
                  session.
                </p>

              ) : (

                auditLogs.map((log, index) => (

                  <div
                    className="evidence-card"
                    key={index}
                  >

                    <h3>
                      {log.action}
                    </h3>

                    <p>
                      User: {log.user}
                    </p>

                    {log.filename && (
                      <p>
                        File: {log.filename}
                      </p>
                    )}

                    <p>
                      Time: {log.time}
                    </p>

                  </div>

                ))

              )}

            </div>
          )}

          {/* SETTINGS */}

          {page === "settings" && (
            <div>

              <h2>⚙️ Settings</h2>

              <div className="evidence-card">

                <h3>
                  Account Information
                </h3>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {user.email}
                </p>

                <p>
                  <strong>
                    User ID:
                  </strong>{" "}
                  {user.uid}
                </p>

              </div>

              <div className="evidence-card">

                <h3>
                  System Information
                </h3>

                <p>
                  Cloud Digital Evidence
                  Management System
                </p>

                <p>
                  Backend: Node.js + Express
                </p>

                <p>
                  Authentication: Firebase
                </p>

                <p>
                  Database: Firestore
                </p>

                <p>
                  Evidence Storage: Local
                </p>

              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;