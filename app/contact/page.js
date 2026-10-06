import Link from 'next/link';
import LegalPage from '../../components/LegalPage';
import Fill from '../../components/Fill';
import Mail from '../../components/Mail';
import { ENTREPRISE as E, rempli } from '../../lib/entreprise';

export const metadata = {
  title: 'Contact — Maxi Market',
  description: 'Une question sur un ensemble, une taille ou une commande ? Écrivez à l’équipe Maxi Market.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  return (
    <LegalPage title="Contact">
      <p className="lead">Une question sur un ensemble, une taille, une livraison ou une commande en cours ? Nous répondons {E.horaires}.</p>
      <div className="facts">
        <div><strong>E-mail</strong><Mail /></div>
        {rempli(E.telephone) && <div><strong>Téléphone</strong><a href={`tel:${E.telephone.replace(/\s/g, '')}`}>{E.telephone}</a></div>}
        <div><strong>Réponse</strong>Sous 24 h, {E.horaires}</div>
      </div>
      <h2>Pour une commande en cours</h2>
      <p>Indiquez votre numéro de commande (par exemple MM-00012) : nous vous répondons plus vite.</p>
      <h2>Adresse postale</h2>
      <p><Fill v={E.raisonSociale} /><br /><Fill v={E.adresse} /></p>
      <p>Voir aussi : <Link href="/livraison-retours">livraison et retours</Link> · <Link href="/cgv">conditions générales de vente</Link>.</p>
    </LegalPage>
  );
}
