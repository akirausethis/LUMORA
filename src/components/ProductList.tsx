"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const freelancers = [
  {
    id: "0",
    title: "Editor Video Profesional",
    price: 490000,
    description: "After movie, promosi, konten sosial media.",
    image1: "/editor1.jpg",
    image2: "/editor2.jpg",
    category: "Video & Animasi",
    subcategory: "Video Editing",
    skills: [
      "After Movie",
      "Video Promosi",
      "Konten Sosial Media",
      "Motion Graphics",
      "Color Grading",
      "Sound Design",
    ],
    rating: 5.0,
    reviewCount: 62,
    testimonials: [
      {
        name: "Rina",
        role: "Event Organizer",
        text: "Hasil editannya keren banget! Detail, profesional, dan cepet banget responnya.",
      },
      {
        name: "Dimas",
        role: "Owner Clothing Brand",
        text: "Video promosi toko online ku langsung keliatan pro, banyak yang nanya siapa editornya!",
      },
    ],
    image: "/editor_single.jpg", // Tambahkan gambar untuk single page
  },
  {
    id: "1",
    title: "Desainer Logo Kreatif",
    price: 390000,
    description: "Desain logo unik dan profesional.",
    image1: "/design1.jpg",
    image2: "/design2.jpg",
    category: "Desain & Kreatif",
    subcategory: "Desain Logo",
    skills: [
      "Desain Logo",
      "Brand Identity",
      "Visual Branding",
      "Logo Modern",
      "Desain Minimalis",
    ],
    rating: 4.8,
    reviewCount: 45,
    testimonials: [
      {
        name: "Budi",
        role: "Startup Founder",
        text: "Logonya dapet banget esensi bisnis kami, prosesnya juga enak diajak diskusi.",
      },
      {
        name: "Siti",
        role: "UMKM Owner",
        text: "Desainnya fresh dan beda dari yang lain, harganya juga oke.",
      },
    ],
    image: "/design_single.jpg", // Tambahkan gambar untuk single page
  },
  {
    id: "2",
    title: "Pengelola Media Sosial",
    price: 590000,
    description: "Kelola Instagram, TikTok, & lainnya.",
    image1: "/social1.jpg",
    image2: "/social2.jpg",
    category: "Pemasaran",
    subcategory: "Social Media Management",
    skills: [
      "Instagram Marketing",
      "TikTok Management",
      "Content Creation",
      "Social Media Strategy",
      "Engagement",
    ],
    rating: 4.9,
    reviewCount: 58,
    testimonials: [
      {
        name: "Andi",
        role: "Business Owner",
        text: "Engagement sosmed kami naik signifikan setelah pakai jasanya.",
      },
      {
        name: "Lina",
        role: "Marketing Manager",
        text: "Laporan detail dan strateginya jelas, recommended!",
      },
    ],
    image: "/social_single.jpg", // Tambahkan gambar untuk single page
  },
  {
    id: "3",
    title: "Pengisi Suara Profesional",
    price: 350000,
    description: "Pengisi suara untuk video, iklan, & narasi.",
    image1: "/voice1.jpg",
    image2: "/voice2.jpg",
    category: "Audio & Musik",
    subcategory: "Voice Over",
    skills: ["Narasi", "Iklan TV/Radio", "Dubbing", "E-learning", "Audiobook"],
    rating: 4.7,
    reviewCount: 32,
    testimonials: [
      {
        name: "Rizky",
        role: "Video Producer",
        text: "Suaranya khas dan profesional, hasilnya selalu memuaskan.",
      },
      {
        name: "Maya",
        role: "Content Creator",
        text: "Fleksibel dan bisa menyesuaikan dengan kebutuhan proyek kami.",
      },
    ],
    image: "/voice_single.jpg", // Tambahkan gambar untuk single page
  },
];

const ProductList = () => {
  const formatRupiahManual = (angka: number): string => {
    const rupiah = angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return rupiah;
  };

  const handleAddToCart = (item: (typeof freelancers)[0]) => {
    const currentCartString = localStorage.getItem("cartItems");
    let currentCart = [];

    if (currentCartString) {
      try {
        const parsedCart = JSON.parse(currentCartString);
        if (Array.isArray(parsedCart)) {
          currentCart = parsedCart;
        }
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error);
      }
    }

    const existingItemIndex = currentCart.findIndex(
      (cartItem: (typeof freelancers)[0] & { quantity: number }) =>
        cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    alert(`${item.title} ditambahkan ke keranjang!`); // Sebagai indikator
  };

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {freelancers.map((item) => (
        <div
          key={item.id}
          className="group flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg"
        >
          <div className="relative w-full h-56 rounded-md overflow-hidden">
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
            <span className="font-semibold text-lg text-gray-800">
              {item.title}
            </span>
            <span className="inline-block bg-yellow-200 text-yellow-800 font-semibold py-1 px-2 rounded-full text-sm">
              {formatRupiahManual(item.price)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => handleAddToCart(item)}
              className="rounded-full ring-1 ring-blue-700 text-blue-700 py-1.5 px-2 text-[0.7rem] font-medium hover:bg-blue-700 hover:text-white transition-colors flex-grow"
            >
              Tambahkan ke Keranjang
            </button>
            <Link
              href={`/payment/${item.id}`}
              className="rounded-full bg-green-500 text-white py-1.5 px-3 text-[0.7rem] font-medium hover:bg-green-600 transition-colors flex-grow text-center"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;