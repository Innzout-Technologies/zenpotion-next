// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZenPotion — Clean Hydration for Everyday Energy',
  description:
    'A refreshing natural beverage crafted for modern lifestyles in India. Coconut water, lemon, mint, and Tulsi — nothing more.',
  keywords: ['natural drink', 'hydration', 'India', 'coconut water', 'healthy beverage', 'Ayurvedic'],
  openGraph: {
    title: 'ZenPotion — Clean Hydration for Everyday Energy',
    description: 'A refreshing blend crafted for modern lifestyles in India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
