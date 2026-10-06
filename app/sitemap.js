import { getProducts } from '../lib/supabase';
import { SITE_URL } from '../lib/format';

export const revalidate = 3600;

export default async function sitemap() {
  const products = await getProducts();
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/produits`, changeFrequency: 'weekly', priority: 0.9 },
    ...['/guide-des-tailles', '/livraison-retours', '/contact', '/cgv', '/mentions-legales', '/confidentialite'].map((u) => ({ url: `${SITE_URL}${u}`, changeFrequency: 'yearly', priority: 0.3 })),
    ...products.map((p) => ({ url: `${SITE_URL}/produits/${p.slug}`, changeFrequency: 'weekly', priority: 0.8 })),
  ];
}
