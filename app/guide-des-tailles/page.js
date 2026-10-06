import Link from 'next/link';
import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Guide des tailles — Maxi Market',
  description: 'Choisissez la bonne taille d’ensemble : mesurez-vous et retrouvez votre taille du XS au XXL.',
  alternates: { canonical: '/guide-des-tailles' },
};

// Mesures indicatives : à remplacer par le tableau réel du fournisseur avant le lancement.
const ROWS = [
  ['XS', '84 – 88', '66 – 70', '88 – 92'],
  ['S', '88 – 94', '70 – 76', '92 – 98'],
  ['M', '94 – 100', '76 – 82', '98 – 104'],
  ['L', '100 – 106', '82 – 88', '104 – 110'],
  ['XL', '106 – 112', '88 – 96', '110 – 116'],
  ['XXL', '112 – 120', '96 – 104', '116 – 122'],
];

export default function GuideTailles() {
  return (
    <LegalPage title="Guide des tailles" updated="5 octobre 2026">
      <p className="lead">Un ensemble se choisit en une seule taille, pour le haut comme pour le bas. Mesurez-vous, repérez votre ligne, et c’est réglé.</p>
      <div className="tablewrap">
        <table className="sizes">
          <thead><tr><th>Taille</th><th>Tour de poitrine (cm)</th><th>Tour de taille (cm)</th><th>Tour de hanches (cm)</th></tr></thead>
          <tbody>{ROWS.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody>
        </table>
      </div>
      <h2>Bien se mesurer</h2>
      <ul>
        <li><strong>Poitrine :</strong> à l’endroit le plus fort, mètre à plat sous les aisselles.</li>
        <li><strong>Taille :</strong> à l’endroit le plus fin du buste, sans serrer.</li>
        <li><strong>Hanches :</strong> à l’endroit le plus fort, pieds joints.</li>
      </ul>
      <h2>Entre deux tailles ?</h2>
      <p>Prenez la plus grande pour plus d’aisance. Et si l’ensemble ne vous va pas, vous avez 14 jours après réception pour nous le renvoyer : voir <Link href="/livraison-retours">Livraison et retours</Link>.</p>
      <p className="muted small">Mesures indicatives, pouvant varier légèrement selon la coupe de chaque ensemble.</p>
    </LegalPage>
  );
}
