'use client';

import React from 'react';

interface CodexConstellationProps {
  className?: string;
}

const NODES = [
  { id: 'venus', label: 'Venus', cx: 300, cy: 150, r: 22, color: '#C9A84C', labelColor: '#C9A84C', isCenter: true },
  { id: 'copper', label: 'Copper', cx: 120, cy: 80, r: 14, color: '#b87333', labelColor: '#b87333' },
  { id: 'emerald', label: 'Emerald', cx: 480, cy: 80, r: 14, color: '#50c878', labelColor: '#50c878' },
  { id: 'freq', label: '221.23 Hz', cx: 140, cy: 230, r: 14, color: '#00d4ff', labelColor: '#00d4ff' },
  { id: 'netzach', label: 'Netzach', cx: 460, cy: 230, r: 14, color: '#9b7fc7', labelColor: '#9b7fc7' },
  { id: 'empress', label: 'The Empress', cx: 80, cy: 150, r: 14, color: '#e8a0bf', labelColor: '#e8a0bf' },
  { id: 'rose', label: 'Rose', cx: 520, cy: 150, r: 14, color: '#ff6b9d', labelColor: '#ff6b9d' },
  { id: 'taurus', label: 'Taurus', cx: 220, cy: 265, r: 14, color: '#c4956a', labelColor: '#c4956a' },
];

const CENTER_ID = 'venus';

export default function CodexConstellation({ className = '' }: CodexConstellationProps) {
  const connections = NODES.filter(n => n.id !== CENTER_ID).map(n => {
    const center = NODES.find(c => c.id === CENTER_ID)!;
    return { x1: center.cx, y1: center.cy, x2: n.cx, y2: n.cy, delay: NODES.indexOf(n) * 0.15 };
  });

  return (
    <>
      <style jsx>{`
        @keyframes pulse-venus {
          0%, 100% { r: 22; opacity: 1; }
          50% { r: 26; opacity: 0.75; }
        }
        @keyframes trace-line {
          0% { stroke-dashoffset: 300; opacity: 0; }
          30% { opacity: 0.5; }
          100% { stroke-dashoffset: 0; opacity: 0.4; }
        }
        @keyframes float-node {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .node-venus {
          animation: pulse-venus 3s ease-in-out infinite;
        }
        .connection-line {
          stroke-dasharray: 300;
          animation: trace-line 1.8s ease-out forwards;
        }
        .satellite-group {
          animation: float-node 4s ease-in-out infinite;
        }
        .satellite-group:nth-child(2) { animation-delay: 0.3s; }
        .satellite-group:nth-child(3) { animation-delay: 0.6s; }
        .satellite-group:nth-child(4) { animation-delay: 0.9s; }
        .satellite-group:nth-child(5) { animation-delay: 1.2s; }
        .satellite-group:nth-child(6) { animation-delay: 1.5s; }
        .satellite-group:nth-child(7) { animation-delay: 1.8s; }
        .satellite-group:nth-child(8) { animation-delay: 2.1s; }
      `}</style>
      <svg
        viewBox="0 0 600 300"
        className={`w-full max-w-2xl mx-auto ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Correspondence Codex constellation diagram showing Venus connected to esoteric correspondences"
        role="img"
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Radial background */}
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a1530" />
            <stop offset="100%" stopColor="#0a0a10" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="600" height="300" fill="url(#bg-grad)" rx="16" />

        {/* Connection lines */}
        {connections.map((conn, i) => (
          <line
            key={i}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke={NODES.find(n => n.cx === conn.x2)?.color ?? '#888'}
            strokeWidth="0.8"
            strokeDasharray="6 5"
            opacity="0"
            className="connection-line"
            style={{ animationDelay: `${0.4 + conn.delay}s` }}
          />
        ))}

        {/* Satellite nodes */}
        {NODES.filter(n => n.id !== CENTER_ID).map((node) => (
          <g key={node.id} className="satellite-group" style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}>
            {/* Outer glow ring */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r + 6}
              fill="none"
              stroke={node.color}
              strokeWidth="0.5"
              opacity="0.2"
              filter="url(#glow-soft)"
            />
            {/* Main node circle */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="rgba(10,10,16,0.8)"
              stroke={node.color}
              strokeWidth="1.5"
              filter="url(#glow-soft)"
            />
            {/* Label */}
            <text
              x={node.cx}
              y={node.cy + node.r + 14}
              textAnchor="middle"
              fill={node.labelColor}
              fontSize="9"
              fontFamily="Cinzel, serif"
              opacity="0.85"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Central Venus node */}
        <g>
          {/* Outer glow */}
          <circle
            cx={300}
            cy={150}
            r={28}
            fill="none"
            stroke="#C9A84C"
            strokeWidth="0.5"
            opacity="0.25"
            filter="url(#glow-gold)"
          />
          <circle
            cx={300}
            cy={150}
            r={22}
            fill="rgba(201,168,76,0.12)"
            stroke="#C9A84C"
            strokeWidth="2"
            filter="url(#glow-gold)"
            className="node-venus"
          />
          {/* Venus label */}
          <text
            x={300}
            y={155}
            textAnchor="middle"
            fill="#C9A84C"
            fontSize="11"
            fontFamily="Cinzel, serif"
            fontWeight="600"
            letterSpacing="0.05em"
          >
            Venus
          </text>
        </g>

        {/* Subtle star dots */}
        {[
          [50, 40], [180, 20], [350, 35], [550, 25], [30, 200],
          [570, 60], [90, 270], [500, 270], [280, 15], [420, 15],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.8"
            fill="#ffffff"
            opacity={0.15 + (i % 3) * 0.05}
          />
        ))}
      </svg>
    </>
  );
}
