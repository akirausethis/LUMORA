import { ShieldCheck, Rocket, Headset } from "lucide-react";

const WhyUs = () => {
  const reasons = [
    {
      icon: <ShieldCheck className="text-blue-600 w-8 h-8 mb-3" />,
      title: "Freelancer Terpercaya",
      description: "Kami hanya menampilkan freelancer dengan reputasi dan portofolio yang jelas.",
    },
    {
      icon: <Rocket className="text-blue-600 w-8 h-8 mb-3" />,
      title: "Proses Cepat & Mudah",
      description: "Proses pencarian dan transaksi dibuat seefisien mungkin demi kenyamanan Anda.",
    },
    {
      icon: <Headset className="text-blue-600 w-8 h-8 mb-3" />,
      title: "Dukungan Pelanggan",
      description: "Tim kami siap membantu Anda kapan saja selama proses berlangsung.",
    },
  ];

  return (
    <section data-aos="fade-up" className="py-20 mt-5">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Kenapa pilih kami?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
              <div className="flex flex-col items-center">
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
