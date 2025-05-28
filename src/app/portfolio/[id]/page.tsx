// app/portfolio/[id]/page.tsx
"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// Import dummyPosts dari file terpisah
import { dummyPosts } from "../../../../lib/dummyPosts";
import {
  CheckCircle,
  MessageCircleMore,
  Package,
  HelpCircle,
  X, // Import icon untuk menutup modal
} from "lucide-react"; // Pastikan X diimpor

interface Post {
  id: string;
  title: string;
  author: string;
  image?: string;
  images?: string[]; // Pastikan ini ada untuk array gambar
  description?: string;
  category?: string;
  createdAt?: string;
  // Tambahkan properti lain yang relevan dari dummyPosts Anda di sini
  // deliveryTime?: string | number;
  // revisions?: string | number;
  // includedItems?: string[];
  // requirements?: string[];
}

interface SinglePostProps {
  params: {
    id: string;
  };
}

// --- START: PortfolioImages Component dengan Preview yang Disesuaikan dan Perbaikan Gambar ---
interface PortfolioImagesProps {
  images: string[];
  title: string;
}

const PortfolioImages: React.FC<PortfolioImagesProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images.length > 0 ? images[0] : null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const openPreview = (src: string) => {
    setPreviewImageSrc(src);
    setIsPreviewOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImageSrc(null);
    document.body.style.overflow = "";
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg shadow-inner">
        <p className="text-lg">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {selectedImage && (
        <div
          className="w-full h-[400px] md:h-[500px] relative rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer group"
          onClick={() => openPreview(selectedImage)}
        >
          <Image
            src={selectedImage}
            alt={`Gambar utama untuk ${title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-lg font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Lihat Penuh
            </span>
          </div>
        </div>
      )}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-28 h-28 relative cursor-pointer border-2 ${
                selectedImage === img
                  ? "border-blue-500 ring-2 ring-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              } rounded-lg overflow-hidden transition-all duration-200`}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal (Lightbox) - Perbaikan Z-Index dan Ukuran */}
      {isPreviewOpen && previewImageSrc && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95 p-4" // Z-index sangat tinggi, background lebih gelap
          onClick={closePreview}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center rounded-lg overflow-hidden" // Ukuran diperbesar, ditambahkan rounded-lg & overflow-hidden
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePreview}
              // Posisi tombol X disesuaikan agar selalu terlihat dan tidak tertutup navbar
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[9999] p-2 rounded-full bg-gray-800 bg-opacity-70 hover:bg-opacity-90"
              aria-label="Tutup preview gambar"
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            <div className="relative w-full h-full min-h-[200px]">
              <Image
                src={previewImageSrc}
                alt={`Preview penuh untuk ${title}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// --- END: PortfolioImages Component dengan Preview yang Disesuaikan dan Perbaikan Gambar ---


export default function SinglePost({ params }: SinglePostProps) {
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = () => {
      try {
        const storedPosts = localStorage.getItem("designerPosts");
        const localPosts: Post[] = storedPosts ? JSON.parse(storedPosts) : [];
        const allPosts = [...dummyPosts, ...localPosts];
        const foundPost = allPosts.find((p) => p.id === id);

        if (foundPost) {
          setPost(foundPost);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error loading post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-16 lg:px-32 flex items-center justify-center">
        <div className="animate-pulse text-center w-full max-w-2xl">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-80 bg-gray-200 rounded-lg w-full mb-8"></div>
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
            <div className="h-5 bg-gray-200 rounded w-4/6"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return notFound();

  const dateDisplay = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const postImagesArray =
    post.images && post.images.length > 0
      ? post.images
      : post.image
      ? [post.image]
      : [];

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative py-12 bg-white rounded-lg shadow-lg my-8">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* IMAGE SECTION */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <PortfolioImages images={postImagesArray} title={post.title} />
        </div>

        {/* POST DETAILS TEXTS SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4 border-gray-100">
            <p className="text-gray-600 text-lg mb-2 sm:mb-0">
              by{" "}
              <span className="font-semibold text-blue-700">{post.author}</span>
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {post.category && (
                <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </span>
              )}
              {dateDisplay && (
                <span className="text-gray-500 text-sm italic">
                  {dateDisplay}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed border-b border-gray-200 py-6 my-4">
            {post.description || "Tidak ada deskripsi untuk proyek ini."}
          </p>

          <div className="h-[1px] bg-gray-200 my-4" />

          {/* DETAIL TAMBAHAN SECTION (Contoh: Jika Anda menambahkan properti ke interface Post) */}
          {/* Misalnya, jika Anda punya array 'toolsUsed' di Post interface Anda */}
          {/* {post.toolsUsed && post.toolsUsed.length > 0 && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="font-semibold text-xl text-gray-800 flex items-center gap-2 mb-4">
                <HelpCircle className="w-6 h-6 text-gray-600" /> Tools yang Digunakan:
              </h4>
              <ul className="list-none space-y-3">
                {post.toolsUsed.map((tool, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}