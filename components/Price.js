import { eur } from '../lib/format';

export const hasDiscount = (p) => p.compare_at_price && Number(p.compare_at_price) > Number(p.price);

export const discountPct = (p) =>
  hasDiscount(p) ? Math.round((1 - Number(p.price) / Number(p.compare_at_price)) * 100) : 0;

export default function Price({ p, large = false }) {
  const promo = hasDiscount(p);
  return (
    <span className={`pricebox${large ? ' lg' : ''}`}>
      <strong className={large ? 'pdp-price' : 'price'}>{eur(p.price)}</strong>
      {promo && (
        <>
          <s className="was" aria-label={`Prix avant remise : ${eur(p.compare_at_price)}`}>{eur(p.compare_at_price)}</s>
          <span className="off">−{discountPct(p)} %</span>
        </>
      )}
    </span>
  );
}
