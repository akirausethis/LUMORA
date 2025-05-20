'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

export default function AddPostPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 5 - images.length);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls: string[] = [];
    for (const imageFile of images) {
      imageUrls.push(URL.createObjectURL(imageFile));
    }

    const newPost = {
      id: uuidv4(),
      title,
      author,
      description,
      images: imageUrls, // Simpan array URL objek gambar
      category: '', // Anda bisa menambahkan input kategori jika diperlukan
      createdAt: new Date().toISOString(),
    };

    try {
      const existingPosts = JSON.parse(localStorage.getItem('designerPosts') || '[]');
      const updatedPosts = [...existingPosts, newPost];
      localStorage.setItem('designerPosts', JSON.stringify(updatedPosts));
      router.push('/portfolio');
    } catch (error) {
      console.error("Error saving post to localStorage:", error);
    }
  };

  return (
   <main className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 px-4 py-12 sm:px-6 lg:px-8">
     <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
       <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8">
         <h2 className="text-center text-3xl font-bold text-white">
           Publikasikan Karyamu!
         </h2>
         <p className="mt-2 text-center text-blue-100">
           Bagikan hasil karyamu ke orang lain
         </p>
       </div>
       
       <form className="p-8 space-y-6" onSubmit={handleSubmit}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
             <div>
               <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                 Nama Karyamu
               </label>
               <input
                 id="title"
                 name="title"
                 type="text"
                 required
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                 placeholder="Masukkan nama karyamu"
               />
             </div>
             
             <div>
               <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                 Nama Author
               </label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                   </svg>
                 </div>
                 <input
                   id="author"
                   name="author"
                   type="text"
                   required
                   value={author}
                   onChange={(e) => setAuthor(e.target.value)}
                   className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                   placeholder="Masukkan namamu"
                 />
               </div>
             </div>
             
             <div>
               <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                 Kategori
               </label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                   </svg>
                 </div>
                 <input
                   id="category"
                   name="category"
                   type="text"
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                   placeholder="Design, UI/UX, Web, dll"
                 />
               </div>
             </div>
             
             <div>
               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                 Deskripsi
               </label>
               <textarea
                 id="description"
                 name="description"
                 rows={5}
                 required
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                 placeholder="Deskripsikan karyamu"
               ></textarea>
             </div>
           </div>
           
           <div className="space-y-4">
             <div>
               <h3 className="text-lg font-medium text-gray-900 mb-3"></h3>
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <div className="grid grid-cols-2 gap-3 mb-3">
                   {images.map((img, index) => (
                     <div
                       key={index}
                       className="relative rounded-lg overflow-hidden h-32 bg-gray-100 group"
                     >
                       <Image
                         src={URL.createObjectURL(img)}
                         alt={`Uploaded ${index + 1}`}
                         className="object-cover"
                         fill
                       />
                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                         <button
                           type="button"
                           onClick={() => handleRemoveImage(index)}
                           className="bg-white text-gray-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 hover:text-red-500"
                         >
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                             <path
                               fillRule="evenodd"
                               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                               clipRule="evenodd"
                             />
                           </svg>
                         </button>
                       </div>
                     </div>
                   ))}
                   
                   {images.length < 5 && (
                     <label className="relative h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                       <div className="text-center">
                         <svg
                           className="mx-auto h-10 w-10 text-gray-400"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             strokeWidth="2"
                             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                           />
                         </svg>
                         <p className="mt-1 text-xs text-gray-500">
                           {images.length === 0 ? 'Tambah Gambar' : 'Tambah Lagi'}
                         </p>
                       </div>
                       <input
                         type="file"
                         className="hidden"
                         accept="image/*"
                         multiple
                         onChange={handleImageUpload}
                       />
                     </label>
                   )}
                 </div>
                 
                 <div className="flex items-center text-xs text-gray-500 mt-2">
                   <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                   <span>Upload sampai dengan 5 Gambar (JPEG, PNG, GIF)</span>
                 </div>
                 
                 <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                   <div 
                     className="bg-indigo-600 h-1.5 rounded-full" 
                     style={{ width: `${(images.length / 5) * 100}%` }}
                   ></div>
                 </div>
                 <div className="text-xs text-right mt-1 text-gray-500">
                   {images.length}/5 images
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         <div className="pt-5 border-t border-gray-200">
           <div className="flex justify-end space-x-3">
             <button
               type="button"
               onClick={() => router.push('/portfolio')}
               className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
             >
               Batal
             </button>
             <button
               type="submit"
               className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               Post Karyamu!
             </button>
           </div>
         </div>
       </form>
     </div>
   </main>
 );
}