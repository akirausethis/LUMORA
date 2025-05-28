// src/app/addpost/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
// Hapus impor toast
// import { toast } from 'react-toastify';
// Hapus impor CheckCircleIcon dari Heroicons jika tidak digunakan lagi setelah mengganti toast
// import { CheckCircleIcon } from '@heroicons/react/solid';
import NotificationModal, { ModalButton } from '@/components/NotificationModal'; // Impor modal dan tipenya
import {
    UploadCloudIcon, ImageIcon, TagIcon, UserIcon as LucideUserIcon,
    TypeIcon, SendIcon, XIcon as LucideXIcon, ArrowLeftIcon, Loader2Icon, Edit3Icon
} from 'lucide-react'; // Pastikan semua ikon yang dibutuhkan ada di sini

// Tipe untuk PortfolioPost
interface PortfolioPost {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  description: string;
  images: string[]; // Array URL gambar dari server
  category: string;
  createdAt: string;
}

// Tipe CurrentUser
type CurrentUser = {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller';
  fullName?: string;
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

export default function AddPostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: CurrentUser = JSON.parse(storedUser);
        setCurrentUser(user);
        setAuthor(user.fullName || user.username || '');
      } catch (e) {
        console.error("Gagal parse currentUser untuk AddPostPage:", e);
        setModalState({isOpen:true, title:"Sesi Tidak Valid", message:"Silakan login kembali untuk membuat post.", type:"error", buttons: [{text: "Login", onClick: ()=>{closeGenericModal(); router.push('/login')}}], onClose: ()=>{closeGenericModal(); router.push('/login')}});
      }
    } else {
      setModalState({isOpen:true, title:"Akses Ditolak", message:"Anda harus login untuk membuat post.", type:"warning", buttons: [{text: "Login", onClick: ()=>{closeGenericModal(); router.push('/login')}}], onClose: ()=>{closeGenericModal(); router.push('/login')}});
    }
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const currentImagesCount = images.length;
      const filesToUpload = Array.from(e.target.files);
      const validFiles = filesToUpload.filter(file => {
          if (file.size > 5 * 1024 * 1024) { // 5MB
            setModalState({isOpen:true, title:"File Terlalu Besar", message:`File "${file.name}" melebihi batas 5MB.`, type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
            return false;
          }
          const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!validImageTypes.includes(file.type)) {
            setModalState({isOpen:true, title:"Tipe File Salah", message:`File "${file.name}" bukan format gambar yang didukung.`, type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
            return false;
          }
          return true;
      });
      const newImagesToAdd = validFiles.slice(0, Math.min(5 - currentImagesCount, validFiles.length));
      if (currentImagesCount + newImagesToAdd.length > 5 && validFiles.length > 0) {
        setModalState({isOpen:true, title:"Batas Maksimal Gambar", message:"Anda hanya bisa mengunggah total 5 gambar.", type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        const spaceLeft = 5 - currentImagesCount;
        setImages((prevImages) => [...prevImages, ...newImagesToAdd.slice(0, spaceLeft)]);
        return;
      }
      if (newImagesToAdd.length > 0) {
        setImages((prevImages) => [...prevImages, ...newImagesToAdd]);
      }
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        setModalState({isOpen: true, title: "Aksi Gagal", message: "Sesi Anda tidak valid. Silakan login kembali.", type: "error", buttons: [{text:"Login", onClick: () => {closeGenericModal(); router.push('/login');}}], onClose: () => {closeGenericModal(); router.push('/login');}});
        return;
    }
    let validationMessage = "";
    if (!title.trim()) validationMessage += "Nama karya tidak boleh kosong.\n";
    if (!author.trim()) validationMessage += "Nama author tidak boleh kosong.\n";
    if (!category.trim()) validationMessage += "Kategori karya tidak boleh kosong.\n";
    if (!description.trim()) validationMessage += "Deskripsi karya tidak boleh kosong.\n";
    if (images.length === 0) validationMessage += "Mohon unggah setidaknya satu gambar.\n";

    if (validationMessage) {
        setModalState({isOpen:true, title:"Data Belum Lengkap", message: validationMessage.trim(), type:'warning', buttons:[{text:"Saya Mengerti", onClick:closeGenericModal}], onClose:closeGenericModal});
        return;
    }
    setIsSubmitting(true);
    const uploadedImageUrls: string[] = [];
    try {
      for (const imageFile of images) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `Gagal unggah ${imageFile.name}` }));
          throw new Error(errorData.error);
        }
        const result = await response.json();
        if (result.fileUrl) {
          uploadedImageUrls.push(result.fileUrl);
        } else {
          throw new Error(`URL file tidak ada di respons API untuk ${imageFile.name}.`);
        }
      }
    } catch (uploadError: any) {
      setModalState({isOpen:true, title:"Upload Gambar Gagal", message: uploadError.message || "Terjadi kesalahan saat mengunggah gambar.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      setIsSubmitting(false); return;
    }

    const newPost: PortfolioPost = {
      id: uuidv4(), title, author: currentUser.fullName || currentUser.username,
      authorId: currentUser.id, description, images: uploadedImageUrls,
      category: category, createdAt: new Date().toISOString(),
    };

    try {
      const existingPosts = JSON.parse(localStorage.getItem('designerPosts') || '[]');
      localStorage.setItem('designerPosts', JSON.stringify([...existingPosts, newPost]));
      setModalState({
        isOpen: true, title: "Publikasi Berhasil!", message: "Karya Anda telah berhasil ditambahkan ke portofolio.", type: 'success',
        buttons: [{text:"Lihat Portofolio", onClick: () => {closeGenericModal(); router.push('/portfolio');}}],
        onClose: () => {closeGenericModal(); router.push('/portfolio');}
      });
      setTitle(''); setCategory(''); setDescription(''); setImages([]);
    } catch (error) {
      setModalState({isOpen:true, title:"Gagal Publikasi", message:"Terjadi kesalahan saat menyimpan karya Anda.", type:'error', buttons:[{text:"Coba Lagi", onClick:closeGenericModal}], onClose:closeGenericModal});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NotificationModal {...modalState} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-100 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
        <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 -left-20 w-72 h-72 md:w-96 md:h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
            <div className="absolute top-20 -right-20 w-72 h-72 md:w-96 md:h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
            <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 text-gray-800">
              <div className="absolute top-6 left-6 z-20 lg:hidden">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors bg-white/50 backdrop-blur-sm p-2 rounded-full shadow">
                        <ArrowLeftIcon className="w-5 h-5" /> 
                    </button>
                </div>
              <div className="text-center lg:text-left max-w-lg mt-16 lg:mt-0">
                  <div className="mb-8">
                    <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-emerald-700 text-sm font-medium mb-6 border border-emerald-200/80 shadow-sm">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 animate-pulse"></span>
                        Bagikan Karyamu!
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                        Publikasikan{' '}
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        Inspirasimu!
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                        Ini adalah panggungmu! Unggah karya desain, ilustrasi, atau proyek kreatif lainnya dan biarkan dunia melihat bakatmu.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 text-gray-700">
                    <div className="flex items-center"> <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mr-3 shadow"> <UploadCloudIcon className="w-5 h-5 text-white" /> </div> <span>Unggah Mudah & Cepat</span> </div>
                    <div className="flex items-center"> <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow"> <ImageIcon className="w-5 h-5 text-white" /> </div> <span>Bangun Portofolio</span> </div>
                  </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
              <div className="w-full max-w-xl">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 p-6 sm:p-8 md:p-10">
                    <div className="text-center mb-8">
                        <Edit3Icon className="w-12 h-12 text-emerald-500 mx-auto mb-3 p-2 bg-emerald-100 rounded-full"/>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1.5">
                        Buat Postingan Karya Baru
                        </h2>
                        <p className="text-gray-500 text-sm">
                        Isi detail karyamu di bawah ini.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label htmlFor="addpost-title" className="block text-sm font-medium text-gray-700 mb-1.5">Judul Karya <span className="text-red-500">*</span></label>
                          <div className="relative">
                              <TypeIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                              <input type="text" id="addpost-title" value={title} onChange={(e) => setTitle(e.target.value)}
                              className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-gray-400 text-sm"
                              placeholder="Contoh: Ilustrasi Pemandangan Senja" required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                              <label htmlFor="addpost-author" className="block text-sm font-medium text-gray-700 mb-1.5">Nama Kreator</label>
                              <div className="relative">
                                  <LucideUserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                  <input type="text" id="addpost-author" value={author} onChange={(e) => setAuthor(e.target.value)}
                                  className="w-full pl-10 pr-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700" 
                                  placeholder="Nama Anda atau tim" required readOnly={!!currentUser?.username} />
                              </div>
                          </div>
                          <div>
                              <label htmlFor="addpost-category" className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Karya <span className="text-red-500">*</span></label>
                              <div className="relative">
                                  <TagIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                  <input type="text" id="addpost-category" value={category} onChange={(e) => setCategory(e.target.value)}
                                  className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-gray-400 text-sm"
                                  placeholder="Misal: Ilustrasi, Desain Karakter" required />
                              </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="addpost-description" className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Karya <span className="text-red-500">*</span></label>
                          <textarea id="addpost-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                              className="w-full px-3.5 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-gray-400 resize-none text-sm"
                              placeholder="Ceritakan lebih detail tentang karyamu..." required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Gambar Karya (Maks. 5, @5MB/gambar) <span className="text-red-500">*</span></label>
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
                                {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                                    {images.map((img, index) => (
                                    <div key={index} className="relative group aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden shadow-sm">
                                        <Image src={URL.createObjectURL(img)} alt={`Preview ${index + 1}`} fill className="object-cover group-hover:opacity-75 transition-opacity" />
                                        <button type="button" onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs">
                                        <LucideXIcon className="w-4 h-4"/>
                                        </button>
                                    </div>
                                    ))}
                                </div>
                                )}
                                {images.length < 5 && (
                                <label htmlFor="addpost-imageUpload" className="cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-lg p-6 text-center transition-colors bg-white hover:bg-emerald-50/50">
                                    <UploadCloudIcon className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-emerald-500" />
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">
                                        {images.length === 0 ? 'Pilih Gambar Utama' : 'Tambah Gambar Lain'} ({images.length}/5)
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP hingga 5MB</p>
                                    </div>
                                    <input id="addpost-imageUpload" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} ref={imageUploadRef} />
                                </label>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-5">
                        <button type="button" onClick={() => router.push('/portfolio')}
                            className="flex-1 order-2 sm:order-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-200 text-sm">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="flex-1 order-1 sm:order-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl">
                            {isSubmitting ? ( <Loader2Icon className="w-5 h-5 animate-spin" /> ) : ( <SendIcon className="w-5 h-5" /> )}
                            {isSubmitting ? "Memproses..." : "Publikasikan Karya"}
                        </button>
                        </div>
                    </form>
                  </div>
              </div>
            </div>
        </div>
        <style jsx>{`
            @keyframes blob { 0% {transform: translate(0px, 0px) scale(1);} 33% {transform: translate(30px, -50px) scale(1.1);} 66% {transform: translate(-20px, 20px) scale(0.9);} 100% {transform: translate(0px, 0px) scale(1);} }
            .animate-blob { animation: blob 10s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55); }
            .animation-delay-2000 { animation-delay: -3s; }
            .animation-delay-4000 { animation-delay: -5s; }
        `}</style>
      </div>
    </>
  );
}