import Link from 'next/link';
import LegalPage from '../../components/LegalPage';
import Fill from '../../components/Fill';
import Mail from '../../components/Mail';
import { ENTREPRISE as E, LIVRAISON as L, RETOURS as R } from '../../lib/entreprise';

export const metadata = {
  title: 'Livraison et retours — Maxi Market',
  description: 'Livraison offerte en France métropolitaine, expédition sous 48 h. Retour possible pendant 14 jours après réception.',
  alternates: { canonical: '/livraison-retours' },
};

export default function LivraisonRetours() {
  return (
    <LegalPage title="Livraison et retours">
      <div className="facts">
        <div><strong>Offerte</strong>Livraison incluse dans le prix</div>
        <div><strong>{L.expedition}</strong>Expédition après paiement</div>
        <div><strong>{L.delai}</strong>Délai maximum de réception</div>
        <div><strong>{R.delai} jours</strong>Pour changer d’avis</div>
      </div>

      <h2>Livraison</h2>
      <ul>
        <li>Zone desservie : {L.zone}.</li>
        <li>Votre commande est expédiée sous {L.expedition} ouvrées après réception du paiement, puis livrée sous {L.delai} au plus tard.</li>
        <li>La livraison est effectuée par {L.transporteur}, à l’adresse indiquée lors de la commande. Indiquez un numéro joignable : le transporteur peut vous contacter.</li>
      </ul>

      <h2>À la réception</h2>
      <p>
        Vérifiez votre colis à la réception. En cas de dommage ou d’article manquant ou non conforme, prévenez-nous sous 3 jours à <Mail />, photos à l’appui. Même sans réserves,
        vous conservez vos garanties légales.
      </p>

      <h2>Retours : droit de rétractation de {R.delai} jours</h2>
      <ul>
        <li>Vous pouvez renoncer à votre achat pendant {R.delai} jours à compter de la réception, sans avoir à vous justifier.</li>
        <li>Prévenez-nous par e-mail à <Mail /> avec votre numéro de commande, ou utilisez le formulaire de rétractation figurant dans nos <Link href="/cgv#retractation">CGV</Link>.</li>
        <li>Renvoyez ensuite l’ensemble complet, non porté, non lavé et avec ses étiquettes, dans les 14 jours suivant votre demande. Vous pouvez bien sûr l’essayer, comme en boutique.</li>
        <li>Les frais de retour restent à votre charge. Leur coût est estimé à : <Fill v={R.coutRetour} />.</li>
        <li>Nous vous remboursons l’intégralité du prix payé sous 14 jours après votre demande, avec le même moyen de paiement. Nous pouvons attendre d’avoir reçu les articles, ou une preuve de son expédition, avant de rembourser.</li>
      </ul>

      <h2>Une question ?</h2>
      <p>Écrivez-nous à <Mail /> ou consultez notre page <Link href="/contact">Contact</Link>.</p>
    </LegalPage>
  );
}
