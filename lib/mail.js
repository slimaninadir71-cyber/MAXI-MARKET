const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(n));

async function send({ to, subject, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Maxi Market <onboarding@resend.dev>',
      to: [to], subject, html, reply_to: replyTo || undefined,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return { sent: true };
}

function table(lines) {
  return `<table style="border-collapse:collapse;width:100%">${lines.map((l) =>
    `<tr><td style="padding:6px 0;border-bottom:1px solid #e3e5e1">${esc(l.quantity)} × ${esc(l.name)}<br><small style="color:#667">${esc([l.size && 'Taille ' + l.size, l.color].filter(Boolean).join(' · '))}</small></td><td style="padding:6px 0;border-bottom:1px solid #e3e5e1;text-align:right">${eur(l.price * l.quantity)}</td></tr>`).join('')}</table>`;
}

export async function sendOrderEmails({ reference, customer, lines, total }) {
  const contact = process.env.CONTACT_EMAIL;
  const recap = table(lines);
  const results = [];

  if (contact) {
    const html = `<div style="font-family:Arial,sans-serif;color:#15181D;max-width:560px">
      <h2 style="color:#15181D">Commande payée ${esc(reference)} : à expédier</h2>
      <p style="background:#e8f3ec;padding:8px 12px">Paiement confirmé par Mollie.</p>
      ${recap}<p style="font-size:18px"><strong>Total : ${eur(total)}</strong> (livraison gratuite)</p>
      <h3 style="color:#15181D">Client</h3>
      <p>${esc(customer.full_name)}<br>Tél. : <a href="tel:${esc(customer.phone)}">${esc(customer.phone)}</a><br>E-mail : <a href="mailto:${esc(customer.email)}">${esc(customer.email)}</a></p>
      <p>${esc(customer.address)}<br>${esc(customer.postal_code)} ${esc(customer.city)}</p>
      ${customer.notes ? `<p><em>Précisions : ${esc(customer.notes)}</em></p>` : ''}
      <p style="font-size:13px;color:#555">Suivi : table « orders » dans Supabase (statut, numéro de suivi) et tableau de bord Mollie (paiement, remboursement).</p>
    </div>`;
    results.push(send({ to: contact, subject: `Commande payée ${reference} — ${eur(total)}`, html, replyTo: customer.email }));
  }

  const html = `<div style="font-family:Arial,sans-serif;color:#15181D;max-width:560px">
    <h2 style="color:#15181D">Merci ${esc(customer.full_name)}, votre commande est confirmée</h2>
    <p>Numéro de commande : <strong>${esc(reference)}</strong></p>
    ${recap}<p style="font-size:18px"><strong>Total : ${eur(total)}</strong> (livraison gratuite)</p>
    <p>Livraison à : ${esc(customer.address)}, ${esc(customer.postal_code)} ${esc(customer.city)}.</p>
    <p>Votre paiement a bien été reçu. Nous préparons votre colis et vous prévenons dès son expédition.</p>
    <p style="font-size:13px;color:#555">Vous disposez d’un droit de rétractation de 14 jours à compter de la réception. Nos conditions générales de vente, acceptées lors de la commande, sont consultables à tout moment : <a href="https://maxi-market-fr.com/cgv">maxi-market-fr.com/cgv</a>.</p>
    <p>— L’équipe Maxi Market${contact ? `<br>Une question ? Répondez à cet e-mail ou écrivez à ${esc(contact)}.` : ''}</p>
  </div>`;
  results.push(send({ to: customer.email, subject: `Commande confirmée ${reference} — Maxi Market`, html, replyTo: contact }));

  const out = await Promise.allSettled(results);
  out.forEach((r) => { if (r.status === 'rejected') console.error('Envoi e-mail impossible :', r.reason?.message); });
}
