'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../../lib/cart';
import { eur } from '../../../lib/format';
import { LIVRAISON, ENTREPRISE } from '../../../lib/entreprise';

const ECHEC = ['canceled', 'failed', 'expired'];

export default function Merci({ reference, token }) {
  const { clear } = useCart();
  const [s, setS] = useState({ state: 'loading' });
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    let alive = true, tries = 0;
    async function check() {
      try {
        const r = await fetch(`/api/commande/statut?ref=${encodeURIComponent(reference)}&t=${encodeURIComponent(token)}`, { cache: 'no-store' });
        const d = await r.json();
        if (!alive) return;
        if (!r.ok) return setS({ state: 'error', message: d.error });
        if (d.paid) { clear(); return setS({ state: 'paid', ...d }); }
        if (ECHEC.includes(d.status)) return setS({ state: 'failed', ...d });
        // Paiement en cours de validation (virement, 3D Secure…) : on revérifie quelques fois.
        if (++tries < 10) { setS({ state: 'pending', ...d }); setTimeout(check, 3000); }
        else setS({ state: 'pending-long', ...d });
      } catch { if (alive) setS({ state: 'error', message: 'Connexion impossible. Actualisez la page.' }); }
    }
    if (reference && token) check(); else setS({ state: 'error', message: 'Lien de commande incomplet.' });
    return () => { alive = false; };
  }, [reference, token, clear]);

  async function retry() {
    setRetrying(true);
    try {
      const r = await fetch('/api/commande/payer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: reference, t: token }) });
      const d = await r.json();
      if (d.checkoutUrl) { window.location.href = d.checkoutUrl; return; }
      if (d.paid) { window.location.reload(); return; }
      setS({ state: 'error', message: d.error || 'Réessayez dans un instant.' });
    } catch { setS({ state: 'error', message: 'Réessayez dans un instant.' }); }
    setRetrying(false);
  }

  return (
    <section className="block"><div className="wrap">
      {s.state === 'loading' && <p className="muted">Vérification de votre paiement…</p>}

      {(s.state === 'pending' || s.state === 'pending-long') && (
        <div className="ok">
          <strong>Commande {s.reference} enregistrée, paiement en cours de confirmation…</strong>
          <p>{s.state === 'pending' ? 'Cela prend généralement quelques secondes.' : 'La confirmation prend plus de temps que prévu. Vous recevrez un e-mail dès que le paiement sera validé.'}</p>
        </div>
      )}

      {s.state === 'paid' && (
        <div className="ok">
          <strong>Merci ! Votre paiement de {eur(s.total)} est confirmé.</strong>
          <p>Commande <strong>{s.reference}</strong></p>
          <ol>
            <li>Un récapitulatif vous est envoyé à {s.email} (pensez à vérifier vos courriers indésirables).</li>
            <li>Votre colis part sous {LIVRAISON.expedition} et arrive en {LIVRAISON.delai}.</li>
          </ol>
          <p>Une question ? Écrivez-nous à <a href={`mailto:${ENTREPRISE.email}`}>{ENTREPRISE.email}</a> en indiquant votre numéro de commande.</p>
          <p><Link className="btn" href="/produits">Continuer mes achats</Link></p>
        </div>
      )}

      {s.state === 'failed' && (
        <div className="ok warn">
          <strong>Le paiement n’a pas abouti.</strong>
          <p>Votre commande {s.reference} est conservée, mais rien n’a été débité. Vous pouvez réessayer maintenant.</p>
          <p><button className="btn" onClick={retry} disabled={retrying}>{retrying ? 'Redirection…' : `Réessayer le paiement (${eur(s.total)})`}</button></p>
          <p><Link className="linkbtn" href="/panier">Modifier mon panier</Link></p>
        </div>
      )}

      {s.state === 'error' && (
        <div className="err" role="alert">
          <p>{s.message}</p>
          <p><Link href="/contact">Nous contacter</Link></p>
        </div>
      )}
    </div></section>
  );
}
