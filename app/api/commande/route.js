import { NextResponse } from 'next/server';
import { adminDb, createPayment, siteOrigin } from '../../../lib/serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const text = (v, max) => String(v ?? '').trim().slice(0, max);
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return bad('Requête invalide.'); }

  if (body.website) return bad('Requête invalide.'); // anti-spam : champ piège rempli

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

  let db;
  try { db = adminDb(); } catch (e) { console.error(e.message); return bad('Le paiement n’est pas encore configuré. Réessayez plus tard.', 500); }

  // La base recalcule elle-même les prix et le total : le navigateur ne peut pas les modifier.
  const { data: reference, error } = await db.rpc('create_order', {
    p_full_name: customer.full_name, p_phone: customer.phone, p_email: customer.email, p_address: customer.address,
    p_postal_code: customer.postal_code, p_city: customer.city, p_notes: customer.notes, p_items: items,
  });
  if (error || !reference) {
    console.error('create_order :', error?.message);
    return bad('Impossible d’enregistrer la commande. Vérifiez votre panier et réessayez.', 500);
  }

  const { data: order } = await db.from('orders').select('id,reference,token,total_price').eq('reference', reference).single();
  try {
    const checkoutUrl = await createPayment(order, siteOrigin(req));
    if (!checkoutUrl) throw new Error('Pas de lien de paiement');
    return NextResponse.json({ ok: true, reference, checkoutUrl });
  } catch (e) {
    console.error('Paiement :', e.message);
    return bad('Le paiement est momentanément indisponible. Réessayez dans un instant.', 502);
  }
}
