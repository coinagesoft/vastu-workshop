// 16-zone Vastu wheel (decorative, slowly rotating).
export default function CompassWheel({ className = "wheel" }) {
  const spokes = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg className={className} viewBox="-200 -200 400 400" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle r="190" /><circle r="140" /><circle r="90" /><circle r="40" />
        <rect x="-60" y="-60" width="120" height="120" />
        {spokes.map((a) => (
          <line key={a} x1="0" y1="-40" x2="0" y2="-190" transform={`rotate(${a})`} strokeOpacity={a % 90 === 0 ? 1 : 0.55} />
        ))}
      </g>
      <path d="M0 -190 L9 -148 L0 -138 L-9 -148Z" style={{ fill: "var(--coral)" }} stroke="none" />
    </svg>
  );
}