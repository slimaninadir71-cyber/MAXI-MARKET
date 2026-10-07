import { NextResponse } from 'next/server';
import { adminDb, syncPayment } from '../../../../lib/serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Page « merci » : état de la commande, protégé par le jeton secret reçu dans le lien de retour.
export async function GET(req) {
  const u = new URL(req.url);
  const ref = (u.searchParams.get('ref') || '').slice(0, 20);
  const t = (u.searchParams.get('t') || '').slice(0, 40);
  if (!ref || !/^[0-9a-f-]{36}$/i.test(t)) return NextResponse.json({ error: 'Lien invalide.' }, { status: 400 });
  try {
    const db = adminDb();
    const { data: o } = await db.from('orders').select('reference,status,payment_status,total_price,email,mollie_payment_id').eq('reference', ref).eq('token', t).maybeSingle();
    if (!o) return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    let paid = o.status === 'payée';
    let status = o.payment_status;
    // Si la notification de Mollie n'est pas encore arrivée, on vérifie directement.
    if (!paid && o.mollie_payment_id) { status = (await syncPayment(o.mollie_payment_id)).status; paid = status === 'paid'; }
    return NextResponse.json({ reference: o.reference, paid, status, total: Number(o.total_price), email: o.email });
  } catch (e) {
    console.error('Statut :', e.message);
    return NextResponse.json({ error: 'Vérification impossible pour le moment.' }, { status: 500 });
  }
}
