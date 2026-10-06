'use client';
import { useState } from 'react';

export default function Gallery({ images, alt }) {
  const [i, setI] = useState(0);
  const list = images && images.length ? images : ['/placeholder.svg'];
  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={list[i]} alt={i === 0 ? alt : `${alt}, vue ${i + 1}`} />
      </div>
      {list.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label="Photos du produit">
          {list.map((src, n) => (
            <button key={src + n} type="button" className={n === i ? 'on' : ''} aria-label={`Voir la photo ${n + 1}`} aria-pressed={n === i} onClick={() => setI(n)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
