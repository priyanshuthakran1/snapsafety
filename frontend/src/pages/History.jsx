import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";

export default function History() {
  const [images, setImages] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabels();
    fetchImages();
  }, []);

  const fetchLabels = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/images/labels");
      setLabels(res.data);
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    }
  };

  const fetchImages = async () => {
    try {
      let url = "http://localhost:5000/api/images?limit=50";
      if (selectedLabel) url += `&label=${selectedLabel}`;
      if (fromDate) url += `&from=${fromDate}`;
      if (toDate) url += `&to=${toDate}`;

      const res = await axios.get(url);
      setImages(res.data.images);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/images/${id}`);
      fetchImages();
    } catch (error) {
      alert("Failed to delete image");
    }
  };

  const handleFilter = () => {
    fetchImages();
  };

  return (
    <div className="history-page">
      <h1>Detection History</h1>

      <Card>
        <CardContent>
          <div className="filters">
            <div className="filter-group">
              <label>Label:</label>
              <select
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
              >
                <option value="">All</option>
                {labels.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button onClick={handleFilter} className="btn-primary">
              Apply Filters
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="history-grid">
        {images.map((img) => (
          <Card key={img._id}>
            <CardContent>
              <img
                src={`http://localhost:5000/uploads/${img.filename}`}
                alt="Detection"
                className="history-image"
                onClick={() => navigate(`/result/${img._id}`)}
              />
              <div className="history-info">
                <p className="date">
                  {new Date(img.uploadedAt).toLocaleDateString()}
                </p>
                <div className="detections-tags">
                  {img.detections.map((det, idx) => (
                    <span
                      key={idx}
                      className={`tag ${det.label === "helmet" ? "helmet" : "vest"}`}
                    >
                      {det.label}
                    </span>
                  ))}
                </div>
                <div className="history-actions">
                  <button
                    onClick={() => navigate(`/result/${img._id}`)}
                    className="btn-secondary"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}