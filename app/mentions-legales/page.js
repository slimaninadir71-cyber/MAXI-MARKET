import Link from 'next/link';
import LegalPage from '../../components/LegalPage';
import Fill from '../../components/Fill';
import Mail from '../../components/Mail';
import { ENTREPRISE as E, HEBERGEUR as H } from '../../lib/entreprise';

export const metadata = { title: 'Mentions légales — Maxi Market', alternates: { canonical: '/mentions-legales' } };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le site {E.site} est édité par : <Fill v={E.raisonSociale} />, <Fill v={E.forme} />.<br />
        Siège : <Fill v={E.adresse} /><br />
        SIRET : <Fill v={E.siret} /> · <Fill v={E.rcs} /><br />
        TVA : <Fill v={E.tva} /><br />
        E-mail : <Mail /> · Téléphone : <Fill v={E.telephone} />
      </p>
      <p>Directeur de la publication : <Fill v={E.directeurPublication} />.</p>

      <h2>Hébergement</h2>
      <p>{H.nom}, {H.adresse} — <a href={H.site} rel="noopener">{H.site.replace('https://', '')}</a>.</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, photographies, logos et la mise en page de ce site appartiennent à {E.nomCommercial} ou sont utilisés avec
        l’autorisation de leurs auteurs. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>Le traitement de vos données est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>.</p>

      <h2>Conditions de vente</h2>
      <p>Les ventes réalisées sur ce site sont soumises à nos <Link href="/cgv">conditions générales de vente</Link>.</p>
    </LegalPage>
  );
}
