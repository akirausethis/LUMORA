// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; //
// Hapus import Navbar dan Footer dari sini jika sudah di AppLayout
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper'; // Wrapper untuk AOS
import ToastProvider from '@/components/ToastProvider'; //
import AppLayout from '@/components/AppLayout'; // Import AppLayout yang baru

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LUMORA',
  description: 'A complete e-commerce application with Next.js and Wix',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper> {/* ClientWrapper untuk AOS bisa membungkus AppLayout */}
          <AppLayout>  {/* Gunakan AppLayout di sini */}
            {children}
          </AppLayout>
        </ClientWrapper>
        <ToastProvider /> {/* ToastProvider tetap di luar AppLayout jika cakupannya global */}
      </body>
    </html>
  );
}