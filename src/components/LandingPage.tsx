// src/components/LandingPage.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, CheckCircleIcon, UsersIcon as CommunityIcon, BriefcaseIcon as ProjectsIcon } from "lucide-react"; // Menggunakan ikon Lucide

const LandingPage = () => {
  return (
    <div data-aos="fade-in" className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-600 text-white pt-20 pb-10 md:pt-28 md:pb-16 selection:bg-white selection:text-emerald-600">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Left Section - Text & CTA */}
          <div className="lg:w-1/2 w-full text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-emerald-50 text-xs sm:text-sm font-medium mb-5 border border-white/20 shadow-sm">
              <SparklesIcon className="w-4 h-4 mr-2 text-yellow-300" />
              Platform Freelance Kreatif Unggulan
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-shadow-md">
              Temukan <span className="text-yellow-300 decoration-yellow-400">Bakat Desain</span>, Wujudkan <span className="text-yellow-300 decoration-yellow-400">Visimu</span>.
            </h1>
            <p className="text-md sm:text-lg text-emerald-100 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Lumora adalah ekosistem bagi para desainer, ilustrator, dan kreator untuk berkolaborasi dalam proyek-proyek inovatif. Publikasikan portofoliomu, dapatkan klien, dan bangun reputasi profesionalmu di sini!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register"
                className="bg-white text-emerald-600 px-7 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Mulai Sekarang <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link href="/explore"
                className="bg-transparent text-white px-7 py-3 rounded-lg text-base sm:text-lg font-semibold border-2 border-emerald-200 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Lihat Layanan
              </Link>
            </div>

            {/* Logos */}
            <div className="mt-10 lg:mt-12">
              <p className="text-sm text-emerald-200 mb-3 text-center lg:text-left">
                Mendukung tools desain populer:
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-3 items-center justify-center lg:justify-start opacity-80">
                <Image src="/photoshop.png" alt="Photoshop" width={40} height={40} title="Photoshop" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/illustrator.png" alt="Illustrator" width={40} height={40} title="Illustrator" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/figma.png" alt="Figma" width={30} height={30} title="Figma" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/canva.png" alt="Canva" width={40} height={40} title="Canva" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/aftereffects.png" alt="AE" width={40} height={40} title="After Effects" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
              </div>
            </div>
          </div>

          {/* Right Section - Video/Image */}
          <div className="lg:w-1/2 w-full mt-10 lg:mt-0 flex justify-center items-center">
            <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[450px] md:h-[450px] group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/70 to-sky-500/70 rounded-full filter blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-teal-400/70 to-emerald-500/70 rounded-full filter blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animation-delay-2000 animate-pulse"></div>
              <video
                src="/lumora.mp4" // Pastikan path video benar dan ada di folder public
                width={450}
                height={450}
                className="relative z-10 rounded-2xl shadow-2xl max-w-full h-auto border-4 border-white/10 group-hover:scale-105 transition-transform duration-500 ease-out"
                autoPlay
                muted
                loop
                playsInline
                poster="/video-poster.jpg" // Tambahkan poster untuk tampilan awal video
              />
            </div>
          </div>
        </div>
      </div>
      {/* EFEK GELOMBANG DIHAPUS SESUAI PERMINTAAN */}
      {/* <div className="relative h-20 md:h-32 lg:h-40 -mt-1">
        <svg className="w-full h-full text-slate-50/70 fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C150,100 300,0 450,50 C600,100 750,0 900,50 C1050,100 1200,0 1350,50 C1500,100 1440,50 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div> 
      */}
    </div>
  );
};

export default LandingPage;