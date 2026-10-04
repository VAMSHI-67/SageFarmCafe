import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://sagefarmcafe.in'),
  title: 'Sage Farm Cafe | Artisanal Organic Dining & Living Space Hyderabad',
  description: 'Farm-to-fork dining, 48-hour slow fermented sourdoughs, botanical elixirs, and serene courtyard ambience in Banjara Hills / Jubilee Hills, Hyderabad.',
  openGraph: {
    title: 'Sage Farm Cafe | Hyderabad Organic Dining & Living Space',
    description: 'Explore our artisan sourdoughs, organic harvest bowls, single-origin coffees, and lush courtyard gallery in Hyderabad.',
    url: 'https://sagefarmcafe.in',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sage Farm Cafe | Hyderabad',
    description: 'Artisanal organic dining and living space in Banjara Hills, Hyderabad.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-sage-50 text-sage-800 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
