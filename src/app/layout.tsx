import type { Metadata } from 'next';
import './globals.css';
import { ArcasProvider } from '@/contexts/pockets-context';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Mensarii',
  description: 'Manage your savings arcas with ease.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <link rel="apple-touch-icon" href="/icon.svg" />
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
          <ArcasProvider>
            <div className="flex flex-col min-h-screen">
              {children}
              <footer className="text-center p-4 text-muted-foreground text-sm mt-auto">
                <p>Ing. Maglione &copy; 2025</p>
              </footer>
            </div>
          </ArcasProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
