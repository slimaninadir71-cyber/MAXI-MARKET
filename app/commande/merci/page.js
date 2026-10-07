import Merci from './Merci';

export const metadata = { title: 'Votre commande — Maxi Market', robots: { index: false } };

export default function Page({ searchParams }) {
  return <Merci reference={String(searchParams?.ref || '')} token={String(searchParams?.t || '')} />;
}
