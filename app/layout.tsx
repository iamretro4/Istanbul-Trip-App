import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './providers';

export const metadata: Metadata = {
  title: 'Istanbul Trip Planner',
  description: 'Plan your perfect trip to Istanbul with interactive maps, route planning, and local suggestions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

