// src/components/NavIcons.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import NotificationModal, { ModalButton } from '@/components/NotificationModal'; // Pastikan path ini benar
import { 
    StoreIcon, 
    UserCircleIcon as LucideUserCircleIcon, // Ganti nama agar tidak bentrok dengan Heroicons jika ada
    LogOutIcon, 
    Edit3Icon, 
    ShoppingCartIcon, 
    LogInIcon,
    ListOrderedIcon // Ikon baru untuk Orders
} from "lucide-react";

type CurrentUser = {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller';
  fullName?: string;
  profilePictureUrl?: string;
};

// Tipe untuk state modal (pastikan message bisa React.ReactNode jika diperlukan)
interface ModalStateType {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[];
  onClose?: () => void;
}

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showBecomeSellerModal, setShowBecomeSellerModal] = useState(false);

  const [logoutModalState, setLogoutModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info',
    buttons: [], onClose: undefined,
  });

  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing currentUser:", error);
        setCurrentUser(null);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileToggle = () => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsProfileOpen(false);
    setLogoutModalState(prev => ({ ...prev, isOpen: false }));
    
    setLogoutModalState({
        isOpen: true,
        title: "Logout Berhasil",
        message: "Anda telah keluar dari akun. Anda akan diarahkan ke halaman registrasi.",
        type: 'success',
        buttons: [{ text: "OK", onClick: () => {
            setLogoutModalState(prev => ({ ...prev, isOpen: false }));
            router.push("/register");
        }}],
        onClose: () => { 
            setLogoutModalState(prev => ({ ...prev, isOpen: false }));
            router.push("/register");
        }
    });
  };
  
  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setLogoutModalState({
        isOpen: true,
        title: "Konfirmasi Logout",
        message: "Apakah Anda yakin ingin keluar dari akun Anda?",
        type: "confirmation",
        buttons: [
            { text: "Tidak", onClick: () => setLogoutModalState(prev => ({ ...prev, isOpen: false })), className: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'},
            { text: "Iya, Logout", onClick: confirmLogout, className: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'}
        ],
        onClose: () => setLogoutModalState(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleSellerAccessClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (currentUser) {
      if (currentUser.role === 'seller') {
        router.push('/seller');
      } else {
        setIsProfileOpen(false);
        setShowBecomeSellerModal(true); 
      }
    } else {
      router.push('/login'); 
    }
  };

  const profileImageSrc = currentUser?.profilePictureUrl || "/profile.png";
  let sellerButtonText = "Mulai Berjualan!";
  if (currentUser?.role === 'seller') {
    sellerButtonText = "Toko Saya";
  }

  return (
    <>
      <NotificationModal {...logoutModalState} />
      <NotificationModal
        isOpen={showBecomeSellerModal}
        title="Ingin Mulai Berjualan?"
        message="Anda saat ini terdaftar sebagai pembeli. Tingkatkan akun Anda untuk mulai menawarkan jasa dan produk kreatif Anda di Lumora!"
        type="confirmation"
        buttons={[
            { text: "Nanti Saja", onClick: () => setShowBecomeSellerModal(false), className: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'},
            { text: "Ya, Daftar Jadi Penjual", onClick: () => {
                setShowBecomeSellerModal(false);
                if (currentUser) router.push(`/setseller/${currentUser.id}`);
            }, className: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500' }
        ]}
        onClose={() => setShowBecomeSellerModal(false)}
        icon={<StoreIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4 p-2 bg-emerald-100 rounded-full" />}
      />

      <div className="flex items-center gap-3 sm:gap-4 xl:gap-5 relative">
        {/* Tombol Mulai Berjualan / Toko Saya */}
        {currentUser ? (
          <Link
              href={currentUser.role === 'seller' ? "/seller" : (currentUser ? `/setseller/${currentUser.id}` : "/login")}
              onClick={handleSellerAccessClick}
              className="hidden md:flex items-center gap-1.5 mr-1 text-white font-medium px-3 py-1.5 rounded-lg shadow hover:shadow-md transition-all text-xs sm:text-sm"
              style={{ background: currentUser.role === 'seller' ? "linear-gradient(to right, #34D399, #10B981)" : "linear-gradient(to right, #6CB5AF, #5A9E97)" }} > {/* Warna disesuaikan */}
              <StoreIcon className="w-4 h-4" />
              {sellerButtonText}
          </Link>
        ) : (
          <button onClick={handleSellerAccessClick}
              className="hidden md:flex items-center gap-1.5 mr-1 text-white font-medium px-3 py-1.5 rounded-lg shadow hover:shadow-md transition-all text-xs sm:text-sm"
              style={{ background: "linear-gradient(to right, #6CB5AF, #5A9E97)" }} >
              <StoreIcon className="w-4 h-4" />
              Mulai Berjualan!
          </button>
        )}

        {/* URUTAN IKON BARU: Cart, Orders, Profile */}
        <Link href="/cart" aria-label="Keranjang Belanja" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <ShoppingCartIcon className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
        </Link>

        {/* Ikon Orders (Baru) - Hanya tampil jika sudah login */}
        {currentUser && (
            <Link href="/orders" aria-label="Pesanan Saya" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <ListOrderedIcon className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
            </Link>
        )}
        
        {/* Ikon Customer Service (opsional, bisa dihilangkan jika tidak mau) */}
        {/* <Link href="/customerservice" aria-label="Layanan Pelanggan" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <MessageSquareIcon className="w-5 h-5 text-gray-600 hover:text-emerald-600" />
        </Link> */}

        <div className="relative" ref={profileRef}>
          {currentUser ? (
            <div 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-emerald-500 transition-all"
              onClick={handleProfileToggle}
            >
              <Image
                src={profileImageSrc}
                alt="Profil Pengguna"
                width={36} 
                height={36}
                className="object-cover w-full h-full"
                onError={(e) => { (e.target as HTMLImageElement).src = '/profile.png'; }}
              />
            </div>
          ) : (
             <button
               onClick={() => router.push('/login')}
               className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors"
             >
               <LogInIcon className="w-4 h-4"/>
               Login
             </button>
          )}

          {isProfileOpen && currentUser && (
            <div className="absolute p-2 rounded-lg top-full mt-2 right-0 min-w-[220px] bg-white text-sm shadow-xl border border-gray-100 z-20">
              <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                <p className="font-semibold text-gray-800 truncate" title={currentUser.fullName || currentUser.username}>
                  {currentUser.fullName || currentUser.username}
                </p>
                <p className="text-xs text-gray-500 truncate" title={currentUser.email}>
                  {currentUser.email}
                </p>
              </div>
              <ul className="space-y-0.5">
                {currentUser.role === 'seller' && (
                  <li> <Link href="/seller" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"> <StoreIcon className="w-5 h-5 text-gray-500" /> Toko Saya </Link> </li>
                )}
                <li> <Link href={`/profile/${currentUser.id}`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-100 rounded-md text-gray-700 transition-colors"> <Edit3Icon className="w-5 h-5 text-gray-500" /> Edit Profile </Link> </li>
                <li> <button onClick={handleLogoutClick} className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 rounded-md text-red-600 transition-colors"> <LogOutIcon className="w-5 h-5" /> Log Out </button> </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavIcons;