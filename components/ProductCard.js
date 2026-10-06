import Link from 'next/link';
import Price, { hasDiscount, discountPct } from './Price';
import { firstImage, allImages } from '../lib/format';

export default function ProductCard({ p }) {
  const href = `/produits/${p.slug}`;
  const imgs = allImages(p);
  return (
    <article className="card">
      <Link href={href} className="card-link" aria-label={`Voir ${p.name}`}>
        <span className="card-photo">
          <img src={firstImage(p)} alt={p.name} className="card-img" loading="lazy" />
          {imgs[1] && <img src={imgs[1]} alt="" className="card-img alt" loading="lazy" aria-hidden="true" />}
        </span>
        {hasDiscount(p) && <span className="ribbon">−{discountPct(p)} %</span>}
        {!p.in_stock && <span className="ribbon out">Indisponible</span>}
      </Link>
      <div className="card-body">
        <h3><Link href={href}>{p.name}</Link></h3>
        <p className="card-meta">{p.sizes?.length ? `${p.sizes[0]} au ${p.sizes[p.sizes.length - 1]}` : ''}{p.colors?.length > 1 ? ` · ${p.colors.length} coloris` : ''}</p>
        <Price p={p} />
      </div>
    </article>
  );
}
