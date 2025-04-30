import Image from "next/image";
import Link from "next/link";

const freelancers = [
  {
    title: "Video Editor Professional",
    price: "$49",
    description: "After movie, promosi, konten sosial media.",
    image1: "/editor1.jpg",
    image2: "/editor2.jpg",
  },
  {
    title: "Creative Logo Designer",
    price: "$39",
    description: "Desain logo unik dan profesional.",
    image1: "/design1.jpg",
    image2: "/design2.jpg",
  },
  {
    title: "Social Media Manager",
    price: "$59",
    description: "Kelola Instagram, TikTok, & lainnya.",
    image1: "/social1.jpg",
    image2: "/social2.jpg",
  },
  {
    title: "Voice Over Artist",
    price: "$35",
    description: "Voice over untuk video, iklan, & narasi.",
    image1: "/voice1.jpg",
    image2: "/voice2.jpg",
  },
];

const ProductList = () => {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {freelancers.map((item, index) => (
        <Link
          key={index}
          href="/test"
          className="group flex flex-col gap-4 bg-white p-4 rounded-xl shadow transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="relative w-full h-64 rounded-md overflow-hidden">
            <Image
              src={item.image2}
              alt={item.title}
              fill
              sizes="25vw"
              className="absolute object-cover z-10 group-hover:opacity-0 transition-opacity duration-500"
            />
            <Image
              src={item.image1}
              alt={item.title}
              fill
              sizes="25vw"
              className="absolute object-cover"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-lg text-gray-800">{item.title}</span>
            <span className="font-semibold text-blue-600">{item.price}</span>
          </div>
          <p className="text-sm text-gray-500">{item.description}</p>
          <button className="mt-auto rounded-2xl ring-1 ring-blue-600 text-blue-600 py-2 px-4 text-sm hover:bg-blue-600 hover:text-white transition-colors">
            Add to Cart
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
