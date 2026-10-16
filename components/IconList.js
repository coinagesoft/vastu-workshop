// Card list with gradient check-circle markers (same style as the "What you'll learn" list).
// The icon arrays are kept so existing imports keep working.
import * as V from "./VastuIcons";

export const takeHomeIcons = [V.lotus(24), V.diya(24), V.mandala(24), V.thali(24), V.chat(24), V.award(24)];
export const audienceIcons = [V.familyHome(24), V.key(24), V.office(24), V.drafting(24), V.lotus(24)];

export default function IconList({ items }) {
  return (
    <ul className="learn small icon-list">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}