import React from "react";
import styles from "./HexagonChart.module.css";

type Props = {
  values: {
    community: number;
    food: number;
    eco: number;
    know: number;
    art: number;
    physical: number;
  };
};

const HexagonChart: React.FC<Props> = ({ values }) => {
  const { community, food, eco, know, art, physical } = values;

  // The correct max radius to ensure the filled area fits inside the hexagon
  const HEX_RADIUS = 43; // Adjusted to fit inside the outer hexagon

  // Function to calculate points based on normalized value (0-100) inside the hexagon
  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * HEX_RADIUS; // Scale value to adjusted hex radius
    const radian = (angle - 90) * (Math.PI / 180); // Convert angle to radians
    const x = 50 + radius * Math.cos(radian); // Center X at 50
    const y = 50 + radius * Math.sin(radian); // Center Y at 50
    return `${x},${y}`;
  };

  // Points for filled area polygon
  const points = [
    getPoint(community, 0),
    getPoint(food, 60),
    getPoint(eco, 120),
    getPoint(know, 180),
    getPoint(art, 240),
    getPoint(physical, 300),
  ].join(" ");

  return (
    <div className={styles.chart}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Main Hexagon Background */}
        <polygon
          points="50,7 87,29 87,71 50,93 13,71 13,29"
          className={styles.hexagon}
        />
        {/* Filled Polygon Area (Now properly scaled inside) */}
        <polygon points={points} className={styles.filledArea} />
        {/* Axis Lines */}
        <line x1="50" y1="7" x2="50" y2="93" className={styles.axis} />
        <line x1="13" y1="29" x2="86" y2="71" className={styles.axis} />
        <line x1="87" y1="29" x2="14" y2="71" className={styles.axis} />
      </svg>
      {/* Labels */}
      <div className={styles.labels}>
        <span className={styles.label} style={{ top: "5%", left: "50%" }}>Community</span>
        <span className={styles.label} style={{ top: "20%", left: "85%" }}>Food</span>
        <span className={styles.label} style={{ top: "75%", left: "85%" }}>Eco</span>
        <span className={styles.label} style={{ top: "95%", left: "50%" }}>Know</span>
        <span className={styles.label} style={{ top: "75%", left: "10%" }}>Art</span>
        <span className={styles.label} style={{ top: "20%", left: "10%" }}>Physical</span>
      </div>
    </div>
  );
};

export default HexagonChart;
