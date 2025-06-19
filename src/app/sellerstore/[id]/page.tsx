// src/app/sellerstore/[id]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    StarIcon, MapPinIcon, PhoneIcon, HeartIcon,
    ArrowLeftIcon, PackageIcon, UsersIcon, AwardIcon,
    FilterIcon, ChevronDownIcon, GridIcon, ListIcon // Ikon tambahan
} from 'lucide-react';
import NotificationModal, { ModalButton } from '@/components/NotificationModal';

// Definisikan tipe Product (pastikan konsisten di seluruh aplikasi)
type Product = {
    id: string; title: string; price: string | number; image: string | null; images?: string[];
    category: string; subcategory: string; description: string;
    deliveryTime?: string | number; revisions?: string | number;
    includedItems?: string[]; requirements?: string[];
    sellerId?: string; // PENTING untuk menampilkan info author/seller
    rating?: number;
    reviewCount?: number;
};

// Definisikan tipe UserData (pastikan konsisten di seluruh aplikasi)
type UserData = {
    id: string; username: string; email: string; role: 'buyer' | 'seller';
    fullName?: string; profilePictureUrl?: string; storeName?: string;
    bio?: string;
    phoneNumber?: string;
    address?: string; // Contoh: Alamat penjual
};

interface ModalStateType {
    isOpen: boolean; title: string; message: React.ReactNode;
    type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
    buttons: ModalButton[]; onClose?: () => void;
}

