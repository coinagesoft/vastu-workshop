import styles from "./VenueMap.module.css";

// Compact venue map for the booking summary panel (Keys Prima by Lemon Tree Hotels, Pimpri)
const NAME = "Keys Prima by Lemon Tree Hotels, Pimpri";
const LAT = 18.6318509;
const LNG = 73.8016626;

const embed = `https://maps.google.com/maps?q=${encodeURIComponent(NAME)}%20@${LAT},${LNG}&ll=${LAT},${LNG}&z=15&output=embed`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

export default function VenueMap() {
  return (
    <div className={styles.mini}>
      <div className={styles.map}>
        <iframe
          title={`Map showing ${NAME}`}
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className={styles.row}>
        <span>{NAME}</span>
        <a href={directions} target="_blank" rel="noopener noreferrer">Directions &rarr;</a>
      </div>
    </div>
  );
}