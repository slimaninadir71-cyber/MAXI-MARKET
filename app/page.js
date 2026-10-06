import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import Faq from '../components/Faq';
import { Truck, Phone, Return, Hanger } from '../components/Icons';
import { getProducts } from '../lib/supabase';
import { eur, firstImage } from '../lib/format';
import { LIVRAISON, RETOURS, ENTREPRISE } from '../lib/entreprise';

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();
  const hero = products.find((p) => p.featured) || products[0];
  const cheapest = products.length ? Math.min(...products.map((p) => Number(p.price))) : null;

  return (
    <>
      <section className="hero">
        <div className="hero-in">
          <div className="hero-copy">
            <p className="eyebrow">Les ensembles Maxi Market</p>
            <h1>Un ensemble, <em>une tenue</em> déjà pensée.</h1>
            <p className="hero-sub">Haut et bas assortis, coupes soignées, matières agréables. Vous choisissez, on s’occupe du reste.</p>
            <div className="hero-actions">
              <Link className="btn" href="#collection">Découvrir les ensembles</Link>
              {cheapest && <span className="hero-price">dès <strong>{eur(cheapest)}</strong> · livraison offerte</span>}
            </div>
          </div>
          {hero && (
            <Link href={`/produits/${hero.slug}`} className="hero-photo" aria-label={`Voir ${hero.name}`}>
              <img src={firstImage(hero)} alt={hero.name} fetchPriority="high" />
              <span className="hero-tag">{hero.name}<strong>{eur(hero.price)}</strong></span>
            </Link>
          )}
        </div>
      </section>

      <ul className="proofs" aria-label="Nos engagements">
        <li><Truck /><span><strong>Livraison offerte</strong>expédiée sous {LIVRAISON.expedition}, reçue en {LIVRAISON.delai}</span></li>
        <li><Phone /><span><strong>Rien à payer en ligne</strong>vous réglez après notre appel de confirmation</span></li>
        <li><Return /><span><strong>{RETOURS.delai} jours pour changer d’avis</strong>retour possible dès la réception</span></li>
        <li><Hanger /><span><strong>Haut et bas assortis</strong>une seule taille à choisir, aucun risque d’associer de travers</span></li>
      </ul>

      <section className="home-sec" id="collection"><div className="wrap">
        <div className="sec-head">
          <h2>La collection</h2>
          <p>{products.length ? `${products.length} ensembles` : 'Les ensembles'}, tous livrés gratuitement en France métropolitaine.</p>
        </div>
        {products.length === 0 ? <p className="muted">Les ensembles arrivent très bientôt.</p> : (
          <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </div></section>

      <section className="home-sec why"><div className="wrap">
        <div className="sec-head">
          <h2>Pourquoi choisir un ensemble</h2>
        </div>
        <div className="why-grid">
          <div><span className="num">01</span><h3>Zéro hésitation</h3><p>Le haut et le bas sont déjà accordés : couleurs, matière, coupe. Vous enfilez, c’est prêt.</p></div>
          <div><span className="num">02</span><h3>Une tenue complète</h3><p>Deux pièces pour le prix d’un look entier, à porter ensemble ou séparément selon l’humeur.</p></div>
          <div><span className="num">03</span><h3>Simple à commander</h3><p>Choisissez la taille, laissez vos coordonnées. Nous vous appelons, vous payez ensuite.</p></div>
        </div>
      </div></section>

      <section className="home-sec"><div className="wrap faq-grid">
        <Faq title="Les questions qu’on nous pose" />
        <aside className="help">
          <h2>Un doute sur la taille ?</h2>
          <p>Consultez le guide des tailles, ou écrivez-nous : on vous conseille avant que vous commandiez.</p>
          <Link className="btn btn-ghost" href="/guide-des-tailles">Voir le guide des tailles</Link>
          <p className="help-mail"><Link href="/contact">Nous contacter</Link></p>
        </aside>
      </div></section>

      <section className="closing"><div className="wrap">
        <h2>Votre prochaine tenue vous attend.</h2>
        <Link className="btn btn-light" href="#collection">Voir les ensembles</Link>
      </div></section>
    </>
  );
}
