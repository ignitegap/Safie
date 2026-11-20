import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  metadataBase: new URL('https://safie-safety.vercel.app'),
  title: 'Safie · Preemptive Urban Safety Platform (Delhi-NCR)',
  description:
    'Safie re-engineers urban navigation for women and citizens in Delhi and Gurugram using GMDA CCMS smart streetlights, 10s dead man switch, duress PIN anti-coercion, and verified 24/7 safe havens.',
  keywords: [
    'Safie',
    'Safety App',
    'Delhi Safety',
    'Gurugram Safety',
    'Women Safety India',
    'Safe Route Navigation',
    'Dead Mans Switch',
    'Duress PIN',
    'Ask for Angela',
    'Neon Postgres',
  ],
  authors: [{ name: 'Safie Engineering Team' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Safie · Preemptive Urban Safety Platform',
    description:
      'Google Maps routes for speed. Safie routes for your peace of mind. Powered by GMDA CCMS smart streetlights and vetted 24/7 safe havens in Delhi-NCR.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FFF5F6] text-[#1C1917] antialiased min-h-screen selection:bg-[#E11D48] selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
