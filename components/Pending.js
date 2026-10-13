// Renders text and highlights [bracketed] items that still need confirmation.
export default function P({ children }) {
  const parts = String(children).split(/(\[[^\]]+\])/g);
  return parts.map((s, i) =>
    /^\[[^\]]+\]$/.test(s) ? <mark key={i} className="pending">{s}</mark> : <span key={i}>{s}</span>
  );
}
