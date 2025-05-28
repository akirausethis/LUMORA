// src/app/portfolio/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Gagal parse currentUser di PortfolioPage:", error);
      }
    }

    seedPortfolioPostsToLocalStorage(); // Pastikan fungsi ini ada dan diimpor dengan benar
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
    const combined = [...dummyPosts.map(post => ({...post}))]; // Salin dummyPosts untuk menghindari mutasi

    postsFromStorage.forEach(storagePost => {
        let authorName = storagePost.author;
        let avatar = storagePost.authorAvatar; // Gunakan field yang sudah ada jika ada

        // Update author dan avatar jika post dibuat oleh currentUser yang sedang login
        if (currentUserData && storagePost.authorId === currentUserData.id) {
            authorName = currentUserData.fullName || currentUserData.username;
            avatar = currentUserData.profilePictureUrl;
        }

        const existingPostIndex = combined.findIndex(dp => dp.id === storagePost.id);
        const postWithUpdatedAuthor: PortfolioPost = {
            ...storagePost,
            author: authorName,
            authorAvatar: avatar // Pastikan ini ada di tipe PortfolioPost
        };

        if (existingPostIndex === -1) {
            combined.push(postWithUpdatedAuthor);
        } else {
            combined[existingPostIndex] = postWithUpdatedAuthor; // Update dengan info author yang mungkin baru
        }
    });
    
    // Urutkan berdasarkan tanggal pembuatan (jika ada), terbaru dulu
    setAllPosts(combined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));

  }, [currentUserData]); // Tambahkan currentUserData sebagai dependency

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 selection:bg-emerald-500 selection:text-white">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 pt-20 pb-24 text-white shadow-lg">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <CompassIcon className="w-16 h-16 text-emerald-300 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight tracking-tight text-shadow-md">
            Galeri Karya Kreatif
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
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
              className="w-full pl-14 pr-6 py-4 text-md sm:text-lg border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-xl text-gray-800 placeholder-gray-500"
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
                className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white transform hover:-translate-y-1.5 aspect-[4/5]"
                data-aos="fade-up" data-aos-delay={(index % 4) * 100}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={(post.images && post.images.length > 0 ? post.images[0] : post.image) || '/placeholder-karya.png'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    priority={index < 4}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                        (e.target as HTMLImageElement).src = '/placeholder-karya.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-90"></div>
                   <div className="absolute bottom-0 left-0 w-full p-4"> {/* Padding konsisten */}
                      <h2 className="text-white text-lg font-semibold leading-tight line-clamp-2 mb-1" title={post.title}>
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-200 line-clamp-1 mb-1.5">{post.category}</p>
                      <div className="flex items-center gap-1.5">
                        {post.authorAvatar ? (
                            <Image src={post.authorAvatar} alt={post.author} width={20} height={20} className="w-5 h-5 rounded-full object-cover border border-white/50"/>
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/70 flex items-center justify-center text-white text-[10px] font-semibold border border-white/30">
                                {post.author?.substring(0,1).toUpperCase()}
                            </div>
                        )}
                        <span className="text-white text-xs font-medium line-clamp-1" title={post.author}>
                            {post.author}
                        </span>
                      </div>
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