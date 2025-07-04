import type { Metadata } from 'next';
import './globals.css';
import { PocketsProvider } from '@/contexts/pockets-context';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'PocketBalance',
  description: 'Manage your savings pockets with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <PocketsProvider>
          {children}
        </PocketsProvider>
        <Toaster />
      </body>
    </html>
  );
}
