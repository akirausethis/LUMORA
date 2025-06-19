// src/app/explore/page.tsx
"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { seedProductsToLocalStorage } from '../../../lib/dummyProducts'; // Pastikan path dan nama ekspor dummyProducts benar
import NotificationModal, { ModalButton } from '@/components/NotificationModal';
import { SearchIcon, ChevronDownIcon, StarIcon, HeartIcon, FilterIcon, XIcon as CloseIcon } from 'lucide-react'; // Contoh ikon

// Definisikan tipe Product (konsisten dengan tempat lain)
type Product = {
  id: string; title: string; price: string | number; image: string | null; images?: string[];
  category: string; subcategory: string; description: string;
  deliveryTime?: string | number; revisions?: string | number;
  includedItems?: string[]; requirements?: string[];
  sellerId?: string; // PENTING untuk menampilkan info author/seller
  // Tambahkan rating jika ada
  rating?: number;
  reviewCount?: number;
};

// Tipe UserData (untuk mengambil info seller)
type UserData = {
  id: string; username: string; email: string; role: 'buyer' | 'seller';
  fullName?: string; profilePictureUrl?: string; storeName?: string;
};

// Tipe untuk state modal
interface ModalStateType {
  isOpen: boolean; title: string; message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[]; onClose?: () => void;
}

