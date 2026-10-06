import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import Faq from '../components/Faq';
import { Truck, Phone, Return, Hanger } from '../components/Icons';
import { getProducts } from '../lib/supabase';
import { eur } from '../lib/format';
import { LIVRAISON, RETOURS } from '../lib/entreprise';

export const revalidate = 60;

// Image d'accueil : plusieurs tailles, l'appareil télécharge seulement celle qu'il lui faut.
const H = '/accueil';
const DESKTOP = [960, 1600, 2400, 3200].map((w) => `${H}/hero-${w}.webp ${w}w`).join(', ');
const MOBILE = [750, 1125].map((w) => `${H}/hero-m-${w}.webp ${w}w`).join(', ');

function HeroPicture({ className = '', priority = false, alt = '' }) {
  return (
    <picture>
      <source media="(max-width: 700px)" type="image/webp" srcSet={MOBILE} sizes="100vw" />
      <source type="image/webp" srcSet={DESKTOP} sizes="100vw" />
      <img
        className={className}
        src={`${H}/hero-1920.jpg`}
        alt={alt}
        width="1920"
        height="1080"
        decoding="async"
        {...(priority ? { fetchPriority: 'high' } : { loading: 'lazy' })}
      />
    </picture>
  );
}

export default async function Home() {
  const products = await getProducts();
  const cheapest = products.length ? Math.min(...products.map((p) => Number(p.price))) : null;

  return (
    <>
      <section className="hero-full" aria-label="Maxi Market">
        <HeroPicture className="hero-img" priority alt="Groupe de jeunes portant des ensembles assortis noirs, gris et blancs" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow light">Ensembles assortis · Livraison offerte</p>
          <h1>L’ensemble qui fait <em>toute la tenue.</em></h1>
          <p className="hero-sub">Haut et bas assortis, une seule taille à choisir. Vous commandez, on s’occupe du reste.</p>
          <div className="hero-actions">
            <Link className="btn btn-light" href="#collection">Voir la collection</Link>
            {cheapest && <span className="hero-price">À partir de <strong>{eur(cheapest)}</strong></span>}
          </div>
        </div>
      </section>

      <ul className="proofs" aria-label="Nos engagements">
        <li><Truck /><span><strong>Livraison offerte</strong>expédiée sous {LIVRAISON.expedition}, reçue en {LIVRAISON.delai}</span></li>
        <li><Phone /><span><strong>Rien à payer en ligne</strong>vous réglez après notre appel de confirmation</span></li>
        <li><Return /><span><strong>{RETOURS.delai} jours pour changer d’avis</strong>retour possible dès la réception</span></li>
        <li><Hanger /><span><strong>Haut et bas assortis</strong>une seule taille à choisir, aucun risque de se tromper</span></li>
      </ul>

      <section className="home-sec" id="collection"><div className="wrap">
        <div className="sec-head row-head">
          <div>
            <h2>La collection</h2>
            <p>{products.length ? `${products.length} ensembles` : 'Nos ensembles'}{cheapest ? `, à partir de ${eur(cheapest)}` : ''}. Livraison offerte en France métropolitaine.</p>
          </div>
          <Link className="textlink" href="/guide-des-tailles">Trouver ma taille →</Link>
        </div>
        {products.length === 0 ? <p className="muted">Les ensembles arrivent très bientôt.</p> : (
          <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </div></section>

      <section className="home-sec why"><div className="wrap">
        <div className="sec-head">
          <h2>Commander, c’est simple</h2>
          <p>Aucun paiement en ligne : on se parle d’abord, on expédie ensuite.</p>
        </div>
        <ol className="why-grid steps3">
          <li><span className="num">01</span><h3>Choisissez</h3><p>Votre ensemble et votre taille. Le haut et le bas sont déjà assortis.</p></li>
          <li><span className="num">02</span><h3>Commandez</h3><p>Laissez vos coordonnées en une minute, sans créer de compte.</p></li>
          <li><span className="num">03</span><h3>Recevez</h3><p>Nous vous appelons pour confirmer, puis votre colis part sous {LIVRAISON.expedition}.</p></li>
        </ol>
      </div></section>

      <section className="home-sec"><div className="wrap faq-grid">
        <Faq title="Vos questions" />
        <aside className="help">
          <h2>Un doute sur la taille ?</h2>
          <p>Consultez le guide des tailles, ou écrivez-nous : on vous conseille avant que vous commandiez.</p>
          <Link className="btn btn-ghost" href="/guide-des-tailles">Voir le guide des tailles</Link>
          <p className="help-mail"><Link href="/contact">Nous contacter</Link></p>
        </aside>
      </div></section>

      <section className="closing-img">
        <HeroPicture className="closing-bg" alt="" />
        <div className="closing-shade" aria-hidden="true" />
        <div className="wrap closing-in">
          <h2>Votre prochaine tenue est à un clic.</h2>
          <Link className="btn btn-light" href="#collection">Choisir mon ensemble</Link>
        </div>
      </section>
    </>
  );
}
