import { aCompleter } from '../lib/entreprise';

// Affiche une information légale ; si elle n'est pas encore remplie, elle apparaît surlignée.
export default function Fill({ v }) {
  return aCompleter(v) ? <mark className="todo">{v}</mark> : <>{v}</>;
}
