"use client";
import { useState } from "react";
import styles from "./PressFeature.module.css";

// Save the photo from the article as public/press-lokmat.jpg (any size, about 600px wide is plenty).
const IMAGE = "/press-lokmat.jpg";
const ARTICLE_URL = "https://www.lokmattimes.com/business/vedratnna-transforming-industrial-success-through-ancient-vastu-wisdom-a475/";
const TITLE = "Vedratnna: Transforming Industrial Success through Ancient Vastu Wisdom";
const SUB = "Pioneering Industrial Vastu Solutions That Drive Measurable Business Growth";

export default function PressFeature() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <article className={styles.card}>
      {imgOk && (
        <div className={styles.photo}>
          <img src={IMAGE} alt="Vedratnna featured in Lokmat Times" loading="lazy" onError={() => setImgOk(false)} />
        </div>
      )}
      <div className={styles.body}>
        <p className={styles.tag}><i />As featured in <b>Lokmat Times</b></p>
        <h3>{TITLE}</h3>
        <p className={styles.sub}>{SUB}</p>
        <a className="btn blue" href={ARTICLE_URL} target="_blank" rel="noopener noreferrer">Read the article</a>
      </div>
    </article>
  );
}
