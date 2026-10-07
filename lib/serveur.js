// Outils réservés au serveur (jamais envoyés au navigateur) : base de données en mode administrateur et paiement Mollie.
import { createClient } from '@supabase/supabase-js';
import { sendOrderEmails } from './mail';

export function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_SECRET_KEY manquante dans Vercel');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Adresse réelle du site (avec ou sans www), pour que Mollie revienne au bon endroit.
export function siteOrigin(req) {
  const h = req.headers;
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maxi-market-fr.com');
}

async function mollie(path, init = {}) {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) throw new Error('MOLLIE_API_KEY manquante dans Vercel');
  const res = await fetch(`https://api.mollie.com/v2${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Mollie ${res.status} : ${data.detail || data.title || 'erreur'}`);
  return data;
}

// Crée un paiement Mollie pour une commande et renvoie l'adresse de la page de paiement.
export async function createPayment(order, origin) {
  const payment = await mollie('/payments', {
    method: 'POST',
    body: JSON.stringify({
      amount: { currency: 'EUR', value: Number(order.total_price).toFixed(2) },
      description: `Maxi Market - commande ${order.reference}`,
      redirectUrl: `${origin}/commande/merci?ref=${encodeURIComponent(order.reference)}&t=${order.token}`,
      cancelUrl: `${origin}/commande/merci?ref=${encodeURIComponent(order.reference)}&t=${order.token}`,
      webhookUrl: `${origin}/api/mollie/webhook`,
      locale: 'fr_FR',
      metadata: { reference: order.reference },
    }),
  });
  await adminDb().from('orders').update({ mollie_payment_id: payment.id, payment_status: payment.status }).eq('id', order.id);
  return payment._links?.checkout?.href;
}

// Lit l'état d'un paiement chez Mollie et met la commande à jour. Envoie les e-mails une seule fois, au paiement.
export async function syncPayment(paymentId) {
  const payment = await mollie(`/payments/${encodeURIComponent(paymentId)}`);
  const db = adminDb();
  const { data: order } = await db.from('orders').select('*').eq('mollie_payment_id', payment.id).maybeSingle();
  if (!order) return { status: payment.status };

  if (payment.status === 'paid') {
    // Mise à jour conditionnelle : si deux notifications arrivent en même temps, une seule passe.
    const { data: updated } = await db.from('orders')
      .update({ status: 'payée', payment_status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', order.id).neq('status', 'payée').select('*');
    if (updated && updated.length) {
      const o = updated[0];
      const lines = (o.items || []).map((l) => ({ name: l.name, size: l.size, color: l.color, quantity: l.quantity, price: Number(l.unit_price) }));
      await sendOrderEmails({
        reference: o.reference,
        customer: { full_name: o.full_name, phone: o.phone, email: o.email, address: o.address, postal_code: o.postal_code, city: o.city, notes: o.notes },
        lines,
        total: Number(o.total_price),
      }).catch((e) => console.error('Mail :', e?.message));
    }
    return { status: 'paid' };
  }

  if (order.status !== 'payée' && order.payment_status !== payment.status) {
    await db.from('orders').update({ payment_status: payment.status }).eq('id', order.id);
  }
  return { status: payment.status };
}
