import { NextResponse } from 'next/server';
import { syncPayment } from '../../../../lib/serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mollie appelle cette adresse à chaque changement d'état d'un paiement (envoie seulement son identifiant).
// On ne fait jamais confiance au contenu reçu : on redemande l'état officiel à Mollie.
export async function POST(req) {
  let id = '';
  try { id = String((await req.formData()).get('id') || ''); } catch {}
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return new NextResponse('ok', { status: 200 });
  try { await syncPayment(id); }
  catch (e) { console.error('Webhook Mollie :', e.message); return new NextResponse('erreur', { status: 500 }); }
  return new NextResponse('ok', { status: 200 });
}
