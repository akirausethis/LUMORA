// src/components/WhyUs.tsx
import { ShieldCheckIcon, RocketIcon, HeadsetIcon, ZapIcon } from "lucide-react"; // Menggunakan ikon dari Lucide React

const WhyUs = () => {
  const reasons = [
    {
      icon: <ShieldCheckIcon className="w-9 h-9 text-emerald-500" />, // Warna disesuaikan
      title: "Freelancer Terverifikasi & Terpercaya",
      description: "Kami memastikan setiap freelancer memiliki portofolio yang jelas dan reputasi yang baik untuk kualitas dan keandalan terbaik.",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconBgColor: "bg-emerald-100",
    },
    {
      icon: <RocketIcon className="w-9 h-9 text-teal-500" />, // Warna disesuaikan
      title: "Proses Cepat, Mudah & Efisien",
      description: "Alur pencarian, pemesanan, hingga pembayaran dirancang agar intuitif, hemat waktu, dan transparan bagi kedua belah pihak.",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      iconBgColor: "bg-teal-100",
    },
    {
      icon: <HeadsetIcon className="w-9 h-9 text-sky-500" />, // Warna disesuaikan
      title: "Dukungan Pelanggan Responsif",
      description: "Tim support kami selalu siap sedia membantu Anda mengatasi kendala atau menjawab pertanyaan kapan saja dibutuhkan.",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      iconBgColor: "bg-sky-100",
    },
  ];

  return (
    <section data-aos="fade-up" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <div className="inline-flex items-center px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4 border border-emerald-300 shadow-sm">
          <ZapIcon className="w-5 h-5 mr-2" />
          Alasan Memilih Lumora
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Kenapa Harus <span className="text-emerald-600">Lumora?</span>
        </h2>
        <p className="text-md sm:text-lg text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed">
          Kami berkomitmen untuk menyediakan platform freelance terbaik yang memberdayakan talenta kreatif dan memudahkan klien mendapatkan hasil berkualitas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 py-8 sm:p-8 ${item.bgColor} flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 border ${item.borderColor} transform hover:scale-105 hover:-translate-y-1`}
            >
              <div className={`p-5 rounded-full ${item.iconBgColor} mb-6 shadow-md inline-block transform group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;