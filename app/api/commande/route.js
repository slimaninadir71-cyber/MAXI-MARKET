import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOrderEmails } from '../../../lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const text = (v, max) => String(v ?? '').trim().slice(0, max);
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return bad('Requête invalide.'); }

  if (body.website) return NextResponse.json({ ok: true, reference: '' }); // anti-spam : champ piège rempli

  const customer = {
    full_name: text(body.full_name, 120), phone: text(body.phone, 40), email: text(body.email, 160),
    address: text(body.address, 200), postal_code: text(body.postal_code, 12), city: text(body.city, 80),
    notes: text(body.notes, 1000),
  };
  if (!customer.full_name || !customer.phone || !customer.address || !customer.postal_code || !customer.city)
    return bad('Merci de remplir tous les champs obligatoires.');
  if (body.cgv !== 'oui') return bad('Merci d’accepter les conditions générales de vente.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) return bad('Adresse e-mail invalide.');

  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 30)
    .map((i) => ({ slug: text(i?.slug, 120), size: text(i?.size, 20), color: text(i?.color, 60), quantity: Math.min(Math.max(parseInt(i?.quantity, 10) || 1, 1), 20) }))
    .filter((i) => i.slug && i.size);
  if (items.length === 0) return bad('Votre panier est vide.');

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  const { data: products, error: pErr } = await supabase.from('products').select('slug,name,price').in('slug', items.map((i) => i.slug));
  if (pErr || !products?.length) return bad('Produits introuvables. Actualisez la page.');
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const lines = items.filter((i) => bySlug[i.slug]).map((i) => ({ ...i, name: bySlug[i.slug].name, price: Number(bySlug[i.slug].price) }));
  if (lines.length === 0) return bad('Produits introuvables. Actualisez la page.');

  const { data: reference, error } = await supabase.rpc('create_order', {
    p_full_name: customer.full_name, p_phone: customer.phone, p_email: customer.email, p_address: customer.address,
    p_postal_code: customer.postal_code, p_city: customer.city, p_notes: customer.notes,
    p_items: lines.map((l) => ({ slug: l.slug, size: l.size, color: l.color, quantity: l.quantity })),
  });
  if (error || !reference) {
    console.error('create_order :', error?.message);
    return bad('Impossible d’enregistrer la commande pour le moment. Réessayez dans un instant.', 500);
  }

  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  await sendOrderEmails({ reference, customer, lines, total }).catch((e) => console.error('Mail :', e?.message));

  return NextResponse.json({ ok: true, reference });
}
