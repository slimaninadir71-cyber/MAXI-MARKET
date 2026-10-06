'use client';
import { useEffect } from 'react';
import { eur } from '../lib/format';

// Barre fixée en bas de l'écran sur téléphone : ramène au choix de taille.
export default function StickyBuy({ price }) {
  useEffect(() => {
    document.body.classList.add('has-sticky');
    return () => document.body.classList.remove('has-sticky');
  }, []);
  return (
    <div className="sticky-buy" role="region" aria-label="Acheter ce produit">
      <strong>{eur(price)}</strong>
      <a className="btn" href="#choisir">Choisir ma taille</a>
    </div>
  );
}
