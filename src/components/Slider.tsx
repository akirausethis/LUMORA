"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Temukan Freelancer Profesional",
    description: "Butuh bantuan proyekmu? Kami siap bantu!",
    img: "/slider1.jpg",
    url: "/services",
    bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
  },
  {
    id: 2,
    title: "Tawarkan Jasa Terbaikmu",
    description: "Gabung dan mulai karirmu sebagai freelancer hari ini!",
    img: "/social1.jpg",
    url: "/join",
    bg: "bg-gradient-to-r from-purple-50 to-pink-50",
  },
  {
    id: 3,
    title: "Proyek Cepat, Hasil Tepat",
    description: "Selesaikan tugasmu dengan bantuan ahli.",
    img: "/design1.jpg",
    url: "/projects",
    bg: "bg-gradient-to-r from-green-50 to-emerald-50",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-6 text-center px-4">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-2xl text-gray-800 font-medium">
                {slide.description}
              </h2>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-5xl font-bold text-black">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-md bg-black text-white py-3 px-6 text-sm md:text-base hover:bg-gray-900 transition">
                  CARI SEKARANG
                </button>
              </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 flex gap-4">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center transition-transform ${
              current === index ? "scale-150" : ""
            }`}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
