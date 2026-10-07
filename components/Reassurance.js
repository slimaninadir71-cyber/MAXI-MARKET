import Link from 'next/link';
import { LIVRAISON, RETOURS } from '../lib/entreprise';

const ITEMS = (L, R) => [
  { t: 'Livraison offerte', d: `Expédié sous ${L.expedition}, reçu en ${L.delai}.` },
  { t: 'Paiement sécurisé', d: 'Carte bancaire ou Apple Pay, via Mollie.' },
  { t: `Retours sous ${R.delai} jours`, d: 'À compter de la réception.', href: '/livraison-retours' },
];

export default function Reassurance({ compact = false }) {
  return (
    <ul className={`reassure${compact ? ' compact' : ''}`}>
      {ITEMS(LIVRAISON, RETOURS).map((i) => (
        <li key={i.t}>
          <span className="tick" aria-hidden="true">✓</span>
          <span>
            <strong>{i.href ? <Link href={i.href}>{i.t}</Link> : i.t}</strong>
            {!compact && <small>{i.d}</small>}
          </span>
        </li>
      ))}
    </ul>
  );
}