const ExplorePage = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<UserData[]>([]); // Untuk menyimpan data semua user
  const router = useRouter();
  const categoriesNavRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);


  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const categories = [
    "Desain Karakter", "Ilustrasi", "Seni Konsep", "Desain UI/UX", "Branding",
    "Desain Merchandise", "Aset Grafis", "Pemodelan 3D", "Animasi",
    "Emote & Lencana", "Permintaan Kustom",
  ];
  const subcategoriesMap: Record<string, string[]> = {
    "Desain Karakter": ["Karakter Orisinal (OC)", "Karakter D&D", "Fanart"],
    "Ilustrasi": ["Potret", "Full Body", "Latar Belakang Pemandangan"],
    "Seni Konsep": ["Desain Lingkungan", "Desain Makhluk", "Desain Senjata/Item"],
    "Desain UI/UX": ["Mockup Aplikasi", "Tata Letak Situs Web", "Antarmuka Game"],
    "Branding": ["Desain Logo", "Palet Warna", "Identitas Visual"],
    "Desain Merchandise": ["Desain Stiker", "Desain Kaos", "Seni Gantungan Kunci"],
    "Aset Grafis": ["Ikon", "Elemen UI", "Aset Game"],
    "Pemodelan 3D": ["Model Karakter", "Props", "Seni Low-Poly"],
    "Animasi": ["GIF", "Animasi Karakter", "Emote Bergerak"],
    "Emote & Lencana": ["Emote Twitch", "Stiker Discord", "Lencana Subscriber"],
    "Permintaan Kustom": ["Seni Pasangan", "Potret Hewan Peliharaan", "Adegan Fantasi"],
  };

  useEffect(() => {
    // Panggil fungsi seeding produk dummy. Fungsi ini harus memastikan localStorage 'products'
    // berisi dummy terbaru + produk pengguna.
    seedProductsToLocalStorage(); 

    // Ambil SEMUA produk dari localStorage untuk ditampilkan.
    const storedProducts = localStorage.getItem("products");
    let productsToDisplay: Product[] = [];
    if (storedProducts) {
      try {
        productsToDisplay = JSON.parse(storedProducts);
        if (!Array.isArray(productsToDisplay)) productsToDisplay = [];
      } catch (e) {
        console.error("Gagal parsing produk dari localStorage di ExplorePage (setelah seed):", e);
        productsToDisplay = [];
        setModalState({isOpen:true, title:"Error Data", message:"Gagal memuat data produk.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      }
    }
    setAllProducts(productsToDisplay);

    // Ambil data semua pengguna untuk info author/seller
    const storedUsers = localStorage.getItem("registeredUsers");
    if (storedUsers) {
        try {
            const parsedUsers: UserData[] = JSON.parse(storedUsers);
            setAllUsers(Array.isArray(parsedUsers) ? parsedUsers : []);
        } catch (e) {
            console.error("Gagal parsing registeredUsers:", e);
            setAllUsers([]);
        }
    }
  }, []);

  const getSellerInfo = (sellerId?: string): UserData | undefined => {
    if (!sellerId) return undefined;
    return allUsers.find(user => user.id === sellerId && user.role === 'seller');
  };

  useEffect(() => {
    let currentFiltered = allProducts;
    if (selectedSubcategory) {
      currentFiltered = currentFiltered.filter(product => product.subcategory === selectedSubcategory);
    } else if (selectedMainCategory) {
      currentFiltered = currentFiltered.filter(product => product.category === selectedMainCategory);
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerCaseQuery) ||
          product.description?.toLowerCase().includes(lowerCaseQuery) || // Tambah '?' untuk safety
          product.category.toLowerCase().includes(lowerCaseQuery) ||
          product.subcategory.toLowerCase().includes(lowerCaseQuery)
      );
    }
    setFilteredProducts(currentFiltered);
  }, [selectedMainCategory, selectedSubcategory, allProducts, searchQuery]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => { /* ... (drag logic sama) ... */ 
    setIsDragging(true);
    if (categoriesNavRef.current) {
      setStartX(e.pageX - categoriesNavRef.current.offsetLeft);
      setScrollLeft(categoriesNavRef.current.scrollLeft);
    }
  };
  const onMouseLeave = () => { setIsDragging(false); };
  const onMouseUp = () => { setIsDragging(false); };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { /* ... (drag logic sama) ... */ 
     if (!isDragging || !categoriesNavRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesNavRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    categoriesNavRef.current.scrollLeft = scrollLeft - walk;
  };
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => { /* ... (drag logic sama) ... */ 
    setIsDragging(true);
    if (categoriesNavRef.current) {
      setStartX(e.touches[0].pageX - categoriesNavRef.current.offsetLeft);
      setScrollLeft(categoriesNavRef.current.scrollLeft);
    }
  };
  const onTouchEnd = () => { setIsDragging(false); };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => { /* ... (drag logic sama) ... */ 
     if (!isDragging || !categoriesNavRef.current) return;
    const x = e.touches[0].pageX - categoriesNavRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesNavRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMainCategorySelect = (category: string) => { /* ... (sama) ... */ 
    setSelectedMainCategory(category);
    setSelectedSubcategory("");
    setSearchQuery(""); 
    setIsMobileFilterOpen(false); // Tutup filter mobile jika terbuka
  };
  const handleSubcategorySelect = (subcategory: string) => { /* ... (sama) ... */ 
    setSelectedSubcategory(subcategory);
    setSearchQuery(""); 
    setIsMobileFilterOpen(false);
  };
  const handleNavigateToProduct = (id: string) => router.push(`/product/${id}`);
  const formatPrice = (price: string | number) => { /* ... (sama) ... */ 
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/\D/g, '')) : price;
    if (isNaN(numPrice)) return "Harga Tdk Valid";
    return numPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
  const availableSubcategories = selectedMainCategory ? subcategoriesMap[selectedMainCategory] || [] : [];

  return (
    <>
      <NotificationModal {...modalState} />
      <div className='min-h-screen bg-gray-50 selection:bg-emerald-500 selection:text-white'>
        {/* Header Section dengan Search Bar Besar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white pt-16 pb-20 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Temukan Jasa Desain & Kreatif
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 mb-8">
              Dapatkan layanan berkualitas dari para profesional untuk proyek Anda.
            </p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari jasa (misal: logo, ilustrasi, video editor)"
                className="w-full pl-12 sm:pl-16 pr-6 py-4 text-md sm:text-lg border-0 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-lg text-gray-800 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedMainCategory(""); setSelectedSubcategory("");
                }}
              />
            </div>
          </div>
        </div>

        <div className='px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8'>
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 flex justify-end">
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-100 px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-200 transition-colors"
              >
                <FilterIcon className="w-4 h-4"/> Filter Kategori <ChevronDownIcon size={16} className={`transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`}/>
              </button>
          </div>

          {/* Categories Navigation - Desktop (Sticky) & Mobile (Toggle) */}
          <div className={`lg:sticky lg:top-[64px] lg:z-20 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block mb-8`}>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div ref={categoriesNavRef}
                className="flex overflow-x-auto whitespace-nowrap hide-scrollbar cursor-grab active:cursor-grabbing select-none border-b"
                onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}
                onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}>
                {categories.map((category) => (
                  <button key={category} onClick={() => handleMainCategorySelect(category)}
                    className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none
                      ${selectedMainCategory === category ? "bg-emerald-500 text-white border-b-2 border-emerald-700" : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50 border-b-2 border-transparent"}`}>
                    {category}
                  </button>
                ))}
              </div>
              {selectedMainCategory && availableSubcategories.length > 0 && (
                <div className="p-4 bg-gray-50">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">Spesialisasi di {selectedMainCategory}</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSubcategories.map((sub) => (
                      <button key={sub} onClick={() => handleSubcategorySelect(sub)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ease-in-out border
                          ${selectedSubcategory === sub ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400"}`}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {searchQuery ? `Hasil untuk "${searchQuery}"` : selectedSubcategory || selectedMainCategory || "Semua Layanan Kreatif"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} layanan ditemukan
              </p>
            </div>
            {(selectedMainCategory || selectedSubcategory || searchQuery) && (
              <button onClick={() => { setSelectedMainCategory(""); setSelectedSubcategory(""); setSearchQuery(""); }}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
                <CloseIcon className="w-4 h-4"/> Hapus Filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border">
              <SearchIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Tidak ada yang cocok.</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Coba kata kunci lain, atau mungkin layanan yang Anda cari belum tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
              {filteredProducts.map((product) => {
                const seller = getSellerInfo(product.sellerId);
                return (
                  <div key={product.id}
                    className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200/80"
                    onClick={() => handleNavigateToProduct(product.id)}>
                    <div className="relative w-full h-48 cursor-pointer overflow-hidden">
                      <Image src={product.image || '/placeholder-image.png'} alt={product.title} layout="fill"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png';}} />
                      <div className="absolute top-2 right-2">
                        <button aria-label="Favoritkan" className="p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-100/80 transition-colors">
                            <HeartIcon className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        {seller && (
                            <Link href={`/sellerstore/${seller.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 mb-2 group/seller-link">
                                <Image src={seller.profilePictureUrl || '/profile-placeholder.png'} alt={seller.username} width={24} height={24} className="w-6 h-6 rounded-full object-cover"/>
                                <span className="text-xs font-medium text-gray-600 group-hover/seller-link:text-emerald-600 group-hover/seller-link:underline line-clamp-1" title={seller.storeName || seller.username}>
                                    {seller.storeName || seller.username}
                                </span>
                            </Link>
                        )}
                        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1.5 line-clamp-2 h-10 cursor-pointer hover:text-emerald-700 transition-colors">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                            <StarIcon className="w-3.5 h-3.5 fill-current"/>
                            <span className="font-semibold text-yellow-600">{product.rating || 'Baru'}</span>
                            {product.reviewCount !== undefined && <span className="text-gray-400">({product.reviewCount})</span>}
                        </div>
                        <div className="mt-auto pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Mulai dari</div>
                                <div className="text-md font-bold text-emerald-600">{formatPrice(product.price)}</div>
                            </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExplorePage;