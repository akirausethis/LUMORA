// src/components/LandingHighlightSection.tsx
import Image from "next/image";
import Link from "next/link";
import { TrendingUpIcon, Users2Icon, BriefcaseIcon, BadgeCheckIcon } from "lucide-react";

const highlightsData = [
  {
    id: 1,
    title: "Jangkauan Global",
    description: "Terhubung dengan klien dan freelancer dari berbagai belahan dunia.",
    icon: <TrendingUpIcon className="w-10 h-10 text-emerald-500" />,
    bg: "bg-emerald-50",
    borderColor: "border-emerald-200"
  },
  {
    id: 2,
    title: "Komunitas Solid",
    description: "Bergabunglah dengan ribuan talenta kreatif yang saling mendukung.",
    icon: <Users2Icon className="w-10 h-10 text-sky-500" />,
    bg: "bg-sky-50",
    borderColor: "border-sky-200"
  },
  {
    id: 3,
    title: "Proyek Berkualitas",
    description: "Temukan proyek-proyek menarik yang sesuai dengan keahlian Anda.",
    icon: <BriefcaseIcon className="w-10 h-10 text-teal-500" />,
    bg: "bg-teal-50",
    borderColor: "border-teal-200"
  },
];

const LandingHighlightSection = () => {
  return (
    <section data-aos="fade-up" className="py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="inline-flex items-center px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4 border border-emerald-300">
          <BadgeCheckIcon className="w-5 h-5 mr-2" />
          Keunggulan Lumora
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-5">
          Mengapa Bergabung dengan Kami?
        </h2>
        <p className="text-md text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Lumora tidak hanya sekadar platform, tetapi ekosistem yang dirancang untuk pertumbuhan karir dan kesuksesan proyek Anda.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {highlightsData.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-6 sm:p-8 ${item.bg} flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 border ${item.borderColor} transform hover:scale-105`}
            >
              <div className={`p-4 rounded-full bg-white mb-5 shadow-md`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
            {/* Tombol "Scale with us" yang ada di sini dihapus sesuai permintaan */}
            {/* Jika Anda ingin tombol lain di sini, misalnya link ke halaman registrasi: */}
            <Link href="/register" className="px-8 py-3 bg-emerald-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Daftar Sekarang, Gratis!
            </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingHighlightSection;