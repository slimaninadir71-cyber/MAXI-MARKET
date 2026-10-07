import './globals.css';
import Link from 'next/link';
import { Instrument_Serif, Hanken_Grotesk } from 'next/font/google';
import { CartProvider } from '../lib/cart';
import CartLink from '../components/CartLink';
import { SITE_URL } from '../lib/format';
import { ENTREPRISE, LIVRAISON } from '../lib/entreprise';

const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--f-display' });
const body = Hanken_Grotesk({ subsets: ['latin'], variable: '--f-body' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Maxi Market — Ensembles assortis pour homme et femme',
  description: 'Des ensembles assortis, élégants et faciles à porter. Livraison offerte en France métropolitaine, retours sous 14 jours.',
  openGraph: { siteName: 'Maxi Market', locale: 'fr_FR', type: 'website', images: [{ url: '/accueil/hero-1920.jpg', width: 1920, height: 1081 }] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <div className="topbar"><span className="hide-sm">Livraison offerte en France · Retours sous 14 jours · Paiement sécurisé</span><span className="show-sm">Livraison offerte · Retours 14 jours</span></div>
          <header className="nav">
            <Link href="/" className="logo">Maxi Market</Link>
            <nav>
              <Link href="/produits">Les ensembles</Link>
              <Link href="/guide-des-tailles" className="hide-sm">Guide des tailles</Link>
              <Link href="/contact" className="hide-sm">Contact</Link>
              <CartLink />
            </nav>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <div>
              <p className="logo">Maxi Market</p>
              <p>Des ensembles assortis, pensés pour être portés tous les jours.</p>
            </div>
            <div>
              <p><strong>Boutique</strong></p>
              <p><Link href="/produits">Les ensembles</Link></p>
              <p><Link href="/guide-des-tailles">Guide des tailles</Link></p>
              <p><Link href="/panier">Mon panier</Link></p>
              <p><Link href="/livraison-retours">Livraison et retours</Link></p>
              <p><Link href="/contact">Contact</Link></p>
            </div>
            <div>
              <p><strong>Informations légales</strong></p>
              <p><Link href="/cgv">Conditions générales de vente</Link></p>
              <p><Link href="/mentions-legales">Mentions légales</Link></p>
              <p><Link href="/confidentialite">Confidentialité et cookies</Link></p>
            </div>
            <p className="legal">© 2026 Maxi Market · Expédition sous {LIVRAISON.expedition} en France métropolitaine</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
