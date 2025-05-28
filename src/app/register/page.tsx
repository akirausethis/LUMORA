// src/app/register/page.tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { UserPlusIcon, UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, RocketIcon } from 'lucide-react';
import NotificationModal, { ModalButton } from '@/components/NotificationModal'; // Import modal dan tipenya

// Tipe UserData (pastikan konsisten)
type UserData = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
  createdAt: string;
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
};

// Tipe untuk state errors
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Tipe untuk state modal
interface ModalStateType {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[];
  onClose?: () => void;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) { // Type assertion
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) { newErrors.username = 'Username wajib diisi.'; }
    else if (formData.username.length < 3) { newErrors.username = 'Username minimal 3 karakter.'; }
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) { newErrors.username = 'Username hanya boleh berisi huruf, angka, dan underscore.';}

    if (!formData.email.trim()) { newErrors.email = 'Email wajib diisi.'; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Format email tidak valid.'; }

    if (!formData.password) { newErrors.password = 'Password wajib diisi.'; }
    else if (formData.password.length < 6) { newErrors.password = 'Password minimal 6 karakter.'; }

    if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Konfirmasi password tidak cocok.'; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const proceedWithRegistration = () => {
    setIsLoading(true);
    // Simulasi delay untuk efek loading
    setTimeout(() => {
      try {
        const existingUsers: UserData[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (existingUsers.some(user => user.email === formData.email)) {
          setModalState({
            isOpen: true, title: 'Registrasi Gagal', message: 'Email yang Anda masukkan sudah terdaftar.\nSilakan gunakan email lain.', type: 'error',
            buttons: [{ text: 'Mengerti', onClick: closeGenericModal }], onClose: closeGenericModal
          });
          setIsLoading(false); return;
        }
        if (existingUsers.some(user => user.username === formData.username)) {
           setModalState({
            isOpen: true, title: 'Registrasi Gagal', message: 'Username yang Anda pilih sudah digunakan.\nSilakan pilih username lain.', type: 'error',
            buttons: [{ text: 'Mengerti', onClick: closeGenericModal }], onClose: closeGenericModal
          });
          setIsLoading(false); return;
        }

        const newUserId = uuidv4();
        const newUser: UserData = {
          id: newUserId, username: formData.username.trim(), email: formData.email.trim(),
          password: formData.password, role: 'buyer', createdAt: new Date().toISOString(),
          fullName: '', bio: '', phoneNumber: '', profilePictureUrl: '',
        };
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

        setModalState({
          isOpen: true, title: 'Registrasi Berhasil!', message: 'Akun Anda telah berhasil dibuat.\nAnda akan diarahkan untuk melengkapi profil.', type: 'success',
          buttons: [{ text: 'Lengkapi Profil', onClick: () => router.push(`/setprofile/${newUserId}`) }],
          // onClose bisa di-set jika ingin ada cara lain menutup selain tombol utama
        });
      } catch (error) {
        console.error("Error saving user:", error);
        setModalState({
          isOpen: true, title: 'Error Sistem', message: 'Terjadi kesalahan internal saat mendaftar.\nSilakan coba lagi nanti.', type: 'error',
          buttons: [{ text: 'Tutup', onClick: closeGenericModal }], onClose: closeGenericModal
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Penundaan 1 detik untuk simulasi
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(Boolean).join('\n') || 'Mohon periksa kembali semua field yang wajib diisi dan pastikan formatnya benar.';
      setModalState({
        isOpen: true, title: 'Informasi Belum Lengkap!', message: errorMessages, type: 'warning',
        buttons: [{ text: 'Saya Mengerti', onClick: closeGenericModal }], onClose: closeGenericModal
      });
      return;
    }

    setModalState({
      isOpen: true, title: 'Konfirmasi Data Registrasi',
      message: `Username: ${formData.username}\nEmail: ${formData.email}\n\nApakah Anda sudah yakin dengan informasi ini?`,
      type: 'confirmation',
      buttons: [
        { text: 'Saya Mau Cek Lagi', onClick: closeGenericModal, className: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400' },
        { text: 'Iya, Saya Yakin & Daftar', onClick: () => {
            setModalState(prev => ({ ...prev, isOpen: false })); // Tutup modal konfirmasi dulu
            proceedWithRegistration();
          }, className: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500'
        }
      ],
      onClose: closeGenericModal
    });
  };

  return (
    <>
      <NotificationModal {...modalState} />
      <div className="min-h-screen flex selection:bg-emerald-500 selection:text-white">
        {/* Bagian Kiri - Teks Selamat Datang / Branding */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-12 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-20 -right-16 w-72 h-72 bg-white/5 rounded-full animation-delay-3000 animate-pulse"></div>
            <div className="text-center z-10">
            <h1 className="text-5xl font-bold mb-4 leading-tight">Mulai Perjalanan Kreatifmu</h1>
            <p className="text-lg text-emerald-100 max-w-md mx-auto">
                Daftar di Lumora dan temukan peluang tak terbatas untuk berkarya dan berkolaborasi.
            </p>
            <RocketIcon className="w-24 h-24 text-emerald-300 mx-auto mt-10 opacity-60" />
            </div>
        </div>

        {/* Bagian Kanan - Form Registrasi */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 md:p-10 lg:p-12">
            <div className="w-full max-w-md space-y-5 bg-white p-8 md:p-10 rounded-2xl shadow-xl">
                <div className="text-center lg:hidden">
                    <Link href="/" className="inline-block mb-4">
                        <Image src="/logo.png" alt="Lumora Logo" width={40} height={40} />
                    </Link>
                </div>
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Buat Akun Baru</h2>
                    <p className="text-gray-500 mt-1">Gratis dan hanya butuh beberapa langkah!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username-reg" className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                        <div className="relative">
                        <UserIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input id="username-reg" name="username" type="text" autoComplete="username" required value={formData.username} onChange={handleInputChange}
                            className={`w-full pl-11 pr-3 py-3 border ${errors.username ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm`}
                            placeholder="Pilih username unik Anda" />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                    </div>
                    <div>
                        <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Email</label>
                        <div className="relative">
                        <MailIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input id="email-reg" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange}
                            className={`w-full pl-11 pr-3 py-3 border ${errors.email ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm`}
                            placeholder="contoh@email.com" />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password-reg" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                        <LockIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input id="password-reg" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={handleInputChange}
                            className={`w-full pl-11 pr-10 py-3 border ${errors.password ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm`}
                            placeholder="Minimal 6 karakter" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 h-full px-1">
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword-reg" className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
                        <div className="relative">
                        <LockIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input id="confirmPassword-reg" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.confirmPassword} onChange={handleInputChange}
                            className={`w-full pl-11 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm`}
                            placeholder="Ulangi password Anda" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 h-full px-1">
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" disabled={isLoading}
                        className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3.5 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                        {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2.5"></div>Mendaftar...</>) : 
                        (<div className="flex items-center gap-2"><UserPlusIcon size={18}/>DAFTAR & LANJUT ISI PROFIL</div>)}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-8">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                    Masuk di sini
                </Link>
                </p>
            </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;