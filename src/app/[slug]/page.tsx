import { CheckCircle, Star, ShieldCheck, MessageCircleMore, StarHalf } from "lucide-react";
import ProductImages from "@/components/ProductImages";
import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";

const SinglePage = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16 pb-16 mt-10">
      {/* IMAGE */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages />
      </div>

      {/* TEXT */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/* Nama Freelancer */}
        <h1 className="text-4xl font-semibold">Video Editor Professional</h1>

        {/* Deskripsi Singkat */}
        <p className="text-gray-600 text-lg">
          Dengan pengalaman lebih dari 3 tahun dalam mengedit video promosi, after movie, dan konten media sosial, saya
          membantu klien menghadirkan cerita yang kuat dan visual yang memikat.
        </p>

        {/* Benefit Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Kenapa pilih saya?</h2>
          <ul className="flex flex-col gap-4 text-gray-700">
            <li className="flex items-start gap-2">
              <ShieldCheck className="text-blue-600" />
              <span>Hasil editing berkualitas tinggi dan siap upload</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600" />
              <span>Revisi tanpa batas hingga puas (syarat berlaku)</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="text-yellow-500" />
              <span>Rating 5⭐ dari lebih dari 50 klien puas</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircleMore className="text-purple-500" />
              <span>Fast response dan komunikasi yang jelas</span>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-gray-200" />

        {/* Skillset */}
        <div className="text-sm">
          <h4 className="font-semibold text-lg mb-4">Spesialisasi</h4>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-600 list-disc pl-4">
            <li>After Movie</li>
            <li>Video Promosi</li>
            <li>Konten Sosial Media</li>
            <li>Motion Graphics</li>
            <li>Color Grading</li>
            <li>Sound Design</li>
          </ul>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-gray-200" />

        {/* CTA */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-sm font-medium shadow">
            Hubungi Saya
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg text-sm font-medium">
            Lihat Portofolio
          </button>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-gray-200" />

        {/* Rating Ringkas */}
        <div className="flex items-center gap-2 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} />
          ))}
          <span className="text-gray-700 text-sm ml-2">(5.0 dari 50+ review)</span>
        </div>

        {/* Testimoni */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-lg font-semibold">Apa kata klien?</h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 italic">“Hasil editannya keren banget! Detail, profesional, dan cepet banget responnya. Gak nyesel hire dia buat project event kampus kami.”</p>
            <span className="block mt-2 text-sm text-gray-500">– Rina, Event Organizer</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 italic">“Dia ngerti banget maunya klien. Video promosi toko online ku langsung keliatan pro, banyak yang nanya siapa editornya!”</p>
            <span className="block mt-2 text-sm text-gray-500">– Dimas, Owner Clothing Brand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
