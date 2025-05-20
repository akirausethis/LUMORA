import Image from "next/image";

const highlights = [
  {
    id: 1,
    title: "Operational Area",
    description: "Operations in Indonesia and Singapore",
    img: "/messages.png", // ganti dengan gambarmu
    bg: "bg-green-200",
  },
  {
    id: 2,
    title: "3.1 million+",
    description: "driver-partners",
    img: "/music.png",
    bg: "bg-purple-200",
  },
  {
    id: 3,
    title: "20.1 million+",
    description: "Merchants within the GoTo ecosystem",
    img: "/design.png",
    bg: "bg-orange-200",
  },
];

const LandingPageHighlight = () => {
  return (
    <section data-aos="fade-up" className="py-16 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Our scale</h2>
      <button className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 mb-12">
        Scale with us
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {highlights.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-6 ${item.bg} flex flex-col items-center`}
          >
            <div className="w-40 h-40 relative mb-4">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPageHighlight;
