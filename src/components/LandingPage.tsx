"use client";

import Image from "next/image";

const LandingPage = () => {
  return (
    <div data-aos="fade-up" className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-20 lg:px-24 pb-24 pt-24 bg-white">
      
      {/* Left Section - Text */}
      <div className="lg:w-1/2 w-full text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-lumora mb-4">
          Bangun Karier Freelance-mu
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
          Portofolio, Klien, Kolaborasi
        </h2>
        <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
          Platform untuk anak desain (DKV) yang ingin menunjukkan karya terbaik, dapat proyek, dan membangun koneksi profesional — semua dalam satu tempat.
        </p>
        <button className="bg-lumora text-white px-6 py-3 rounded-lg font-semibold">
          Mulai Sekarang
        </button>

        {/* Logos */}
        <div className="flex flex-wrap gap-4 items-center mt-10 justify-center lg:justify-start">
          <Image src="/photoshop.png" alt="Photoshop" width={64} height={64} />
          <Image src="/illustrator.png" alt="Illustrator" width={64} height={64} />
          <Image src="/figma.png" alt="Figma" width={50} height={50} />
          <Image src="/canva.png" alt="Canva" width={64} height={64} />
          <Image src="/aftereffects.png" alt="AE" width={64} height={64} />
        </div>
      </div>

      {/* Right Section - Video */}
      <div className="lg:w-1/2 w-full mb-12 lg:mb-0 flex justify-center display-hidden md:pl-24 xl:pl-48">
        <video
          src="/lumora.mp4"
          width={500}
          height={500}
          className="rounded-xl shadow-lg max-w-full h-auto"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
};

export default LandingPage;
