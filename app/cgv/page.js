import Link from 'next/link';
import LegalPage from '../../components/LegalPage';
import Fill from '../../components/Fill';
import Mail from '../../components/Mail';
import { ENTREPRISE as E, MEDIATEUR as M, LIVRAISON as L, RETOURS as R, rempli } from '../../lib/entreprise';

export const metadata = { title: 'Conditions générales de vente — Maxi Market', alternates: { canonical: '/cgv' } };

export default function CGV() {
  return (
    <LegalPage title="Conditions générales de vente">
      <h2>1. Vendeur</h2>
      <p>
        Les présentes conditions s’appliquent aux ventes conclues sur le site {E.site} entre <Fill v={E.raisonSociale} /> (
        <Fill v={E.forme} />, siège : <Fill v={E.adresse} />, SIRET <Fill v={E.siret} />, <Fill v={E.tva} />), ci-après « {E.nomCommercial} »,
        et toute personne physique qui achète pour ses besoins personnels, ci-après « le client ». Contact : <Mail />{rempli(E.telephone) && <>, {E.telephone}</>}.
      </p>
      <p>Le client déclare avoir lu et accepté ces conditions avant de passer commande. La version applicable est celle en ligne au jour de la commande.</p>

      <h2>2. Produits</h2>
      <p>
        {E.nomCommercial} vend des ensembles de prêt-à-porter (haut et bas assortis). Chaque fiche produit précise la composition, les
        tailles et les coloris disponibles, ainsi que les conseils d’entretien. Les photographies et les coloris affichés à l’écran sont aussi fidèles
        que possible mais restent non contractuels. Les produits sont proposés dans la limite des stocks disponibles.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises, livraison incluse en {L.zone}. {E.nomCommercial} peut modifier ses prix à tout
        moment ; le prix facturé est celui affiché au moment de la commande.
      </p>

      <h2>4. Commande</h2>
      <p>
        Le client ajoute les produits à son panier, renseigne ses coordonnées et son adresse de livraison, accepte les présentes conditions puis
        valide en cliquant sur « Passer commande », ce qui l’engage à payer la commande une fois celle-ci confirmée. Un numéro de commande s’affiche et un récapitulatif est envoyé par e-mail.
      </p>
      <p>
        {E.nomCommercial} contacte le client sous 24 heures ouvrées pour confirmer la commande et organiser le paiement. La vente est conclue à
        l’envoi de cette confirmation. Sans paiement sous 7 jours après la confirmation, la commande peut être annulée sans frais pour le client.
        {E.nomCommercial} peut refuser une commande en cas de litige antérieur avec le client ou d’adresse de livraison hors zone.
      </p>

      <h2>5. Paiement</h2>
      <p>
        Le paiement s’effectue en totalité, selon les moyens proposés lors de la confirmation (carte bancaire par lien de paiement sécurisé ou
        virement bancaire). La commande n’est expédiée qu’après réception du paiement. Les données bancaires sont traitées par l’établissement de
        paiement et ne sont jamais conservées par {E.nomCommercial}.
      </p>

      <h2>6. Livraison</h2>
      <p>
        La livraison est gratuite en {L.zone}. La commande est expédiée sous {L.expedition} ouvrées après réception du paiement et livrée dans un
        délai maximum de {L.delai}, à l’adresse indiquée ou en point relais selon le mode proposé par le transporteur.
      </p>
      <p>
        Si la livraison n’est pas effectuée dans ce délai, le client peut, après avoir demandé à {E.nomCommercial} de livrer dans un délai
        supplémentaire raisonnable, résoudre la vente par écrit et obtenir le remboursement des sommes versées (articles L.216-1 et suivants du
        Code de la consommation). Le risque de perte ou d’endommagement est transféré au client lorsqu’il prend possession des articles.
      </p>
      <p>
        À la réception, le client vérifie le colis et note toute réserve précise sur le bon de livraison, puis prévient {E.nomCommercial} sous
        3 jours, photos à l’appui. Ces démarches facilitent le traitement mais ne privent pas le client de ses garanties légales.
      </p>

      <h2 id="retractation">7. Droit de rétractation</h2>
      <p>
        Le client dispose d’un délai de {R.delai} jours à compter de la réception de sa commande pour se rétracter, sans avoir à motiver sa
        décision ni à payer de pénalité. Il informe {E.nomCommercial} de sa décision par une déclaration dénuée d’ambiguïté, par e-mail à{' '}
        <Mail /> ou par courrier, éventuellement à l’aide du formulaire ci-dessous.
      </p>
      <p>
        Le client renvoie l’ensemble complet, non porté, non lavé et avec ses étiquettes, au plus tard 14 jours après avoir communiqué sa
        décision. <strong>Les frais de retour sont à la charge du client</strong>. {rempli(R.coutRetour) ? <>Ces frais sont estimés à : {R.coutRetour}. </> : null}La responsabilité du client peut être engagée en cas de dépréciation du produit
        résultant de manipulations autres que celles nécessaires pour en vérifier la nature, les caractéristiques et le bon fonctionnement (l’essayage est permis, comme en boutique).
      </p>
      <p>
        {E.nomCommercial} rembourse la totalité des sommes versées, frais de livraison initiaux compris, au plus tard 14 jours après avoir été
        informé de la décision, avec le même moyen de paiement que celui utilisé, sauf accord du client pour un autre moyen. Le remboursement
        peut être différé jusqu’à la récupération des articles ou jusqu’à la preuve de son expédition.
      </p>
      <div className="formbox">
        <p><strong>Formulaire de rétractation</strong> (à compléter et renvoyer uniquement si vous souhaitez vous rétracter)</p>
        <p>
          À l’attention de <Fill v={E.raisonSociale} />, <Fill v={E.adresse} />, <Fill v={E.email} /> :<br />
          Je vous notifie par la présente ma rétractation du contrat portant sur la vente des biens ci-dessous :<br />
          Numéro de commande : … · Commandé le : … · Reçu le : …<br />
          Nom du client : … · Adresse du client : …<br />
          Signature du client (en cas d’envoi papier) : … · Date : …
        </p>
      </div>

      <h2>8. Garanties légales</h2>
      <p>
        Les produits bénéficient de la garantie légale de conformité (articles L.217-3 et suivants du Code de la consommation) et de la garantie
        des vices cachés (articles 1641 à 1649 du Code civil).
      </p>
      <div className="formbox">
        <p>
          Le consommateur dispose d’un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de
          conformité en cas d’apparition d’un défaut de conformité. Durant ce délai, le consommateur n’est tenu d’établir que l’existence du défaut
          de conformité et non la date d’apparition de celui-ci.
        </p>
        <p>
          La garantie légale de conformité emporte le droit à la réparation ou au remplacement du bien dans un délai de trente jours suivant la
          demande du consommateur, sans frais ni inconvénient majeur pour lui.
        </p>
        <p>
          Le consommateur peut obtenir une réduction du prix d’achat en conservant le bien ou mettre fin au contrat en se faisant rembourser
          intégralement contre restitution du bien, si : 1° le professionnel refuse de réparer ou de remplacer le bien ; 2° la réparation ou le
          remplacement du bien intervient après un délai de trente jours ; 3° la réparation ou le remplacement du bien occasionne un inconvénient
          majeur pour le consommateur, notamment lorsque le consommateur supporte définitivement les frais de reprise ou d’enlèvement du bien non
          conforme, ou s’il supporte les frais d’installation du bien réparé ou de remplacement ; 4° la non-conformité du bien persiste en dépit de
          la tentative de mise en conformité du vendeur restée infructueuse.
        </p>
        <p>
          Le consommateur a également droit à une réduction du prix du bien ou à la résolution du contrat lorsque le défaut de conformité est si
          grave qu’il justifie que la réduction du prix ou la résolution du contrat soit immédiate. Le consommateur n’est alors pas tenu de demander
          la réparation ou le remplacement du bien au préalable. Le consommateur n’a pas droit à la résolution de la vente si le défaut de
          conformité est mineur.
        </p>
        <p>
          Les droits mentionnés ci-dessus résultent de l’application des articles L.217-1 à L.217-32 du Code de la consommation. Le vendeur qui
          fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt une amende civile d’un montant maximal de
          300 000 euros, qui peut être porté jusqu’à 10 % du chiffre d’affaires moyen annuel (article L.241-5 du Code de la consommation).
        </p>
        <p>
          Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles 1641 à 1649 du Code civil,
          pendant une durée de deux ans à compter de la découverte du défaut. Cette garantie donne droit à une réduction de prix si le bien est
          conservé ou à un remboursement intégral contre restitution du bien.
        </p>
      </div>
      <p>Pour mettre en œuvre une garantie, le client écrit à <Mail /> avec son numéro de commande et des photos.</p>

      <h2>9. Service client et réclamations</h2>
      <p>
        Pour toute question ou réclamation : <Mail />{rempli(E.telephone) && <> · {E.telephone}</>}, {E.horaires}. Voir aussi la
        page <Link href="/livraison-retours">Livraison et retours</Link>.
      </p>

      {rempli(M.nom) && (<>
      <h2>10. Médiation</h2>
      <p>
        En cas de litige non résolu après une réclamation écrite auprès de {E.nomCommercial}, le client peut recourir gratuitement au médiateur de
        la consommation suivant : <Fill v={M.nom} />, <Fill v={M.adresse} />, <Fill v={M.site} />. Le client reste libre de saisir les tribunaux.
      </p>
      </>)}

      <h2>11. Données personnelles</h2>
      <p>Les données recueillies lors de la commande sont traitées conformément à notre <Link href="/confidentialite">politique de confidentialité</Link>.</p>

      <h2>12. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. À défaut d’accord amiable, le litige est porté devant la juridiction compétente
        selon les règles de droit commun ; le client peut notamment saisir la juridiction du lieu où il demeurait lors de la conclusion du contrat
        ou de la survenance du fait dommageable.
      </p>
    </LegalPage>
  );
}
