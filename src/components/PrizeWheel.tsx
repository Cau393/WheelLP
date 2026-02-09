import './PrizeWheel.css'
import type { Prize } from '../data/prizes'

interface PrizeWheelProps {
  rotation: number
  segments: Prize[]
}

export default function PrizeWheel({ rotation, segments }: Readonly<PrizeWheelProps>) {
  // We create a dynamic gradient string based on the segments colors
  const gradientString = segments
    .map((s, i) => {
      const start = (i / segments.length) * 100;
      const end = ((i + 1) / segments.length) * 100;
      return `${s.color} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="wheel-container">
      {/* The Marker (Pointer) */}
      <div className="wheel-marker"></div>

      {/* The Rotating Wheel */}
      <div
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
          background: `conic-gradient(${gradientString})`,
        }}
      >
        {/* The Text Labels */}
        {segments.map((segment, index) => (
          <div
            key={index}
            className="wheel-segment"
            style={{
              // 360 / 12 = 30deg per slice.
              // +15deg offsets it to the CENTER of the slice.
              transform: `rotate(${index * 30 + 15}deg)`,
            }}
          >
            <span 
              className="segment-text" 
              style={{ color: segment.textColor }}
            >
              {segment.label}
            </span>
          </div>
        ))}

        {/* The Center Hub (Decoration) */}
        <div className="wheel-center" />
      </div>

      {/* The Outer Border Ring (Optional decoration for lights) */}
      <div className="wheel-border-ring" />
    </div>
  )
}