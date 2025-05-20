"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Bangun Portofolio Kerenmu",
    description: "Mulai karirmu sebagai desainer freelance yang profesional.",
    img: "/design1.jpg",
    url: "/portfolio",
    bg: "bg-gradient-to-r from-indigo-100 to-sky-100",
  },
  {
    id: 2,
    title: "Tunjukkan Gaya Desainmu",
    description: "Ekspresikan kreativitasmu lewat proyek nyata dari klien!",
    img: "/design2.jpg",
    url: "/showcase",
    bg: "bg-gradient-to-r from-pink-100 to-rose-100",
  },
  {
    id: 3,
    title: "Gabung Komunitas Desainer",
    description: "Belajar bareng, dapat feedback, dan bertumbuh bersama.",
    img: "/editor1.jpg",
    url: "/community",
    bg: "bg-gradient-to-r from-emerald-100 to-lime-100",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-aos="fade-up" className="relative h-[calc(100vh-80px)] overflow-hidden mb-10">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col xl:flex-row items-center justify-center gap-12 px-16 py-10`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="xl:w-1/2 text-center xl:text-left space-y-6">
              <h2 className="text-md sm:text-xl text-gray-600 font-medium">
                {slide.description}
              </h2>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow pb-10">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 transition font-semibold shadow-md">
                  Mulai Sekarang
                </button>
              </Link>
            </div>

            {/* IMAGE CONTAINER */}
            <div className="xl:w-1/2 relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="100%"
                className="object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer border border-gray-700 transition-transform duration-300 flex items-center justify-center ${
              current === index ? "scale-150 bg-gray-800" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
