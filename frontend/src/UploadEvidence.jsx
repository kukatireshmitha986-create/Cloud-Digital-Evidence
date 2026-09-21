import React, { useState } from "react";
import { auth } from "./firebase";

function UploadEvidence({ onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Document");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setMessage("");

    // Get currently logged-in Firebase user
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setMessage("Please login again before uploading evidence.");
      return;
    }

    if (!file) {
      setMessage("Please select an evidence file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", type);

      // Send Firebase user ID to backend
      formData.append("uid", currentUser.uid);
      formData.append("userEmail", currentUser.email || "");

      const response = await fetch(
        "http://localhost:5000/api/evidence/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed."
        );
      }

      setMessage(
        "Evidence uploaded successfully!"
      );

      setTitle("");
      setDescription("");
      setType("Document");
      setFile(null);

      const fileInput =
        document.getElementById("evidence-file");

      if (fileInput) {
        fileInput.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error("Upload error:", error);

      setMessage(
        "Upload failed: " + error.message
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">

      <h2>Upload Digital Evidence</h2>

      <p>
        Securely upload digital evidence to
        the system.
      </p>

      <form onSubmit={handleUpload}>

        <div className="form-group">

          <label>
            Evidence Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter evidence title"
            required
          />

        </div>

        <div className="form-group">

          <label>
            Evidence Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter evidence description"
            rows="4"
          />

        </div>

        <div className="form-group">

          <label>
            Evidence Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="Image">
              Image
            </option>

            <option value="Document">
              Document
            </option>

            <option value="Video">
              Video
            </option>

            <option value="Audio">
              Audio
            </option>

            <option value="Other">
              Other
            </option>
          </select>

        </div>

        <div className="form-group">

          <label>
            Select Evidence File
          </label>

          <input
            id="evidence-file"
            type="file"
            onChange={handleFileChange}
            required
          />

        </div>

        {file && (
          <p>
            Selected file:{" "}
            <strong>{file.name}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Uploading..."
            : "Upload Evidence"}
        </button>

      </form>

      {message && (
        <p style={{ marginTop: "15px" }}>
          {message}
        </p>
      )}

    </div>
  );
}

export default UploadEvidence;