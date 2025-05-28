// src/components/AboutUs.tsx
import { UsersIcon as LucideUsersIcon } from "lucide-react"; // Menggunakan alias untuk kejelasan

const AboutUs = () => {
  return (
    <section data-aos="fade-up" className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 via-teal-50 to-sky-100">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="mb-8 inline-flex justify-center items-center">
          <div className="p-4 bg-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-110">
            <LucideUsersIcon className="text-emerald-500 w-10 h-10 md:w-12 md:h-12" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Tentang <span className="text-emerald-600">Lumora</span>
        </h2>
        <p className="text-md sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Lumora adalah platform inovatif yang dirancang untuk menjembatani kesenjangan antara freelancer berbakat di bidang desain dan kreatif dengan klien yang mencari talenta terbaik. Misi kami adalah memberdayakan para pekerja lepas untuk memamerkan portofolio mereka, mendapatkan proyek yang bermakna, dan membangun jaringan profesional yang kuat, semua dalam satu wadah yang intuitif dan mendukung. Kami percaya pada kekuatan kreativitas dan kolaborasi untuk menciptakan hasil yang luar biasa.
        </p>
        <div className="mt-10">
          <a // Menggunakan <a> jika ini link eksternal, atau <Link> dari next/link jika internal
            href="/explore" // Contoh link ke halaman explore
            className="px-8 py-3.5 bg-emerald-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Jelajahi Layanan Kami
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;