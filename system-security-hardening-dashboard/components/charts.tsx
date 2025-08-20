import React from 'react';

// This is a simple, non-interactive chart component for demonstration.
// A real-world app would use a library like Recharts, Chart.js, or D3.
export const ScoreTrendChart: React.FC = () => {
  const data = [65, 70, 68, 75, 82, 80, 91, 88];
  const width = 500;
  const height = 180;
  const padding = 20;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - (point / 100) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height-padding} ${points} ${width - padding},${height-padding}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      {/* Gradient */}
      <defs>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area */}
      <polygon points={areaPoints} fill="url(#areaGradient)" />

      {/* Line */}
      <polyline
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />

      {/* Points */}
      {data.map((point, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - (point / 100) * (height - padding * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="#8b5cf6" stroke="#121216" strokeWidth="2" />;
      })}
    </svg>
  );
};
