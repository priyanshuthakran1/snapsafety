import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/images/${id}`)
      .then((res) => setImageData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!imageData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="result-page">
      <button onClick={() => navigate("/history")} className="btn-back">
        ← Back to History
      </button>

      <h1>Detection Result</h1>

      <Card>
        <CardContent>
          <div className="image-container">
            <img
              src={`http://localhost:5000/uploads/${imageData.filename}`}
              alt="Result"
              className="result-image"
            />
            <svg className="bbox-overlay">
              {imageData.detections.map((det, idx) => (
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

          <div className="result-details">
            <h3>Detection Details</h3>
            <p>
              <strong>Uploaded:</strong>{" "}
              {new Date(imageData.uploadedAt).toLocaleString()}
            </p>
            <p>
              <strong>Hash:</strong> {imageData.detections_hash}
            </p>

            <h4>Detections:</h4>
            {imageData.detections.map((det, idx) => (
              <div key={idx} className="detection-detail">
                <span
                  className={`label ${det.label === "helmet" ? "helmet" : "vest"}`}
                >
                  {det.label}
                </span>
                <span className="confidence">
                  Confidence: {(det.confidence * 100).toFixed(2)}%
                </span>
                <div className="bbox-info">
                  <small>
                    BBox: x={det.bbox.x.toFixed(3)}, y={det.bbox.y.toFixed(3)},
                    w={det.bbox.width.toFixed(3)}, h=
                    {det.bbox.height.toFixed(3)}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <pre className="json-output">
            {JSON.stringify(imageData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}