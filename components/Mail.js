import { ENTREPRISE as E, rempli } from '../lib/entreprise';
import Fill from './Fill';

// Adresse e-mail cliquable, ou surlignée « À COMPLÉTER » tant qu'elle n'est pas renseignée.
export default function Mail() {
  return rempli(E.email) ? <a href={`mailto:${E.email}`}>{E.email}</a> : <Fill v={E.email} />;
}
