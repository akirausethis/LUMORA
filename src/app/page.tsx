// src/app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import AboutUs from "@/components/AboutUs";
import CategoryList from "@/components/CategoryList";
import LandingHighlightSection from "@/components/LandingHighlightSection";
import LandingPage from "@/components/LandingPage";
import PopularServiceList from "@/components/PopularServiceList";
import Slider from "@/components/Slider";
import WhyUs from "@/components/WhyUs";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const HomePage = () => {
  // ... (logika auth tetap sama) ...
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try { JSON.parse(storedUser); setIsAuthenticated(true); } 
      catch (e) { localStorage.removeItem('currentUser'); setIsAuthenticated(false); }
    } else { setIsAuthenticated(false); }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.replace('/register'); }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) { /* ... (loading UI) ... */ 
    return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div> <p className="ml-3 text-gray-700">Memeriksa sesi...</p> </div> );
  }
  if (!isAuthenticated) { /* ... (redirecting UI) ... */ 
    return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"> <p className="text-gray-700">Mengarahkan ke halaman registrasi...</p> </div> );
  }

  return (
    <div className="selection:bg-emerald-500 selection:text-white">
      <LandingPage /> 
      
      {/* PERBAIKAN: Pastikan tidak ada margin atas negatif pada Slider atau pembungkusnya. */}
      {/* Efek gelombang dari LandingPage akan transisi ke background section ini */}
      <div className="bg-slate-50/70"> {/* Background untuk area Slider */}
        <Slider /> {/* Slider mungkin sudah punya padding internal atau kita bisa tambahkan di sini */}
      </div>
      
      <div className="py-10 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <LandingHighlightSection />
      </div>
      
      <div className="bg-white py-10 md:py-16">
         <AboutUs />
      </div>

      <div className="py-10 md:py-16 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 bg-gradient-to-b from-emerald-50 to-teal-50">
        <WhyUs />
      </div>

    </div>
  );
};

export default HomePage;