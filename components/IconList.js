// Card list with rounded-square icon tiles (matches the theme's "Why join" icons).
const s = (children) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const takeHomeIcons = [
  s(<><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z" /><path d="M5 17a3 3 0 013-3h11" /></>),
  s(<><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M8.5 10l1.5 1.5 2.5-3M9 16h6" /></>),
  s(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 12h16M12 4v16" /></>),
  s(<><path d="M5 9h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5z" /><path d="M16 10h2a2 2 0 010 4h-2M8 3v2M12 3v2" /></>),
  s(<path d="M5 5h14v10H10l-4 4v-4H5z" />),
];

export const audienceIcons = [
  s(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.3" /><path d="M17 14c2.2 0 4 1.8 4 4" /></>),
  s(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-5h4v5" /></>),
  s(<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M3 13h18" /></>),
  s(<><path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" /></>),
  s(<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" /></>),
];

export default function IconList({ items, icons }) {
  const colors = ["green", "blue", "coral"];
  return (
    <ul className="feat">
      {items.map((t, i) => (
        <li key={t}>
          <span className={`ico sm ${colors[i % 3]}`}>{icons[i]}</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
