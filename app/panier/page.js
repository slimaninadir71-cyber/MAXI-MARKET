'use client';
import Link from 'next/link';
import { useCart, useCartDetails } from '../../lib/cart';
import { eur, firstImage, lineLabel } from '../../lib/format';
import Reassurance from '../../components/Reassurance';

export default function Panier() {
  const { setQty, remove, MAX_QTY } = useCart();
  const { detailed, total, loading } = useCartDetails();
  const saving = detailed.reduce((s, { quantity, product }) =>
    s + (product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
      ? (Number(product.compare_at_price) - Number(product.price)) * quantity : 0), 0);

  return (
    <section className="block"><div className="wrap">
      <h1 className="pagetitle">Votre panier</h1>
      {loading ? <p className="muted">Chargement du panier…</p> : detailed.length === 0 ? (
        <div className="empty">
          <p>Votre panier est vide.</p>
          <Link className="btn" href="/produits">Voir les ensembles</Link>
        </div>
      ) : (
        <div className="cart">
          <ul className="cart-lines">
            {detailed.map((line) => { const { key, slug, quantity, product } = line; return (
              <li key={key} className="cart-line">
                <img src={firstImage(product)} alt="" className="cart-img" />
                <div className="cart-info">
                  <Link href={`/produits/${slug}`}><strong>{product.name}</strong></Link>
                  <span className="muted">{lineLabel(line)}</span>
                  <span className="muted">{eur(product.price)} l’unité{product.compare_at_price && Number(product.compare_at_price) > Number(product.price) ? <> au lieu de <s>{eur(product.compare_at_price)}</s></> : null}</span>
                  <button type="button" className="linkbtn" onClick={() => remove(key)}>Retirer</button>
                </div>
                <label className="qty">
                  Quantité
                  <input type="number" min="1" max={MAX_QTY} value={quantity}
                    onChange={(e) => setQty(key, Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), MAX_QTY))} />
                </label>
                <strong className="line-total">{eur(Number(product.price) * quantity)}</strong>
              </li>
            ); })}
          </ul>
          <aside className="cart-sum">
            <p className="row-sum"><span>Livraison</span><strong className="free">Gratuite</strong></p>
            {saving > 0 && <p className="row-sum save"><span>Vous économisez</span><strong>{eur(saving)}</strong></p>}
            <p className="row-sum total"><span>Total</span><strong>{eur(total)}</strong></p>
            <Link className="btn btn-block" href="/commande">Passer commande</Link>
            <p className="muted small center">Paiement 100 % sécurisé par carte bancaire.</p>
            <Reassurance compact />
            <Link className="linkbtn" href="/produits">Continuer mes achats</Link>
          </aside>
        </div>
      )}
    </div></section>
  );
}
