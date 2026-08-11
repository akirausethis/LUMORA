// src/app/portfolio/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react"; // Menambahkan useRef
import Image from "next/image";
import { dummyPosts, seedPortfolioPostsToLocalStorage } from "../../../lib/dummyPosts"; // Pastikan path benar
import { SearchIcon, CompassIcon, Edit3Icon, ImageOffIcon } from "lucide-react";

// Definisikan tipe PortfolioPost (pastikan konsisten)
interface PortfolioPost {
  id: string;
  title: string;
  category: string;
  author: string;
  image?: string;
  images?: string[];
  createdAt?: string;
  description?: string;
  authorAvatar?: string; // Ditambahkan sebagai opsional
  likes?: number;
  authorId?: string;
}

// Tipe CurrentUser (pastikan konsisten dengan bagian lain aplikasi)
type CurrentUser = {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller';
  fullName?: string;
  profilePictureUrl?: string;
};

export default function DesignerPortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState<PortfolioPost[]>([]);
  const [currentUserData, setCurrentUserData] = useState<CurrentUser | null>(null);

  // useRef untuk memastikan seeding hanya sekali per sesi aplikasi
  const hasSeeded = useRef(false);

  // useEffect pertama: Memuat currentUserData hanya sekali saat mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Gagal parse currentUser di PortfolioPage:", error);
        setCurrentUserData(null); // Reset jika ada error parse
      }
    }
  }, []); // Dependency array kosong: hanya berjalan sekali saat mount

  // useEffect kedua: Memuat dan memproses semua postingan
  useEffect(() => {
    // Pastikan seeding hanya berjalan sekali per sesi aplikasi
    if (!hasSeeded.current) {
        seedPortfolioPostsToLocalStorage();
        hasSeeded.current = true;
    }

    const storedPosts = localStorage.getItem("designerPosts");
    let postsFromStorage: PortfolioPost[] = [];
    if (storedPosts) {
      try {
        postsFromStorage = JSON.parse(storedPosts);
        if (!Array.isArray(postsFromStorage)) postsFromStorage = [];
      } catch (error) {
        console.error("Kesalahan parse 'designerPosts' dari localStorage:", error);
        postsFromStorage = [];
      }
    }

    // Gabungkan dummyPosts dengan yang dari localStorage
    // Pastikan dummyPosts disalin agar tidak memutasi array aslinya
    const combined: PortfolioPost[] = [...dummyPosts.map(post => ({...post}))];

    postsFromStorage.forEach(storagePost => {
        let authorName = storagePost.author;
        let avatar = storagePost.authorAvatar;

        // Gunakan nilai currentUserData dari state.
        // Jika currentUserData berubah, useEffect ini akan re-run.
        if (currentUserData && storagePost.authorId === currentUserData.id) {
            authorName = currentUserData.fullName || currentUserData.username;
            avatar = currentUserData.profilePictureUrl;
        }

        const existingPostIndex = combined.findIndex(dp => dp.id === storagePost.id);
        const postWithUpdatedAuthor: PortfolioPost = {
            ...storagePost,
            author: authorName,
            authorAvatar: avatar
        };

        if (existingPostIndex === -1) {
            combined.push(postWithUpdatedAuthor);
        } else {
            // Update jika post sudah ada (misalnya untuk memperbarui info author yang mungkin berubah)
            combined[existingPostIndex] = postWithUpdatedAuthor;
        }
    });
    
    // Urutkan berdasarkan tanggal pembuatan (jika ada), terbaru dulu
    // Gunakan fungsi pengurutan yang stabil atau pastikan objek di dalam array tidak berubah referensi
    const sortedPosts = combined.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    setAllPosts(sortedPosts);

  }, [currentUserData]); // Dependency: useEffect ini akan re-run jika currentUserData berubah

  const filteredPosts = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    if (!lowerCaseQuery) return allPosts;
    return allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.author.toLowerCase().includes(lowerCaseQuery) ||
        (post.category && post.category.toLowerCase().includes(lowerCaseQuery)) ||
        (post.description && post.description.toLowerCase().includes(lowerCaseQuery))
    );
  }, [searchQuery, allPosts]);

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <div className="bg-slate-50 pt-24 pb-16 border-b border-gray-100">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <CompassIcon className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-gray-900">
            Galeri Karya Kreatif
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
            Temukan inspirasi visual, jelajahi portofolio desainer, dan lihat tren terkini dari komunitas Lumora.
          </p>
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
              <input
                type="text"
                placeholder="Cari karya, kreator, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 text-md sm:text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-gray-800 placeholder-gray-400 bg-white"
              />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id || index}
                href={`/portfolio/${post.id}`} 
                className="group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100 flex flex-col"
                data-aos="fade-up" data-aos-delay={(index % 4) * 100}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
                  <Image
                    src={(post.images && post.images.length > 0 ? post.images[0] : post.image) || '/placeholder-karya.png'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-gray-900 text-lg font-semibold leading-tight line-clamp-1 mb-1 group-hover:text-emerald-600 transition-colors" title={post.title}>
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-3">{post.category}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    {post.authorAvatar ? (
                        <Image src={post.authorAvatar} alt={post.author} width={24} height={24} className="w-6 h-6 rounded-full object-cover border border-gray-200"/>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold border border-emerald-200">
                            {post.author?.substring(0,1).toUpperCase()}
                        </div>
                    )}
                    <span className="text-gray-700 text-xs font-medium line-clamp-1" title={post.author}>
                        {post.author}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-md border">
            <ImageOffIcon className="mx-auto h-20 w-20 text-gray-300 mb-5" />
            <p className="text-gray-600 text-xl font-semibold mb-2">
              {searchQuery ? `Tidak ada karya ditemukan untuk "${searchQuery}".` : "Belum ada karya di portofolio."}
            </p>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery ? "Coba kata kunci lain atau hapus filter." : "Segera kembali untuk melihat karya-karya inspiratif!"}
            </p>
            {searchQuery && (
                <button
                onClick={() => setSearchQuery("")}
                className="text-emerald-600 hover:text-emerald-800 text-md font-medium bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg transition-colors"
                >
                Hapus Pencarian
                </button>
            )}
             {/* Tombol Tambah Karya Baru */}
             {!searchQuery && currentUserData && ( // Hanya tampil jika tidak sedang mencari dan user login
                <Link href="/addpost" className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 text-base font-medium rounded-xl shadow-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105">
                    <Edit3Icon className="w-4 h-4" /> Tambah Karya Baru
                </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}