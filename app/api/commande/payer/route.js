import { NextResponse } from 'next/server';
import { adminDb, createPayment, siteOrigin } from '../../../../lib/serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Nouvelle tentative de paiement pour une commande non payée (paiement annulé, refusé ou expiré).
export async function POST(req) {
  let b = {};
  try { b = await req.json(); } catch {}
  const ref = String(b.ref || '').slice(0, 20), t = String(b.t || '').slice(0, 40);
  if (!ref || !/^[0-9a-f-]{36}$/i.test(t)) return NextResponse.json({ error: 'Lien invalide.' }, { status: 400 });
  try {
    const db = adminDb();
    const { data: o } = await db.from('orders').select('id,reference,token,total_price,status').eq('reference', ref).eq('token', t).maybeSingle();
    if (!o) return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    if (o.status === 'payée') return NextResponse.json({ paid: true });
    const checkoutUrl = await createPayment(o, siteOrigin(req));
    return NextResponse.json({ checkoutUrl });
  } catch (e) {
    console.error('Relance paiement :', e.message);
    return NextResponse.json({ error: 'Le paiement est momentanément indisponible.' }, { status: 502 });
  }
}
