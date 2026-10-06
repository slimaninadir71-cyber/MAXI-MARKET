import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '../../../components/Gallery';
import Buy from '../../../components/Buy';
import Price from '../../../components/Price';
import Reassurance from '../../../components/Reassurance';
import Faq from '../../../components/Faq';
import ProductCard from '../../../components/ProductCard';
import StickyBuy from '../../../components/StickyBuy';
import { getProduct, getProducts } from '../../../lib/supabase';
import { SITE_URL, describe, allImages } from '../../../lib/format';
import { LIVRAISON, RETOURS } from '../../../lib/entreprise';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const p = await getProduct(params.slug);
  if (!p) return { title: 'Produit introuvable — Maxi Market' };
  return {
    title: `${p.name} — Maxi Market`,
    description: describe(p),
    alternates: { canonical: `/produits/${p.slug}` },
    openGraph: { images: allImages(p).slice(0, 1) },
  };
}

export default async function Fiche({ params }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const others = (await getProducts()).filter((x) => x.slug !== p.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: describe(p),
    image: allImages(p).map((i) => (i.startsWith('http') ? i : `${SITE_URL}${i}`)),
    category: p.category || 'Ensembles',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/produits/${p.slug}`,
      priceCurrency: 'EUR',
      price: Number(p.price).toFixed(2),
      availability: p.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'EUR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'FR' },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: RETOURS.delai,
      },
    },
  };

  return (
    <section className="block pdp-block"><div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="crumbs"><Link href="/">Accueil</Link> / <Link href="/produits">Les ensembles</Link> / {p.name}</p>
      <div className="pdp">
        <Gallery images={p.images} alt={p.name} />
        <div className="pdp-info">
          <p className="eyebrow">{p.category || 'Ensemble'}</p>
          <h1>{p.name}</h1>
          <Price p={p} large />
          <p className="pdp-desc">{p.description}</p>
          <div id="choisir"><Buy product={p} /></div>
          <Reassurance />
          <div className="details">
            {p.composition && <details open><summary>Composition</summary><p>{p.composition}</p></details>}
            {p.care && <details><summary>Entretien</summary><p>{p.care}</p></details>}
            <details><summary>Livraison</summary><p>Livraison offerte en {LIVRAISON.zone}. Expédition sous {LIVRAISON.expedition}, réception en {LIVRAISON.delai}.</p></details>
            <details><summary>Retours</summary><p>{RETOURS.delai} jours après réception pour changer d’avis. <Link href="/livraison-retours">Voir les conditions</Link>.</p></details>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className="related">
          <h2>Vous aimerez aussi</h2>
          <div className="grid">{others.map((o) => <ProductCard key={o.id} p={o} />)}</div>
        </div>
      )}
      <div className="faq-solo"><Faq title="Questions fréquentes" /></div>
      {p.in_stock && <StickyBuy price={p.price} />}
    </div></section>
  );
}
