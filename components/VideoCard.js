"use client";
import { useState } from "react";
import P from "./Pending";

export default function VideoCard({ name, area, youtubeId, quote }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="video">
      <div className="frame">
        {youtubeId && playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={`Video testimonial from ${name}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="play"
            onClick={() => youtubeId && setPlaying(true)}
            aria-label={youtubeId ? `Play video from ${name}` : "Video coming soon"}
            style={youtubeId ? { backgroundImage: `linear-gradient(#0006,#0006), url(https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg)` } : undefined}
          >
            <span className="ring"><svg width="26" height="26" viewBox="0 0 26 26"><path d="M6 3l17 10L6 23z" style={{ fill: "var(--coral)" }} /></svg></span>
            {!youtubeId && quote && <em className="vq">“{quote}”</em>}
          </button>
        )}
      </div>
      <figcaption><strong><P>{name}</P></strong> <span><P>{area}</P></span></figcaption>
    </figure>
  );
}