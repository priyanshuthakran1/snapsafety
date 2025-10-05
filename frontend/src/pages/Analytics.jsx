import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";

export default function Analytics() {
  const [stats, setStats] = useState({
    totalImages: 0,
    helmetCount: 0,
    vestCount: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/images?limit=1000");
      const images = res.data.images;

      let helmetCount = 0;
      let vestCount = 0;
      let totalConfidence = 0;
      let detectionCount = 0;

      images.forEach((img) => {
        img.detections.forEach((det) => {
          if (det.label === "helmet") helmetCount++;
          if (det.label === "vest") vestCount++;
          totalConfidence += det.confidence;
          detectionCount++;
        });
      });

      setStats({
        totalImages: images.length,
        helmetCount,
        vestCount,
        avgConfidence: detectionCount > 0 ? totalConfidence / detectionCount : 0,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <div className="stats-grid">
        <Card>
          <CardContent>
            <div className="stat-card">
              <h3>Total Images</h3>
              <p className="stat-number">{stats.totalImages}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="stat-card helmet">
              <h3>Helmets Detected</h3>
              <p className="stat-number">{stats.helmetCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="stat-card vest">
              <h3>Vests Detected</h3>
              <p className="stat-number">{stats.vestCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="stat-card">
              <h3>Avg Confidence</h3>
              <p className="stat-number">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}