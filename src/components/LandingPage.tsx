// src/components/LandingPage.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon, CheckCircleIcon, UsersIcon as CommunityIcon, BriefcaseIcon as ProjectsIcon } from "lucide-react"; // Menggunakan ikon Lucide

const LandingPage = () => {
  const isAuthenticated = false; // Add state or logic to check user auth status

  return (
    <div data-aos="fade-in" className="min-h-screen flex flex-col justify-center bg-white text-gray-900 pt-20 pb-10 md:pt-28 md:pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-center">
          {/* Center Section - Text & CTA */}
          <div className="w-full text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 rounded-full text-emerald-700 text-xs sm:text-sm font-semibold mb-6 border border-emerald-100 ">
              <SparklesIcon className="w-4 h-4 mr-2 text-emerald-500" />
              Platform Freelance Kreatif
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-gray-900 ">
              Kembangkan <span className="text-emerald-600 ">Karya</span> Anda.
            </h1>
            <p className="text-md sm:text-lg text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto">
              Eksplorasi ekosistem bagi kreator profesional. Berkolaborasi, temukan klien, dan bangun reputasi Anda di industri kreatif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Link
                href={isAuthenticated ? "/explore" : "/register"}
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-lg text-base sm:text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3"
              >
                {isAuthenticated ? "Masuk Dashboard" : "Mulai Perjalanan"}
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/explore"
                className="bg-white text-gray-700 px-8 py-3.5 rounded-lg text-base sm:text-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Lihat Katalog
              </Link>
            </div>

            {/* Logos */}
            <div className="mt-10 lg:mt-12 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-3 text-center font-medium">
                Mendukung tools desain populer:
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-3 items-center justify-center opacity-70 ">
                <Image src="/photoshop.png" alt="Photoshop" width={40} height={40} title="Photoshop" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/illustrator.png" alt="Illustrator" width={40} height={40} title="Illustrator" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/figma.png" alt="Figma" width={30} height={30} title="Figma" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/canva.png" alt="Canva" width={40} height={40} title="Canva" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
                <Image src="/aftereffects.png" alt="AE" width={40} height={40} title="After Effects" className="filter grayscale hover:grayscale-0 contrast-200 hover:contrast-100 transition-all duration-300"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;