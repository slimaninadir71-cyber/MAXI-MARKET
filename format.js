export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://maxi-market-fr.com';

export const eur = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(n));

export const firstImage = (p) => (Array.isArray(p.images) && p.images[0]) || '/placeholder.svg';
export const allImages = (p) => (Array.isArray(p.images) && p.images.length ? p.images : ['/placeholder.svg']);

export const describe = (p) =>
  `${p.name} : ${p.description || 'ensemble assorti'}${p.composition ? ` Composition : ${p.composition}.` : ''} Livraison offerte dès la première commande en France.`;

// Clé d'une ligne de panier : un même ensemble en deux tailles = deux lignes.
export const lineKey = (l) => `${l.slug}|${l.size || ''}|${l.color || ''}`;
export const lineLabel = (l) => [l.size && `Taille ${l.size}`, l.color].filter(Boolean).join(' · ');
