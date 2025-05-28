// src/components/AppLayout.tsx
"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();

  // Daftar rute di mana Navbar dan Footer tidak akan ditampilkan
  // Tambahkan '/setprofile' ke daftar ini
  const noNavFooterBasePaths = ['/login', '/register', '/setprofile'];

  // Cek apakah rute saat ini dimulai dengan salah satu path di noNavFooterBasePaths
  const shouldHideNavFooter = noNavFooterBasePaths.some(basePath => pathname.startsWith(basePath));

  if (shouldHideNavFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;