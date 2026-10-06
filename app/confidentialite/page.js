import LegalPage from '../../components/LegalPage';
import Fill from '../../components/Fill';
import Mail from '../../components/Mail';
import { ENTREPRISE as E, HEBERGEUR as H } from '../../lib/entreprise';

export const metadata = { title: 'Confidentialité et cookies — Maxi Market', alternates: { canonical: '/confidentialite' } };

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité et cookies">
      <h2>Responsable du traitement</h2>
      <p><Fill v={E.raisonSociale} />, <Fill v={E.adresse} />. Contact : <Mail />.</p>

      <h2>Données collectées</h2>
      <p>
        Lors d’une commande : nom, téléphone, adresse e-mail, adresse de livraison, précisions de livraison facultatives et contenu de la
        commande. Lorsque vous nous écrivez : le contenu de vos messages. Nous ne collectons aucune donnée bancaire : le paiement est traité par
        l’établissement de paiement.
      </p>

      <h2>Pourquoi et sur quelle base</h2>
      <ul>
        <li>Traiter, livrer et suivre votre commande, et répondre à vos demandes : exécution du contrat.</li>
        <li>Tenir notre comptabilité et conserver les factures : obligation légale.</li>
        <li>Prévenir les fraudes et les commandes abusives : intérêt légitime.</li>
      </ul>
      <p>Nous n’envoyons pas de publicité et ne vendons pas vos données.</p>

      <h2>Durée de conservation</h2>
      <ul>
        <li>Données de commande et de contact : 3 ans après la dernière commande ou le dernier échange.</li>
        <li>Pièces comptables : 10 ans, comme l’exige la loi.</li>
      </ul>

      <h2>Destinataires</h2>
      <p>
        Vos données sont réservées à {E.nomCommercial} et à ses prestataires, dans la limite de leur mission : le transporteur (nom, téléphone et
        adresse de livraison), l’hébergeur du site ({H.nom}), le service de base de données (Supabase), le service d’envoi d’e-mails (Resend) et
        l’établissement de paiement. Certains de ces prestataires sont situés aux États-Unis ; ces transferts sont encadrés par le cadre de
        protection des données UE–États-Unis ou par les clauses contractuelles types de la Commission européenne.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l’accès, la rectification, l’effacement ou la portabilité de vos données, la limitation de leur traitement ou vous
        y opposer, en écrivant à <Mail />. Vous pouvez aussi introduire une réclamation auprès de la CNIL
        (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site n’utilise ni cookie publicitaire ni outil de mesure d’audience. Seul le contenu de votre panier est enregistré dans votre
        navigateur (stockage local), pour le conserver d’une visite à l’autre. Cet enregistrement est indispensable au fonctionnement du
        panier et ne nécessite pas votre consentement. Vous pouvez l’effacer à tout moment depuis les réglages de votre navigateur.
      </p>
    </LegalPage>
  );
}
