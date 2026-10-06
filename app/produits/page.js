import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/supabase';

export const revalidate = 60;
export const metadata = {
  title: 'Les ensembles — Maxi Market',
  description: 'Tous nos ensembles assortis, du S au XXL. Livraison offerte en France métropolitaine, retours sous 14 jours.',
  alternates: { canonical: '/produits' },
};

export default async function Produits() {
  const products = await getProducts();
  return (
    <section className="block"><div className="wrap">
      <h1 className="pagetitle">Les ensembles</h1>
      <p className="muted lead-sm">Haut et bas assortis. Livraison offerte, retours sous 14 jours.</p>
      {products.length === 0 ? <p className="muted">Les ensembles arrivent très bientôt.</p> : (
        <div className="grid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div></section>
  );
}
