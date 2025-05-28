// src/app/profile/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
// import { showToast } from '@/components/ToastProvider'; // Ganti dengan NotificationModal
import NotificationModal, { ModalButton } from '@/components/NotificationModal'; // Import modal
import { 
    UserCircleIcon as UserIconSolid, // Ganti nama agar tidak bentrok dengan Lucide
    MailIcon as MailIconSolid, 
    BriefcaseIcon as BriefcaseIconSolid, 
    CalendarIcon as CalendarIconSolid, 
    Edit3Icon, SaveIcon, XCircleIcon, CameraIcon, UploadCloudIcon, PhoneIcon, TypeIcon, UserCheck2Icon, ShieldAlertIcon
} from 'lucide-react';

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
  storeName?: string; // Tambahkan jika relevan dari SetSellerPage
  sellerBio?: string; // Tambahkan jika relevan
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

const UserProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<UserData>>({
    fullName: '', bio: '', phoneNumber: '', username: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const storedCurrentUser = localStorage.getItem('currentUser');
    if (storedCurrentUser) {
      try { setLoggedInUser(JSON.parse(storedCurrentUser)); }
      catch (e) { console.error("Error parsing loggedInUser", e); }
    }

    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers && userId) {
      try {
        const allUsers: UserData[] = JSON.parse(storedUsers);
        const foundUser = allUsers.find(u => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
          setEditingUser({
            fullName: foundUser.fullName || '',
            bio: foundUser.bio || '',
            phoneNumber: foundUser.phoneNumber || '',
            username: foundUser.username, // Untuk ditampilkan, bukan diedit di form utama ini
            // profilePictureUrl tidak di-set di editingUser karena ditangani oleh selectedFile/imagePreviewUrl
          });
          setImagePreviewUrl(foundUser.profilePictureUrl || null);
        } else {
          setModalState({ isOpen: true, title: "Profil Tidak Ditemukan", message: "Pengguna ini tidak ada.", type: 'error', buttons: [{ text: "OK", onClick: () => { closeGenericModal(); router.push('/'); }}], onClose: () => router.push('/') });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setModalState({ isOpen: true, title: "Kesalahan Data", message: "Gagal memuat data pengguna.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
      }
    } else if (!userId) {
        setModalState({ isOpen: true, title: "ID Tidak Valid", message: "ID pengguna tidak ditemukan di URL.", type: 'error', buttons: [{ text: "OK", onClick: () => router.push('/') }], onClose: () => router.push('/') });
    }
    setIsLoading(false);
  }, [userId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // ... (validasi file tetap sama)
      if (file.size > 2 * 1024 * 1024) { 
        setModalState({isOpen:true, title:"File Terlalu Besar", message:"Maksimal ukuran file 2MB.", type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
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
      setImagePreviewUrl(user?.profilePictureUrl || null);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);

    if (editingUser.fullName && editingUser.fullName.trim().length < 3) {
      setModalState({isOpen:true, title:"Validasi Gagal", message:"Nama Lengkap minimal 3 karakter.", type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      setIsSaving(false); return;
    }
    
    let finalProfilePictureUrl = user.profilePictureUrl;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) { /* ... (error handling fetch dengan setModalState) ... */ 
            const errorText = await response.text();
            setModalState({isOpen:true, title:"Upload Gagal", message:`Server: ${response.status}. ${errorText.substring(0,100)}`, type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
            setIsSaving(false); return;
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) { /* ... (error handling non-JSON dengan setModalState) ... */
            const responseText = await response.text();
            setModalState({isOpen:true, title:"Respons API Salah", message:`Format respons tidak benar. Diterima: ${contentType}.`, type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
            setIsSaving(false); return;
        }
        const uploadResult = await response.json();
        if (uploadResult.fileUrl) {
            finalProfilePictureUrl = uploadResult.fileUrl;
        } else { throw new Error(uploadResult.error || "URL file tidak ada dari API."); }
      } catch (error: any) {
        setModalState({isOpen:true, title:"Upload Foto Gagal", message: error.message || 'Tidak dapat mengunggah foto profil.', type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        setIsSaving(false); return;
      }
    }

    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      try {
        let allUsers: UserData[] = JSON.parse(storedUsers);
        const userIndex = allUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          const updatedUserDetails: UserData = {
            ...allUsers[userIndex],
            fullName: editingUser.fullName?.trim() || allUsers[userIndex].fullName,
            bio: editingUser.bio?.trim() || allUsers[userIndex].bio,
            phoneNumber: editingUser.phoneNumber?.trim() || allUsers[userIndex].phoneNumber,
            profilePictureUrl: finalProfilePictureUrl,
             // Username tidak diubah di sini, diambil dari allUsers[userIndex].username
            username: editingUser.username || allUsers[userIndex].username,
          };
          allUsers[userIndex] = updatedUserDetails;
          localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
          setUser(updatedUserDetails);

          if (loggedInUser && loggedInUser.id === userId) {
            const { password, ...currentUserSafe } = updatedUserDetails;
            localStorage.setItem('currentUser', JSON.stringify(currentUserSafe));
            setLoggedInUser(currentUserSafe);
          }
          setModalState({isOpen:true, title:"Profil Berhasil Diupdate", message:"Informasi profil Anda telah diperbarui.", type:'success', buttons:[{text:"Selesai", onClick:closeGenericModal}], onClose:closeGenericModal});
          setIsEditMode(false);
        } else {
           setModalState({isOpen:true, title:"Kesalahan Update", message:"Pengguna tidak ditemukan untuk diupdate.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        }
      } catch (error) { /* ... (setModalState untuk error localStorage) ... */ 
        setModalState({isOpen:true, title:"Error Penyimpanan", message:"Gagal menyimpan perubahan profil.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      }
    }
    setIsSaving(false);
  };
  
  if (isLoading) { /* ... (JSX loading) ... */ 
    return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div> <p className="ml-3 text-gray-700">Memuat profil...</p> </div> );
  }
  if (!user) { /* ... (JSX user tidak ditemukan, modal sudah menghandle ini) ... */ return null; }

  const canEditProfile = loggedInUser && loggedInUser.id === userId;

  return (
    <>
      <NotificationModal {...modalState} />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-sky-100 py-10 sm:py-16 px-4 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 relative">
            {canEditProfile && !isEditMode && (
              <button
                onClick={() => {
                  setEditingUser({
                    fullName: user.fullName || '', bio: user.bio || '',
                    phoneNumber: user.phoneNumber || '', username: user.username,
                  });
                  setImagePreviewUrl(user.profilePictureUrl || null);
                  setSelectedFile(null);
                  if(fileInputRef.current) fileInputRef.current.value = "";
                  setIsEditMode(true);
                }}
                className="absolute top-5 right-5 sm:top-6 sm:right-6 bg-emerald-500 text-white p-2.5 rounded-full hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Edit Profil"
              > <Edit3Icon className="w-5 h-5" /> </button>
            )}

            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 sm:gap-8">
              <div className="relative group flex-shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-emerald-200 shadow-lg bg-gray-200">
                    <Image
                        src={imagePreviewUrl || '/profile-placeholder.png'}
                        alt="Foto Profil"
                        width={160} height={160}
                        className="object-cover w-full h-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/profile-placeholder.png'; }}
                    />
                </div>
                {isEditMode && canEditProfile && (
                  <label htmlFor="profilePictureUpload" className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-emerald-600 transition ring-2 ring-white" title="Ubah Foto Profil">
                    <CameraIcon className="w-5 h-5" />
                    <input type="file" id="profilePictureUpload" name="profilePicture" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                  </label>
                )}
              </div>
              
              <div className={`text-center sm:text-left flex-grow mt-2 sm:mt-0 ${isEditMode ? 'w-full' : ''}`}>
                {isEditMode && canEditProfile ? (
                  <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
                        <input type="text" name="fullName" id="fullName" value={editingUser.fullName || ''} onChange={handleInputChange} placeholder="Nama Lengkap Anda"
                            className="w-full text-lg p-2.5 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
                    </div>
                     <p className="text-md text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md inline-block">@{user.username} <span className="text-xs text-gray-500">(tidak bisa diubah)</span></p>
                    <div>
                        <label htmlFor="bio" className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                        <textarea name="bio" id="bio" value={editingUser.bio || ''} onChange={handleInputChange} placeholder="Sedikit tentang Anda..." rows={3}
                            className="w-full text-sm p-2.5 border border-gray-300 rounded-md resize-none focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-600 mb-1">Nomor Telepon</label>
                        <input type="tel" name="phoneNumber" id="phoneNumber" value={editingUser.phoneNumber || ''} onChange={handleInputChange} placeholder="Nomor HP aktif"
                            className="w-full text-sm p-2.5 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"/>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-0.5">{user.fullName || user.username}</h1>
                    <p className="text-md sm:text-lg text-emerald-600 mb-3">@{user.username}</p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg">{user.bio || (canEditProfile ? "Bio Anda masih kosong. Klik tombol edit untuk menambahkan." : "Pengguna ini belum menulis bio.")}</p>
                    {user.phoneNumber && <p className="text-sm text-gray-500 mt-3 flex items-center justify-center sm:justify-start gap-1.5"><PhoneIcon className="w-4 h-4 text-gray-400"/> {user.phoneNumber}</p>}
                  </>
                )}
              </div>
            </div>

            {isEditMode && canEditProfile && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={() => setIsEditMode(false)}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium order-2 sm:order-1 text-sm">
                  <XCircleIcon className="w-5 h-5" /> Batal
                </button>
                <button onClick={handleSaveChanges} disabled={isSaving}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition font-medium shadow-md hover:shadow-lg order-1 sm:order-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                  {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> : <SaveIcon className="w-5 h-5" />}
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            )}
          </div>

          {!isEditMode && (
            <div className="mt-8 bg-white shadow-xl rounded-2xl p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4">Detail Informasi Akun</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-sm">
                <div className="flex items-start gap-3 p-3.5 bg-gray-50/70 rounded-lg border border-gray-200/80">
                  <MailIconSolid className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div> <p className="text-xs text-gray-500">Email</p> <p className="font-medium text-gray-700">{user.email}</p> </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50/70 rounded-lg border border-gray-200/80">
                  <BriefcaseIconSolid className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div> <p className="text-xs text-gray-500">Peran</p> <p className="font-medium text-gray-700 capitalize">{user.role}</p> </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-gray-50/70 rounded-lg border border-gray-200/80">
                  <CalendarIconSolid className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div> <p className="text-xs text-gray-500">Bergabung Sejak</p> <p className="font-medium text-gray-700">{new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p> </div>
                </div>
                 {user.role === 'seller' && user.storeName && (
                    <div className="flex items-start gap-3 p-3.5 bg-gray-50/70 rounded-lg border border-gray-200/80">
                        <UserCheck2Icon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div> <p className="text-xs text-gray-500">Nama Toko</p> <p className="font-medium text-gray-700">{user.storeName}</p> </div>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;