// src/app/setprofile/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
// Hapus import showToast jika sudah diganti semua
// import { showToast } from '@/components/ToastProvider'; 
import NotificationModal, { ModalButton } from '@/components/NotificationModal'; // Import modal
import { 
    UserIcon as LucideUserIcon, // Ganti nama jika ada konflik dengan Heroicons
    MailIcon as LucideMailIcon, 
    PhoneIcon, TypeIcon, CameraIcon, SaveIcon, UploadCloudIcon, SmileIcon, CheckSquareIcon, 
    Link
} from 'lucide-react';

// Tipe UserData (pastikan konsisten)
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
};

// Tipe untuk state modal
interface ModalStateType {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[];
  onClose?: () => void;
}

const SetProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [initialUserData, setInitialUserData] = useState<Partial<UserData>>({});
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    phoneNumber: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingProfilePictureUrl, setExistingProfilePictureUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (userId) {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        try {
          const allUsers: UserData[] = JSON.parse(storedUsers);
          const foundUser = allUsers.find(u => u.id === userId);
          if (foundUser) {
            setInitialUserData({
              username: foundUser.username, email: foundUser.email,
              password: foundUser.password, role: foundUser.role,
              createdAt: foundUser.createdAt,
            });
            setProfileData({
              fullName: foundUser.fullName || '', bio: foundUser.bio || '',
              phoneNumber: foundUser.phoneNumber || '',
            });
            if (foundUser.profilePictureUrl) {
              setExistingProfilePictureUrl(foundUser.profilePictureUrl);
              setImagePreviewUrl(foundUser.profilePictureUrl);
            }
          } else {
            setModalState({isOpen:true, title:"Pengguna Tidak Ditemukan", message:"Tidak dapat memuat data untuk pengaturan profil.", type:'error', buttons:[{text:"Ke Registrasi", onClick: () => {closeGenericModal(); router.push('/register')}}], onClose:() => router.push('/register')});
          }
        } catch (error) {
          setModalState({isOpen:true, title:"Kesalahan Data", message:"Gagal memuat data pengguna.", type:'error', buttons:[{text:"Ke Registrasi", onClick:() => {closeGenericModal(); router.push('/register')}}], onClose:() => router.push('/register')});
        }
      } else {
        setModalState({isOpen:true, title:"Data Tidak Tersedia", message:"Tidak ada data pengguna terdaftar.", type:'error', buttons:[{text:"Ke Registrasi", onClick:() => {closeGenericModal(); router.push('/register')}}], onClose:() => router.push('/register')});
      }
      setIsLoading(false);
    } else {
        setIsLoading(false);
        setModalState({isOpen:true, title:"ID Tidak Valid", message:"ID Pengguna tidak ditemukan di URL.", type:'error', buttons:[{text:"Ke Registrasi", onClick:() => {closeGenericModal(); router.push('/register')}}], onClose:() => router.push('/register')});
    }
  }, [userId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setModalState({isOpen:true, title:"File Terlalu Besar", message:"Maksimal ukuran file adalah 2MB.", type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        if(fileInputRef.current) fileInputRef.current.value = ""; return;
      }
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setModalState({isOpen:true, title:"Tipe File Salah", message:"Hanya gambar (JPEG, PNG, GIF, WebP) yang diizinkan.", type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        if(fileInputRef.current) fileInputRef.current.value = ""; return;
      }
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(existingProfilePictureUrl || null);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    if (!profileData.fullName.trim()) {
      setModalState({isOpen:true, title:"Nama Lengkap Wajib Diisi", message:"Mohon masukkan nama lengkap Anda.", type:'warning', buttons:[{text:"Mengerti", onClick:closeGenericModal}], onClose:closeGenericModal});
      setIsSaving(false); return;
    }

    let finalProfilePictureUrl: string | undefined | null = existingProfilePictureUrl;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error (SetProfilePage):", response.status, errorText.substring(0,300));
          setModalState({isOpen:true, title:"Upload Gagal", message:`Gagal unggah foto profil. Server: ${response.status}.`, type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
          setIsSaving(false); return;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text();
          console.error("API Non-JSON (SetProfilePage):", responseText.substring(0,300));
          setModalState({isOpen:true, title:"Respons API Salah", message:`Format respons dari server upload tidak benar.`, type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
          setIsSaving(false); return;
        }
        const uploadResult = await response.json();
        if (uploadResult.fileUrl) {
            finalProfilePictureUrl = uploadResult.fileUrl;
        } else { throw new Error(uploadResult.error || "URL file tidak ditemukan dari API."); }
      } catch (error: any) {
        setModalState({isOpen:true, title:"Upload Foto Gagal", message: error.message || 'Tidak dapat mengunggah foto profil.', type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        setIsSaving(false); return;
      }
    }

    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers && initialUserData.username && initialUserData.email) {
      try {
        let allUsers: UserData[] = JSON.parse(storedUsers);
        let userToUpdateIndex = allUsers.findIndex(u => u.id === userId);
        if (userToUpdateIndex !== -1) {
          const updatedUser: UserData = {
            ...allUsers[userToUpdateIndex],
            username: initialUserData.username!,
            email: initialUserData.email!,
            fullName: profileData.fullName,
            bio: profileData.bio,
            phoneNumber: profileData.phoneNumber,
            profilePictureUrl: finalProfilePictureUrl === null ? undefined : finalProfilePictureUrl,
          };
          allUsers[userToUpdateIndex] = updatedUser;
          localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
          const { password, ...currentUserSafe } = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(currentUserSafe));
          
          setModalState({isOpen:true, title:"Profil Berhasil Disimpan!", message:"Selamat datang di Lumora! Akun Anda sudah siap.", type:'success', buttons:[{text:"Mulai Jelajahi", onClick:() => {closeGenericModal(); router.push('/')}}], onClose: () => router.push('/') });
        } else {
          setModalState({isOpen:true, title:"Kesalahan Update", message:"Gagal menemukan pengguna untuk diperbarui.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        }
      } catch (error) {
        setModalState({isOpen:true, title:"Error Penyimpanan Lokal", message:"Gagal menyimpan profil.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      } finally {
        // setIsSaving(false); // Jangan set false jika sudah redirect
      }
    } else {
      setModalState({isOpen:true, title:"Kesalahan Data Internal", message:"Data pengguna awal tidak lengkap.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      setIsSaving(false);
    }
  };

  if (isLoading) { /* ... (JSX loading) ... */ 
    return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div> <p className="ml-3 text-gray-700">Memuat...</p> </div> );
  }
  if (!initialUserData.username) { /* Jika data awal tidak termuat (sudah dihandle modal) */ return null; }


  return (
    <>
      <NotificationModal {...modalState} />
      <div className="min-h-screen flex selection:bg-emerald-500 selection:text-white">
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-12 relative overflow-hidden">
          {/* ... (Branding Section Kiri tetap sama) ... */}
          <div className="absolute -top-16 -right-20 w-72 h-72 bg-white/5 rounded-full animate-pulse animation-delay-4000"></div>
          <div className="absolute -bottom-24 -left-10 w-80 h-80 bg-white/5 rounded-full animation-delay-2000 animate-pulse"></div>
          <div className="text-center z-10">
            <h1 className="text-5xl font-bold mb-4 leading-tight">Satu Langkah Lagi!</h1>
            <p className="text-lg text-teal-100 max-w-md mx-auto">
                Lengkapi profil Anda untuk pengalaman terbaik di Lumora. Tunjukkan siapa Anda kepada dunia!
            </p>
            <CheckSquareIcon className="w-24 h-24 text-teal-300 mx-auto mt-10 opacity-60" />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 md:p-10 lg:p-12">
          <div className="w-full max-w-lg space-y-5 bg-white p-8 md:p-10 rounded-2xl shadow-xl">
            {/* ... (Form Section Kanan tetap sama, pastikan semua panggilan showToast diganti dengan setModalState) ... */}
            <div className="text-center lg:hidden">
                <Link href="/" className="inline-block mb-4">
                  <Image src="/logo.png" alt="Lumora Logo" width={40} height={40} />
                </Link>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Lengkapi Profil Anda</h2>
              <p className="text-gray-500 mt-1">Informasi ini akan membantu orang lain mengenal Anda.</p>
            </div>
            
            <div className="p-3.5 bg-gray-100 rounded-lg border border-gray-200 text-sm space-y-1">
              <div className="flex items-center">
                  <LucideUserIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"/> 
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium text-gray-800 ml-1 truncate" title={initialUserData.username}>{initialUserData.username}</span>
              </div>
              <div className="flex items-center">
                  <LucideMailIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"/>
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800 ml-1 truncate" title={initialUserData.email}>{initialUserData.email}</span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Profil (Opsional, Max 2MB)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100 flex-shrink-0">
                    {imagePreviewUrl ? (
                      <Image src={imagePreviewUrl} alt="Preview" width={96} height={96} className="object-cover w-full h-full" />
                    ) : ( <CameraIcon className="w-10 h-10 text-gray-400" /> )}
                  </div>
                  <div className="flex-grow w-full sm:w-auto">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 bg-white text-emerald-600 px-4 py-2.5 rounded-lg border border-emerald-600 hover:bg-emerald-50 transition text-sm font-medium">
                        <UploadCloudIcon className="w-5 h-5" /> 
                        {selectedFile ? selectedFile.name.substring(0,20) + (selectedFile.name.length > 20 ? "..." : "") : "Pilih Gambar"}
                      </button>
                      <input type="file" id="profilePictureFile" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      {selectedFile && ( <button type="button" onClick={() => { setSelectedFile(null); setImagePreviewUrl(existingProfilePictureUrl || null); if(fileInputRef.current) fileInputRef.current.value = "";}} 
                                className="text-xs text-red-500 hover:text-red-700 mt-1.5 text-left w-full sm:w-auto"> Hapus pilihan gambar </button> )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                <div className="relative">
                  <LucideUserIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input id="fullName" name="fullName" type="text" required value={profileData.fullName} onChange={handleInputChange}
                    className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm"
                    placeholder="Nama lengkap Anda" />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Telepon (Opsional)</label>
                <div className="relative">
                  <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input id="phoneNumber" name="phoneNumber" type="tel" value={profileData.phoneNumber} onChange={handleInputChange}
                    className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-sm"
                    placeholder="Contoh: 08123456xxxx" />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">Bio Singkat (Opsional)</label>
                <div className="relative">
                  <TypeIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows={3}
                    className="w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none placeholder-gray-400 text-sm"
                    placeholder="Cerita singkat tentang Anda, keahlian, atau minat..." />
                </div>
              </div>
              
              <button type="submit" disabled={isSaving || isLoading}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3.5 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm">
                {isSaving ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2.5"></div>Menyimpan...</>) 
                : (<div className="flex items-center gap-2"><SaveIcon size={18}/>SIMPAN PROFIL & MULAI</div>)}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Ingin melengkapi nanti?{' '}
              <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                Lewati & Lanjut ke Beranda
              </Link>
              <span className="block text-xs mt-1">(Anda bisa melengkapi profil kapan saja)</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetProfilePage;