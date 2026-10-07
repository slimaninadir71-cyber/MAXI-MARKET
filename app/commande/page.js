'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart, useCartDetails } from '../../lib/cart';
import { eur, lineLabel } from '../../lib/format';
import Reassurance from '../../components/Reassurance';
import { LIVRAISON } from '../../lib/entreprise';

export default function Commande() {
  const { lines } = useCart();
  const { detailed, total, loading } = useCartDetails();
  const saving = detailed.reduce((s, { quantity, product }) =>
    s + (product.compare_at_price && Number(product.compare_at_price) > Number(product.price)
      ? (Number(product.compare_at_price) - Number(product.price)) * quantity : 0), 0);
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    setState('sending'); setMessage('');
    try {
      const res = await fetch('/api/commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, items: lines }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || 'Erreur');
      setState('redirect');
      window.location.href = data.checkoutUrl; // page de paiement sécurisée Mollie
    } catch (err) {
      setMessage(err.message === 'Erreur' ? 'L’envoi a échoué. Réessayez dans un instant.' : err.message);
      setState('error');
    }
  }


  return (
    <section className="block"><div className="wrap">
      <h1 className="pagetitle">Vos coordonnées</h1>
      <ol className="progress"><li className="done">Panier</li><li className="now">Coordonnées</li><li>Paiement sécurisé</li></ol>
      {loading ? <p className="muted">Chargement…</p> : detailed.length === 0 ? (
        <div className="empty">
          <p>Votre panier est vide. Ajoutez un ensemble pour commander.</p>
          <Link className="btn" href="/produits">Voir les ensembles</Link>
        </div>
      ) : (
        <div className="checkout">
          <form className="form" onSubmit={submit}>
            <label>Nom complet<input name="full_name" autoComplete="name" required maxLength="120" /></label>
            <div className="row">
              <label>Téléphone<input name="phone" type="tel" autoComplete="tel" required maxLength="40" /><small className="hint">Utile au transporteur pour la livraison.</small></label>
              <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength="160" /><small className="hint">Pour recevoir votre récapitulatif.</small></label>
            </div>
            <label>Adresse de livraison<input name="address" autoComplete="street-address" required maxLength="200" /></label>
            <div className="row">
              <label>Code postal<input name="postal_code" autoComplete="postal-code" required maxLength="12" /></label>
              <label>Ville<input name="city" autoComplete="address-level2" required maxLength="80" /></label>
            </div>
            <label>Précisions pour la livraison (facultatif)<textarea name="notes" rows="3" maxLength="1000" /></label>
            <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp" />
            <label className="check"><input type="checkbox" name="cgv" value="oui" required /> <span>J’ai lu et j’accepte les <Link href="/cgv" target="_blank">conditions générales de vente</Link>, dont le droit de rétractation de 14 jours.</span></label>
            {state === 'error' && <div className="err" role="alert">{message}</div>}
            <button className="btn btn-block" disabled={state === 'sending' || state === 'redirect'}>{state === 'sending' || state === 'redirect' ? 'Redirection vers le paiement…' : `Payer ${eur(total)}`}</button>
            <p className="muted small">En cliquant sur « Payer », vous validez votre commande avec obligation de paiement. Vous êtes redirigé vers la page de paiement sécurisée de notre prestataire Mollie (carte bancaire, Apple Pay…). Nous ne voyons jamais vos données bancaires.</p>
          </form>
          <aside className="cart-sum">
            <h2 className="sumtitle">Récapitulatif</h2>
            <ul className="sumlist">
              {detailed.map((line) => (
                <li key={line.key}><span>{line.quantity} × {line.product.name}<small className="muted"> {lineLabel(line)}</small></span><strong>{eur(Number(line.product.price) * line.quantity)}</strong></li>
              ))}
            </ul>
            <p className="row-sum"><span>Livraison ({LIVRAISON.delai})</span><strong className="free">Gratuite</strong></p>
            {saving > 0 && <p className="row-sum save"><span>Vous économisez</span><strong>{eur(saving)}</strong></p>}
            <p className="row-sum total"><span>Total</span><strong>{eur(total)}</strong></p>
            <Reassurance compact />
            <p className="muted small">Vos coordonnées servent uniquement à traiter et livrer votre commande.</p>
            <Link className="linkbtn" href="/panier">Modifier le panier</Link>
          </aside>
        </div>
      )}
    </div></section>
  );
}
