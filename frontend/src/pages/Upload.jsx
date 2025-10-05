import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/images", formData);
      setResult(res.data);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Image for PPE Detection</h1>

      <Card>
        <CardContent>
          <div className="upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file-input"
              style={{ display: "none" }}
            />
            <label htmlFor="file-input" className="upload-button">
              Choose Image
            </label>
            {file && <p className="file-name">{file.name}</p>}
          </div>

          {preview && !result && (
            <div className="preview-section">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="preview-image" />
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Analyzing..." : "Analyze PPE"}
              </button>
            </div>
          )}

          {result && (
            <div className="result-section">
              <h3>Detection Results</h3>
              <div className="image-container">
                <img
                  src={`http://localhost:5000/uploads/${result.filename}`}
                  alt="Result"
                  className="result-image"
                />
                <svg className="bbox-overlay">
                  {result.detections.map((det, idx) => (
                    <g key={idx}>
                      <rect
                        x={`${det.bbox.x * 100}%`}
                        y={`${det.bbox.y * 100}%`}
                        width={`${det.bbox.width * 100}%`}
                        height={`${det.bbox.height * 100}%`}
                        fill="none"
                        stroke={det.label === "helmet" ? "#22c55e" : "#f97316"}
                        strokeWidth="3"
                      />
                      <text
                        x={`${det.bbox.x * 100}%`}
                        y={`${det.bbox.y * 100 - 1}%`}
                        fill={det.label === "helmet" ? "#22c55e" : "#f97316"}
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {det.label} ({(det.confidence * 100).toFixed(1)}%)
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="detections-list">
                {result.detections.map((det, idx) => (
                  <div key={idx} className="detection-item">
                    <span
                      className={`label ${det.label === "helmet" ? "helmet" : "vest"}`}
                    >
                      {det.label}
                    </span>
                    <span className="confidence">
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/result/${result._id}`)}
                className="btn-secondary"
              >
                View Full Details
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}