// src/app/login/page.tsx
"use client";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, LogInIcon, ZapIcon } from "lucide-react";
import NotificationModal, { ModalButton } from '@/components/NotificationModal'; // Import modal dan tipenya

// Tipe UserData (pastikan konsisten)
type UserData = {
  id: string;
  username: string;
  email: string;
  password?: string; // Diambil dari registeredUsers untuk verifikasi
  role: 'buyer' | 'seller';
  createdAt: string;
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
};

// Tipe untuk state modal
interface ModalStateType {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[];
  onClose?: () => void;
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPasswordState] = useState(''); // Ganti nama state agar tidak bentrok dengan prop
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Ganti nama state
  const router = useRouter();

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    buttons: [],
    onClose: undefined,
  });

  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.trim() || !password) {
      setModalState({
        isOpen: true, title: 'Input Tidak Lengkap', message: 'Email dan password wajib diisi untuk login.', type: 'warning',
        buttons: [{ text: 'Mengerti', onClick: closeGenericModal }], onClose: closeGenericModal
      });
      setIsLoading(false);
      return;
    }

    // Simulasi delay
    setTimeout(() => {
        try {
        const existingUsers: UserData[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const foundUser = existingUsers.find(
            (user) => user.email === email && user.password === password // Verifikasi password dari registeredUsers
        );

        if (foundUser) {
            const { password: _, ...userToStore } = foundUser; // Hapus password sebelum simpan ke currentUser
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            
            setModalState({
            isOpen: true, title: 'Login Berhasil!',
            message: `Selamat datang kembali, ${foundUser.username}!\nAnda akan diarahkan ke halaman utama.`,
            type: 'success',
            buttons: [{ text: 'Lanjutkan ke Beranda', onClick: () => {
                setModalState(prev => ({ ...prev, isOpen: false }));
                router.push('/');
            }}],
            // onClose tidak perlu jika tombol sudah handle
            });
        } else {
            setModalState({
            isOpen: true, title: 'Login Gagal', message: 'Kombinasi email atau password yang Anda masukkan salah.\nSilakan periksa kembali.', type: 'error',
            buttons: [{ text: 'Coba Lagi', onClick: closeGenericModal }], onClose: closeGenericModal
            });
        }
        } catch (error) {
        console.error("Error during login:", error);
        setModalState({
            isOpen: true, title: 'Error Sistem', message: 'Terjadi kesalahan sistem saat mencoba login.\nSilakan coba beberapa saat lagi.', type: 'error',
            buttons: [{ text: 'Tutup', onClick: closeGenericModal }], onClose: closeGenericModal
        });
        } finally {
        setIsLoading(false);
        }
    }, 1000); // Penundaan 1 detik
  };

  return (
    <>
      <NotificationModal {...modalState} />
      <div className="min-h-screen flex selection:bg-emerald-500 selection:text-white">
        {/* Bagian Kiri - Ilustrasi / Branding */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-12 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-white/5 rounded-full animation-delay-2000 animate-pulse"></div>
            <div className="text-center z-10">
            <h1 className="text-5xl font-bold mb-4 leading-tight">Selamat Datang Kembali!</h1>
            <p className="text-lg text-emerald-100 max-w-md mx-auto">
                Masuk ke akun Lumora Anda dan lanjutkan perjalanan kreatif Anda.
            </p>
            <ZapIcon className="w-24 h-24 text-emerald-300 mx-auto mt-10 opacity-50" />
            </div>
        </div>
    
        {/* Bagian Kanan - Form Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 md:p-10 lg:p-12">
            <div className="w-full max-w-md space-y-6 bg-white p-8 md:p-10 rounded-2xl shadow-xl">
            <div className="text-center lg:hidden">
            </div>
            <h2 className="text-3xl font-bold text-gray-800 text-center lg:text-left tracking-tight">Masuk ke Akun Anda</h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Email</label>
                    <div className="relative">
                        <MailIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input id="email-login" type="email" placeholder="Email Anda" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm"
                            required />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">Password</label>
                        <Link href="#" className="text-xs text-emerald-600 hover:underline hover:text-emerald-700">Lupa Password?</Link>
                    </div>
                    <div className="relative">
                        <LockIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input id="password-login" type={showPassword ? 'text' : 'password'} placeholder="Password Anda" value={password} onChange={(e) => setPasswordState(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm"
                            required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 h-full px-1">
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                    </div>
                </div>
    
                <button type="submit" disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3.5 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2.5"></div>Memproses...</>) 
                : (<div className="flex items-center gap-2"><LogInIcon size={18}/>MASUK</div>)}
                </button>
            </form>
    
            <p className="text-center text-sm text-gray-500 mt-8">
                Baru di Lumora?{' '}
                <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                Buat Akun Sekarang
                </Link>
            </p>
            </div>
        </div>
      </div>
    </>
  );
};
 
export default LoginPage;