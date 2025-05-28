// src/app/setseller/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { showToast } from '@/components/ToastProvider';
import { BriefcaseIcon, BanknoteIcon, ShieldCheckIcon, ArrowLeftIcon, CheckCircleIcon, StoreIcon, TypeIcon } from 'lucide-react';

// Tipe data pengguna yang akan digunakan
type UserData = {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'buyer' | 'seller';
  createdAt: string;
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  // Field spesifik seller (contoh)
  storeName?: string;
  sellerBio?: string;
  paymentInfo?: string; // (misal: nomor rekening, nama bank - disederhanakan)
};

const SetSellerProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [sellerData, setSellerData] = useState({
    storeName: '',
    sellerBio: '',
    paymentInfo: '', // Contoh sederhana
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Pastikan hanya user yang sedang login dan merupakan buyer yang bisa akses halaman ini
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: UserData = JSON.parse(storedUser);
      if (user.id !== userId || user.role === 'seller') {
        // Jika bukan user yang sama atau sudah jadi seller, redirect
        showToast('warning', 'Akses Tidak Sesuai', 'Anda sudah terdaftar sebagai penjual atau ini bukan akun Anda.');
        router.push('/');
        return;
      }
      setCurrentUserData(user);
      // Isi form dengan data yang mungkin sudah ada di profil buyer
      setSellerData(prev => ({
        ...prev,
        storeName: user.username + "'s Store", // Default store name
        sellerBio: user.bio || '', // Ambil bio buyer jika ada
      }));
    } else {
      showToast('error', 'Akses Ditolak', 'Anda harus login terlebih dahulu.');
      router.push('/login');
    }
    setIsLoading(false);
  }, [userId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setSellerData(prev => ({ ...prev, [name]: checked }));
    } else {
        setSellerData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBecomeSeller = () => {
    if (!currentUserData) return;
    setIsSaving(true);

    // Validasi
    if (!sellerData.storeName.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama Toko wajib diisi.');
      setIsSaving(false);
      return;
    }
    if (!sellerData.agreeToTerms) {
      showToast('error', 'Validasi Gagal', 'Anda harus menyetujui Syarat & Ketentuan Penjual.');
      setIsSaving(false);
      return;
    }
    // Validasi lain bisa ditambahkan (misal paymentInfo)

    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        let allUsers: UserData[] = JSON.parse(storedUsers);
        const userIndex = allUsers.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
          // Update data pengguna menjadi seller
          const updatedUser: UserData = {
            ...allUsers[userIndex],
            role: 'seller', // --- PERUBAHAN ROLE ---
            storeName: sellerData.storeName,
            sellerBio: sellerData.sellerBio,
            paymentInfo: sellerData.paymentInfo, // Simpan info pembayaran (disarankan dienkripsi di backend aslinya)
          };
          allUsers[userIndex] = updatedUser;
          localStorage.setItem('registeredUsers', JSON.stringify(allUsers));

          // Update juga currentUser di localStorage
          const { password, ...currentUserSafe } = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(currentUserSafe));
          
          showToast('success', 'Pendaftaran Penjual Berhasil!', `Selamat datang, Penjual ${updatedUser.username}!`);
          router.push('/seller'); // Arahkan ke SellerPage
        } else {
          showToast('error', 'Kesalahan', 'Gagal menemukan data pengguna.');
        }
      }
    } catch (error) {
      console.error("Error updating user to seller:", error);
      showToast('error', 'Kesalahan Sistem', 'Gagal memproses pendaftaran penjual.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="ml-3 text-gray-700">Memuat halaman pendaftaran penjual...</p>
      </div>
    );
  }

  if (!currentUserData) { // Seharusnya sudah di-handle redirect di useEffect
      return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-100 p-4 selection:bg-emerald-500 selection:text-white">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-[1.01] duration-300">
        <Link href="/" className="absolute top-6 left-6 text-gray-500 hover:text-emerald-600 transition-colors md:hidden">
            <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <div className="text-center mb-8">
          <StoreIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4 p-2 bg-emerald-100 rounded-full" />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Menjadi Penjual di Lumora</h1>
          <p className="text-gray-500 mt-2">Lengkapi informasi berikut untuk mulai menjual jasa Anda.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleBecomeSeller(); }} className="space-y-5">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Nama Toko/Jasa Anda <span className="text-red-500">*</span></label>
            <div className="relative">
              <BriefcaseIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                id="storeName" name="storeName" type="text" required
                value={sellerData.storeName} onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400"
                placeholder="Contoh: Desain Grafis Pro Kelvin"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sellerBio" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat Toko/Jasa Anda (Opsional)</label>
            <div className="relative">
              <TypeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              <textarea
                id="sellerBio" name="sellerBio" value={sellerData.sellerBio} onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none placeholder-gray-400"
                placeholder="Jelaskan keahlian atau layanan utama yang Anda tawarkan..."
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="paymentInfo" className="block text-sm font-medium text-gray-700 mb-1">Informasi Pembayaran (Contoh) <span className="text-xs text-gray-400">(untuk pencairan dana)</span></label>
            <div className="relative">
              <BanknoteIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                id="paymentInfo" name="paymentInfo" type="text"
                value={sellerData.paymentInfo} onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400"
                placeholder="Nama Bank - No. Rekening - Atas Nama"
              />
            </div>
             <p className="text-xs text-gray-400 mt-1">Demi keamanan, di aplikasi nyata info ini akan diverifikasi.</p>
          </div>

          <div className="flex items-start mt-6">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={sellerData.agreeToTerms}
                onChange={handleInputChange}
                className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                Saya menyetujui <Link href="/terms-seller" className="text-emerald-600 hover:underline">Syarat & Ketentuan Penjual</Link> Lumora. <span className="text-red-500">*</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="w-full mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3.5 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Memproses Pendaftaran...
              </>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircleIcon size={20}/>
                DAFTAR SEBAGAI PENJUAL
              </div>
            )}
          </button>
        </form>
         <p className="text-center text-sm text-gray-500 mt-8">
            Batal menjadi penjual?{' '}
            <Link href="/" className="font-medium text-gray-600 hover:text-emerald-700 hover:underline">
              Kembali ke Beranda
            </Link>
        </p>
      </div>
    </div>
  );
};

export default SetSellerProfilePage;