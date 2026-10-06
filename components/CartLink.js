'use client';
import Link from 'next/link';
import { useCart } from '../lib/cart';

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/panier" className="cartlink" aria-label={`Panier, ${ready ? count : 0} article${count > 1 ? 's' : ''}`}>
      Panier{ready && count > 0 && <span className="badge">{count}</span>}
    </Link>
  );
}
