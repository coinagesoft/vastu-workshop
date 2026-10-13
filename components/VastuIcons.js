// Vastu-themed line icons (compass, mandala, five elements, diya, lotus, ...).
// All use currentColor, so they follow the theme.
const S = (children, size = 26) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

// Direction compass with needle
export const compass = (z) => S(<><circle cx="12" cy="12" r="9" /><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5" /><path d="M12 7l2.3 5-2.3 5-2.3-5z" /><circle cx="12" cy="12" r=".8" fill="currentColor" /></>, z);

// Vastu Purusha Mandala (9-grid with the Brahmasthan centre)
export const mandala = (z) => S(<><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16" /><rect x="9.3" y="9.3" width="5.4" height="5.4" fill="currentColor" fillOpacity=".3" /></>, z);

// 16 zones (Vastu Shakti Chakra): circle with 16 spokes
export const zones16 = (z) => S(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.6" />
  {Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return <path key={i} d={`M${(12 + 2.6 * c).toFixed(2)} ${(12 + 2.6 * s).toFixed(2)}L${(12 + 9 * c).toFixed(2)} ${(12 + 9 * s).toFixed(2)}`} />;
  })}</>, z);

// Five elements (Panchabhuta): pentagon with a node at each element
export const elements5 = (z) => S(<><path d="M12 4.5l7.1 5.2-2.7 8.4H7.6L4.9 9.7z" />
  {[[12, 4.5], [19.1, 9.7], [16.4, 18.1], [7.6, 18.1], [4.9, 9.7]].map(([x, y]) => <circle key={x + "-" + y} cx={x} cy={y} r="1.9" fill="currentColor" />)}</>, z);

// House with a crack (spot a Vastu defect)
export const defect = (z) => S(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M12.5 10l-1.8 3.2 2.2 1.6-1.6 3.7" /></>, z);

// Diya (oil lamp): the remedy
export const diya = (z) => S(<><path d="M4 14.5c0 3.3 3.6 5.5 8 5.5s8-2.2 8-5.5z" /><path d="M12 4c1.7 2.1 2.7 3.3 2.7 4.9a2.7 2.7 0 01-5.4 0C9.3 7.3 10.3 6.1 12 4z" /><path d="M9 20.5h6" /></>, z);

// House with a tick (check before you buy or rent)
export const houseCheck = (z) => S(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M9.3 15l2.2 2.2 3.6-3.7" /></>, z);

// Rising sun (East, Surya)
export const sunrise = (z) => S(<><path d="M3 18.5h18" /><path d="M7 18.5a5 5 0 0110 0" /><path d="M12 6v2.2M5.3 9.3l1.5 1.5M18.7 9.3l-1.5 1.5M2.8 14.5h2M19.2 14.5h2" /></>, z);

// Lotus
export const lotus = (z) => S(<><path d="M12 5c1.9 2.2 2.7 4.5 0 8-2.7-3.5-1.9-5.8 0-8z" /><path d="M12 13c-3.2 0-6.2-1.4-7.2-5 3.2 0 5.8 1.4 7.2 5zM12 13c3.2 0 6.2-1.4 7.2-5-3.2 0-5.8 1.4-7.2 5z" /><path d="M5 17c2.2 2.4 11.8 2.4 14 0" /></>, z);

// Thali (lunch)
export const thali = (z) => S(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="8.6" r="1.6" /><circle cx="9" cy="13.6" r="1.6" /><circle cx="15" cy="13.6" r="1.6" /></>, z);

// Family home
export const familyHome = (z) => S(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><circle cx="9.8" cy="13.4" r="1.3" /><circle cx="14.2" cy="13.4" r="1.3" /><path d="M7.9 19c0-1.6 1-2.6 1.9-2.6s1.9 1 1.9 2.6M12.3 19c0-1.6 1-2.6 1.9-2.6s1.9 1 1.9 2.6" /></>, z);

// Key (buying, renting, building)
export const key = (z) => S(<><circle cx="8" cy="14" r="3.5" /><path d="M10.6 11.4L20 2.5M17 5.4l2.5 2.5M14.5 8l2 2" /></>, z);

// Shop / office
export const office = (z) => S(<><path d="M4 20V9l8-5 8 5v11z" /><path d="M9 20v-5h6v5M8 11h2M14 11h2" /></>, z);

// Drafting compass (architects, designers)
export const drafting = (z) => S(<><circle cx="12" cy="3.6" r="1.2" /><path d="M11.2 4.6L6 20.5M12.8 4.6L18 20.5M8.6 14h6.8" /></>, z);

// Award medal (certificate)
export const award = (z) => S(<><circle cx="12" cy="9" r="5" /><circle cx="12" cy="9" r="2" /><path d="M9 13.4L7.6 21l4.4-2.4 4.4 2.4-1.4-7.6" /></>, z);

// Chat bubble (WhatsApp support group)
export const chat = (z) => S(<path d="M5 5h14v10H10l-4 4v-4H5z" />, z);