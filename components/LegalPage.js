export default function LegalPage({ title, updated = '5 octobre 2026', children }) {
  return (
    <section className="block"><div className="wrap prose">
      <h1 className="pagetitle">{title}</h1>
      <p className="muted small">Dernière mise à jour : {updated}</p>
      {children}
    </div></section>
  );
}