const SellerStorePage = () => {
    const params = useParams();
    const sellerId = params.id as string;
    const [seller, setSeller] = useState<UserData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [modalState, setModalState] = useState<ModalStateType>({
        isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
    });
    const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

    // State untuk filter dan sorting
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('default');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        const storedUsers = localStorage.getItem('registeredUsers');
        const storedProducts = localStorage.getItem('products');

        if (storedUsers && storedProducts) {
            try {
                const users: UserData[] = JSON.parse(storedUsers);
                const foundSeller = users.find((user) => user.id === sellerId && user.role === 'seller');
                if (foundSeller) {
                    setSeller(foundSeller);
                    const allProducts: Product[] = JSON.parse(storedProducts);
                    const sellerProducts = allProducts.filter((product) => product.sellerId === sellerId);
                    setProducts(sellerProducts);
                } else {
                    setModalState({ isOpen: true, title: "Penjual Tidak Ditemukan", message: "Penjual dengan ID ini tidak ditemukan.", type: 'error', buttons: [{ text: "Kembali", onClick: () => router.back() }], onClose: () => router.back() });
                }
            } catch (error) {
                console.error('Error parsing data:', error);
                setModalState({ isOpen: true, title: "Error Data", message: "Gagal memuat data.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
            }
        } else {
            setModalState({ isOpen: true, title: "Data Tidak Lengkap", message: "Data pengguna atau produk tidak tersedia.", type: 'warning', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
        }
        setLoading(false);
    }, [sellerId, router]);

    // Effect untuk filtering dan sorting
    useEffect(() => {
        let tempProducts = [...products]; // Salin array agar tidak memutasi state asli

        // Filter by category
        if (categoryFilter !== 'all') {
            tempProducts = tempProducts.filter(p => p.category === categoryFilter);
        }

        // Sort products
        switch (sortBy) {
            case 'price-asc':
                tempProducts.sort((a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price)));
                break;
            case 'price-desc':
                tempProducts.sort((a, b) => parseFloat(String(b.price)) - parseFloat(String(a.price)));
                break;
            case 'newest':
                // Asumsi ada createdAt di produk, jika tidak, bisa dilewatkan
                tempProducts.sort((a, b) => {
                    // Anda mungkin perlu menambahkan `createdAt` ke tipe Product
                    // untuk sorting berdasarkan tanggal pembuatan asli.
                    // Untuk demo, kita bisa gunakan ID atau sekadar tidak melakukan sorting jika tidak ada tanggal.
                    return 0;
                });
                break;
            case 'rating':
                tempProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                // Do nothing for 'default' or if sort criteria not met
                break;
        }
        setFilteredAndSortedProducts(tempProducts);
    }, [products, categoryFilter, sortBy]);

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price.replace(/\D/g, '')) : price;
        if (isNaN(numPrice)) return "Harga Tdk Valid";
        return numPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const handleNavigateToProduct = (id: string) => router.push(`/product/${id}`);

    const allCategories = Array.from(new Set(products.map(p => p.category)));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="ml-3 text-gray-700 text-lg">Memuat toko penjual...</p>
            </div>
        );
    }

    if (!seller) {
        return (
            <>
                <NotificationModal {...modalState} />
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <p className="text-gray-700">Penjual tidak ditemukan atau ada masalah data.</p>
                </div>
            </>
        );
    }

    // Statistik dummy untuk penjual (bisa dihitung dari data produk dan order di masa nyata)
    const totalProductsCount = products.length;
    const averageRating = products.length > 0
        ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
        : 'N/A';
    const totalReviewCount = products.reduce((sum, p) => sum + (p.reviewCount || 0), 0);

    return (
        <>
            <NotificationModal {...modalState} />
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-100 min-h-screen selection:bg-emerald-500 selection:text-white">
                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Tombol Kembali */}
                    <div className="mb-6 flex justify-start">
                        <button onClick={() => router.back()} className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium group bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                            <ArrowLeftIcon className="w-5 h-5 mr-1.5 transition-transform group-hover:-translate-x-0.5"/>
                            Kembali
                        </button>
                    </div>

                    {/* Header Informasi Penjual */}
                    <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 md:p-10 mb-8 border border-gray-200/80">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-emerald-300 shadow-md">
                                <Image
                                    src={seller.profilePictureUrl || '/profile-placeholder.png'}
                                    alt={`Foto profil ${seller.storeName || seller.fullName || seller.username}`}
                                    width={160}
                                    height={160}
                                    className="object-cover w-full h-full"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/profile-placeholder.png'; }}
                                />
                            </div>
                            <div className="text-center sm:text-left flex-grow">
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight mb-2">
                                    {seller.storeName || seller.fullName || seller.username}
                                </h1>
                                <p className="text-md text-gray-600 leading-relaxed max-w-xl mx-auto sm:mx-0">
                                    {seller.bio || 'Penjual ini belum mengisi bio. Jelajahi karyanya di bawah!'}
                                </p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-4 text-sm text-gray-700">
                                    {seller.address && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPinIcon className="w-4 h-4 text-emerald-500" />
                                            {seller.address}
                                        </div>
                                    )}
                                    {seller.phoneNumber && (
                                        <div className="flex items-center gap-1.5">
                                            <PhoneIcon className="w-4 h-4 text-emerald-500" />
                                            {seller.phoneNumber}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter dan Sorting Produk */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Semua Produk Penjual</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
                                >
                                    <FilterIcon size={16}/>
                                    Filter & Urutkan
                                    <ChevronDownIcon size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}/>
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-10 py-1">
                                        <p className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold border-b">Filter Kategori</p>
                                        <button
                                            onClick={() => { setCategoryFilter('all'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${categoryFilter === 'all' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                            Semua Kategori
                                        </button>
                                        {allCategories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => { setCategoryFilter(cat); setShowFilterDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${categoryFilter === cat ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                                {cat}
                                            </button>
                                        ))}
                                        <p className="px-4 py-2 text-xs text-gray-500 uppercase font-semibold border-t mt-2">Urutkan Berdasarkan</p>
                                        <button
                                            onClick={() => { setSortBy('newest'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'newest' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                            Terbaru
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('rating'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'rating' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                            Rating Terbaik
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('price-asc'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'price-asc' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                            Harga: Termurah
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('price-desc'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === 'price-desc' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                            Harga: Termahal
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Daftar Produk Penjual */}
                    {filteredAndSortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAndSortedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200/80 transform hover:-translate-y-1"
                                    onClick={() => handleNavigateToProduct(product.id)}
                                >
                                    <div className="relative w-full h-48 cursor-pointer overflow-hidden">
                                        <Image
                                            src={product.image || '/placeholder-image.png'}
                                            alt={product.title}
                                            layout="fill"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <button aria-label="Favoritkan" className="p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-500 hover:text-pink-500 hover:bg-pink-100/80 transition-colors">
                                                <HeartIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1.5 line-clamp-2 h-10 cursor-pointer hover:text-emerald-700 transition-colors">
                                            {product.title}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                                            <StarIcon className="w-3.5 h-3.5 fill-current" />
                                            <span className="font-semibold text-yellow-600">{product.rating || 'Baru'}</span>
                                            {product.reviewCount !== undefined && (
                                                <span className="text-gray-400">({product.reviewCount})</span>
                                            )}
                                        </div>
                                        <div className="mt-auto pt-2 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">Mulai dari</div>
                                                <div className="text-md font-bold text-emerald-600">{formatPrice(product.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow-md border">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {seller.storeName || seller.fullName || seller.username} belum memiliki produk yang sesuai filter.
                            </h3>
                            <p className="text-gray-500">Coba ubah filter atau urutan!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SellerStorePage;