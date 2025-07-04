import type { Metadata } from 'next';
import './globals.css';
import { PocketsProvider } from '@/contexts/pockets-context';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#007BFF" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PocketsProvider>
            <div className="flex flex-col min-h-screen">
              {children}
              <footer className="text-center p-4 text-muted-foreground text-sm mt-auto">
                <p>Ing. Maglione &copy; 2025</p>
              </footer>
            </div>
          </PocketsProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
