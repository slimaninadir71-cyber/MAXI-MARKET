'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/cart';

// Choix de la taille et de la couleur, puis ajout au panier.
export default function Buy({ product }) {
  const { add, MAX_QTY } = useCart();
  const colors = product.colors || [];
  const [size, setSize] = useState('');
  const [color, setColor] = useState(colors.length === 1 ? colors[0] : '');
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  function onAdd() {
    if (colors.length > 1 && !color) { setMsg('Choisissez une couleur.'); return; }
    if (!size) { setMsg('Choisissez une taille.'); return; }
    add(product.slug, size, color, qty);
    setMsg(''); setDone(true);
    setTimeout(() => setDone(false), 6000);
  }

  if (!product.in_stock) return <p className="soldout">Cet ensemble est momentanément indisponible.</p>;

  return (
    <div className="buy">
      {colors.length > 0 && (
        <fieldset className="opt">
          <legend>Couleur{color ? <span> : {color}</span> : null}</legend>
          <div className="chips">
            {colors.map((c) => (
              <button key={c} type="button" className={`chip${color === c ? ' on' : ''}`} aria-pressed={color === c}
                onClick={() => { setColor(c); setMsg(''); }}>{c}</button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset className="opt">
        <legend>Taille{size ? <span> : {size}</span> : null} <Link href="/guide-des-tailles" className="sizelink">Guide des tailles</Link></legend>
        <div className="chips">
          {product.sizes.map((s) => (
            <button key={s} type="button" className={`chip sz${size === s ? ' on' : ''}`} aria-pressed={size === s}
              onClick={() => { setSize(s); setMsg(''); }}>{s}</button>
          ))}
        </div>
      </fieldset>
      <div className="buyrow">
        <label className="qty">Quantité
          <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button type="button" className="btn btn-block" onClick={onAdd}>Ajouter au panier</button>
      </div>
      <p className={`buymsg${msg ? ' err' : ''}`} role="status" aria-live="polite">
        {msg || (done && (<>Ajouté. <Link href="/panier"><strong>Voir le panier et commander</strong></Link></>))}
      </p>
    </div>
  );
}
