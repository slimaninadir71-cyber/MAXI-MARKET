// Toutes les informations légales de Maxi Market sont ici, à un seul endroit.
// Chaque valeur qui commence par "À COMPLÉTER" s'affiche en surbrillance sur le site tant qu'elle n'est pas remplie.

export const ENTREPRISE = {
  nomCommercial: 'Maxi Market',
  raisonSociale: 'Maxi Market',
  forme: 'À COMPLÉTER : statut (micro-entreprise, EURL, SAS…) et capital social si société',
  adresse: 'À COMPLÉTER : adresse du siège',
  siret: 'À COMPLÉTER : numéro SIRET',
  rcs: 'À COMPLÉTER : RCS de la ville (ou « Dispensé d’immatriculation » pour une micro-entreprise non commerçante)',
  tva: 'À COMPLÉTER : n° de TVA intracommunautaire, ou « TVA non applicable, art. 293 B du CGI »',
  directeurPublication: 'À COMPLÉTER : prénom et nom du responsable du site',
  email: 'À COMPLÉTER : adresse e-mail de contact',
  telephone: 'À COMPLÉTER : numéro de téléphone',
  horaires: 'du lundi au vendredi, de 9 h à 18 h',
  site: 'maxi-market.com',
};

export const HEBERGEUR = {
  nom: 'Vercel Inc.',
  adresse: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  site: 'https://vercel.com',
};

export const MEDIATEUR = {
  nom: 'À COMPLÉTER : nom du médiateur de la consommation auquel vous adhérez',
  adresse: 'À COMPLÉTER : adresse postale du médiateur',
  site: 'À COMPLÉTER : site internet du médiateur',
};

// Délais à confirmer avec ton transporteur avant le lancement.
export const LIVRAISON = {
  expedition: '48 h',
  delai: '3 à 5 jours ouvrés',
  zone: 'France métropolitaine',
  transporteur: 'transporteur partenaire (livraison à domicile ou en point relais)',
};

export const RETOURS = {
  delai: 14,
  // Qui paie le retour d'un vêtement ? À décider (par défaut : le client).
  coutRetour: 'À COMPLÉTER : coût du retour à la charge du client, ex. « 4,90 € en point relais »',
};

export const aCompleter = (v) => typeof v === 'string' && v.startsWith('À COMPLÉTER');
export const rempli = (v) => Boolean(v) && !aCompleter(v);
