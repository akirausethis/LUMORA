import { Users } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="mt-10 py-16">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-full shadow-md">
            <Users className="text-blue-600 w-10 h-10" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tentang Kami</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Kami adalah platform yang menghubungkan freelancer profesional dengan klien yang membutuhkan jasa terbaik.
          Dengan misi memberikan kemudahan, efisiensi, dan hasil berkualitas dalam setiap proyek, kami hadir untuk mendukung kesuksesan Anda.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
