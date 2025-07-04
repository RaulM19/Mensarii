import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ArcasProvider } from '@/contexts/pockets-context';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

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
      </head>
      <body className={`${inter.className} antialiased`}>
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
