// src/components/Slider.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ZapIcon } from "lucide-react"; // Menggunakan ikon Lucide

const slides = [
  {
    id: 1,
    title: "Portofolio Digital, Kesan Profesional.",
    description: "Buat dan kelola portofolio online Anda dengan mudah untuk menarik klien potensial.",
    img: "/editor1.jpg", // Ganti dengan path gambar yang relevan
    url: "/portfolio", // Arahkan ke halaman portofolio atau tambah post
    bg: "bg-gradient-to-tr from-emerald-50 via-teal-50 to-sky-100",
    textColor: "text-gray-800",
    buttonColor: "bg-emerald-500 hover:bg-emerald-600",
    buttonTextColor: "text-white"
  },
  {
    id: 2,
    title: "Temukan Proyek Impianmu Berikutnya.",
    description: "Jelajahi ribuan peluang proyek freelance yang sesuai dengan keahlian dan minat Anda.",
    img: "/editor2.jpg",
    url: "/explore",
    bg: "bg-gradient-to-tr from-sky-50 via-blue-50 to-indigo-100",
    textColor: "text-gray-800",
    buttonColor: "bg-sky-500 hover:bg-sky-600",
    buttonTextColor: "text-white"
  },
  {
    id: 3,
    title: "Kolaborasi Tanpa Batas, Hasil Maksimal.",
    description: "Bergabunglah dengan komunitas kreatif, berkolaborasi, dan tingkatkan kualitas karyamu.",
    img: "/editor3.jpg",
    url: "/explore", // Ganti dengan halaman komunitas jika ada
    bg: "bg-gradient-to-tr from-rose-50 via-pink-50 to-fuchsia-100",
    textColor: "text-gray-800",
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    buttonTextColor: "text-white"
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Ganti interval jika perlu
    return () => clearInterval(interval);
  }, [current]); // Tambahkan current agar interval direset saat slide diganti manual

  return (
    <div data-aos="fade-up" className="relative h-[calc(100vh-120px)] sm:h-[calc(100vh-80px)] w-full overflow-hidden group">
      <div
        className="w-full h-full flex transition-transform ease-in-out duration-1000" // Transisi lebih smooth
        style={{ transform: `translateX(-${current * 100}%)` }} // Menggunakan persentase untuk vw
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16 px-6 sm:px-10 md:px-16 py-10 flex-shrink-0`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-5 md:space-y-6 order-2 lg:order-1 max-w-xl">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${slide.textColor} leading-tight tracking-tight drop-shadow-sm`}>
                {slide.title}
              </h1>
              <p className={`text-md sm:text-lg ${slide.textColor} opacity-80 leading-relaxed`}>
                {slide.description}
              </p>
              <Link href={slide.url}>
                <button className={`${slide.buttonColor} ${slide.buttonTextColor} mt-4 py-3 px-7 rounded-lg text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${slide.buttonColor.replace('bg-', 'focus:ring-')}`}>
                  Pelajari Lebih Lanjut
                </button>
              </Link>
            </div>

            {/* IMAGE CONTAINER */}
            <div className="lg:w-1/2 w-full h-64 sm:h-80 md:h-96 lg:h-full order-1 lg:order-2 relative">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="(max-width: 1023px) 90vw, 50vw"
                className="object-contain lg:object-cover rounded-xl shadow-xl" // Coba object-contain jika gambar sering terpotong
                priority={slide.id === 1} // Prioritaskan gambar slide pertama
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi Kiri & Kanan (Muncul saat hover) */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 p-2 sm:p-3 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-600 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-2 sm:p-3 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-600 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 z-10"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* DOTS Navigasi */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 sm:gap-3 z-10 mt-5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer border-2 border-emerald-600/50 hover:border-emerald-600 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1
              ${current === index ? "bg-emerald-500 scale-125" : "bg-white/70 hover:bg-emerald-200/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;