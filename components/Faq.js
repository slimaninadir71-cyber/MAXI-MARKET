import Link from 'next/link';
import { ENTREPRISE as E, LIVRAISON as L, RETOURS as R, rempli } from '../lib/entreprise';

const mail = (e) => (rempli(e) ? <a href={`mailto:${e}`}>{e}</a> : 'notre adresse de contact');

export default function Faq({ title = 'Vos questions' }) {
  const list = [
    { q: 'Comment se passe le paiement ?', a: <>À la fin de votre commande, vous êtes redirigé vers la page sécurisée de notre partenaire de paiement Mollie (carte bancaire, Apple Pay…). Nous ne voyons jamais vos données bancaires. Votre colis part dès le paiement confirmé.</> },
    { q: 'Combien de temps pour être livré ?', a: <>Votre commande est expédiée sous {L.expedition} après le paiement et arrive en {L.delai}. La livraison est offerte en {L.zone}.</> },
    { q: 'Comment choisir ma taille ?', a: <>Chaque ensemble est vendu dans une seule taille pour le haut et le bas. Consultez le <Link href="/guide-des-tailles">guide des tailles</Link> et, entre deux tailles, prenez la plus grande pour plus d’aisance.</> },
    { q: 'Puis-je retourner ma commande ?', a: <>Oui, vous avez {R.delai} jours après réception pour vous rétracter, sans justification. L’ensemble doit être non porté, non lavé et dans son état d’origine. Détails sur la page <Link href="/livraison-retours">Livraison et retours</Link>.</> },
    { q: 'Et si l’article ne correspond pas ou arrive abîmé ?', a: <>Écrivez-nous à {mail(E.email)} avec votre numéro de commande et des photos : nous trouvons une solution avec vous (échange, remplacement ou remboursement).</> },
  ];
  return (
    <div className="faq">
      <h2>{title}</h2>
      {list.map(({ q, a }) => (
        <details key={q}><summary>{q}</summary><p>{a}</p></details>
      ))}
    </div>
  );
}
