// src/app/addproduct/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Impor Heroicons (coba path ini, jika masih error, pastikan library terinstal dengan benar)
import {
    PlusCircleIcon as HeroPlusCircleIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    InformationCircleIcon as HeroInfoIcon
} from "@heroicons/react/outline"; // Path umum untuk v1 atau v2 (jika /24/outline tidak ada)

// Impor Lucide Icons
import {
    CheckCircleIcon as LucideCheckCircleIcon,
    FileTextIcon, SettingsIcon, ListChecksIcon, ImageIcon as GalleryIcon,
    TagIcon, DollarSignIcon, ClockIcon, RefreshCwIcon, PackageCheckIcon,
    HelpCircleIcon, XIcon, UploadCloudIcon, Loader2Icon,
    TypeIcon
} from "lucide-react";

// Tipe ProductToAdd
type ProductToAdd = {
  id: string; title: string; price: string; image: string | null; images?: string[];
  category: string; subcategory: string; description: string;
  deliveryTime?: string | number; revisions?: string | number;
  includedItems?: string[]; requirements?: string[]; tags?: string[]; sellerId?: string;
};
// Tipe CurrentUser
type CurrentUser = {
  id: string; username: string; email: string; role: 'buyer' | 'seller';
};

const AddProductPage = () => {
  const router = useRouter();
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [currentTab, setCurrentTab] = useState("overview");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [revisions, setRevisions] = useState<string | number>("0");
  const [includedItems, setIncludedItems] = useState<string[]>([""]);
  const [requirementsQuestions, setRequirementsQuestions] = useState<string[]>([""]);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const imageUploadRef = useRef<HTMLInputElement>(null);

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
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser: CurrentUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        if (parsedUser.role !== 'seller') {
            toast.warn("Hanya seller yang dapat mengakses halaman ini. Anda akan diarahkan.");
            router.push('/');
        }
      } catch (e) {
        toast.error("Sesi tidak valid, silakan login kembali.");
        router.push('/login');
      }
    } else {
      toast.error("Anda harus login untuk menambahkan produk.");
      router.push('/login');
    }

    if (selectedCategory && subcategoriesMap[selectedCategory]) {
      setAvailableSubcategories(subcategoriesMap[selectedCategory]);
    } else {
      setAvailableSubcategories([]);
    }
    if (selectedSubcategory && (!subcategoriesMap[selectedCategory] || !subcategoriesMap[selectedCategory].includes(selectedSubcategory))) {
      setSelectedSubcategory("");
    }
  }, [selectedCategory, router, selectedSubcategory]);

  const isOverviewComplete = !!(productTitle.trim() && selectedCategory && selectedSubcategory && description.trim());
  const isDetailsComplete = !!(deliveryTime.trim() && (revisions !== "" && revisions !== undefined));
  const isGalleryComplete = images.length > 0 && !!productPrice.trim();


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter( (file) => file.size <= 5 * 1024 * 1024 );
       if (filesArray.length === 0 && e.target.files.length > 0) { toast.error("Semua file yang dipilih melebihi batas 5MB."); return; }
      if (images.length + filesArray.length > 5) { toast.error("Maksimal 5 gambar yang bisa diunggah."); return; }
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };
  const handleRemoveImage = (index: number) => setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    } else if (tags.length >= 5) {
      toast.warn("Maksimal 5 tag.")
    }
  };
  const handleRemoveTag = (tagToRemove: string) => setTags(tags.filter((tag) => tag !== tagToRemove));
  const handleAddIncludedItem = () => { if (includedItems.length < 5) setIncludedItems([...includedItems, ""]); else toast.warn("Maksimal 5 poin termasuk.");};
  const handleUpdateIncludedItem = (index: number, value: string) => { const ni = [...includedItems]; ni[index] = value; setIncludedItems(ni);};
  const handleRemoveIncludedItem = (index: number) => setIncludedItems(includedItems.filter((_, i) => i !== index));
  const handleAddRequirementQuestion = () => { if (requirementsQuestions.length < 3) setRequirementsQuestions([...requirementsQuestions, ""]); else toast.warn("Maksimal 3 pertanyaan persyaratan."); };
  const handleUpdateRequirementQuestion = (index: number, value: string) => { const nq = [...requirementsQuestions]; nq[index] = value; setRequirementsQuestions(nq);};
  const handleRemoveRequirementQuestion = (index: number) => setRequirementsQuestions(requirementsQuestions.filter((_, i) => i !== index));

  const handlePublish = async () => {
    if (!currentUser) { toast.error("Sesi tidak valid."); router.push('/login'); return; }
    if (currentUser.role !== 'seller') { toast.warn("Hanya seller yang bisa tambah produk."); return; }

    if (!isOverviewComplete || !isDetailsComplete || !isGalleryComplete) {
      toast.error("Harap lengkapi semua informasi wajib di setiap tab sebelum menerbitkan.");
      if (!isOverviewComplete) setCurrentTab("overview");
      else if (!isDetailsComplete) setCurrentTab("details");
      else if (!isGalleryComplete) setCurrentTab("gallery");
      return;
    }
    setIsUploading(true);
    const uploadedImageUrls: string[] = [];
    try {
        for (const imageFile of images) {
            const formData = new FormData(); formData.append('file', imageFile);
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({error: "Upload error"}));
                throw new Error(errorData.error || `Gagal unggah ${imageFile.name}`);
            }
            const result = await response.json();
            if(result.fileUrl) uploadedImageUrls.push(result.fileUrl);
            else throw new Error("URL file tidak ada di respons API upload.");
        }
    } catch (uploadError: any) {
        toast.error(`Upload gambar gagal: ${uploadError.message}`);
        setIsUploading(false);
        return;
    }

    const productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const product: ProductToAdd = {
      id: productId, title: productTitle, price: productPrice, image: uploadedImageUrls[0] || null, images: uploadedImageUrls,
      category: selectedCategory, subcategory: selectedSubcategory, description: description, deliveryTime: deliveryTime, revisions: revisions,
      includedItems: includedItems.filter(item => item.trim() !== ''), requirements: requirementsQuestions.filter(req => req.trim() !== ''),
      tags: tags, sellerId: currentUser.id,
    };
    const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
    localStorage.setItem("products", JSON.stringify([...existingProducts, product]));
    setIsUploading(false);
    toast.success("Produk berhasil diterbitkan!");
    router.push("/seller");
  };

  const getTabIcon = (tabKey: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      overview: <FileTextIcon className="w-5 h-5" />,
      details: <SettingsIcon className="w-5 h-5" />,
      requirements: <ListChecksIcon className="w-5 h-5" />,
      gallery: <GalleryIcon className="w-5 h-5" />,
    };
    return icons[tabKey] || null;
  };

  const getCompletionStatus = (tabKey: string): boolean => {
    switch (tabKey) {
      case "overview": return isOverviewComplete;
      case "details": return isDetailsComplete;
      case "requirements": return true;
      case "gallery": return isGalleryComplete;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-100 selection:bg-emerald-500 selection:text-white">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4 shadow-lg">
             <HeroPlusCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-2">
            Tambahkan Produk Baru
          </h1>
          <p className="text-gray-600 text-lg">Publikasikan layanan terbaikmu dan jangkau klien potensial!</p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/70 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 md:p-8">
            {/* ... (Progress Steps JSX - pastikan ikon menggunakan className untuk size) ... */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center max-w-full mx-auto">
              {[
                { key: "overview", label: "Ikhtisar Produk", step: 1 },
                { key: "details", label: "Detail Layanan", step: 2 },
                { key: "requirements", label: "Kebutuhan Klien", step: 3 },
                { key: "gallery", label: "Galeri & Harga", step: 4 }
              ].map((tabItem, index, arr) => (
                <React.Fragment key={tabItem.key}>
                  <button onClick={() => setCurrentTab(tabItem.key)}
                    className={`group flex items-center space-x-2 md:space-x-3 transition-all duration-300 ${ currentTab === tabItem.key ? "text-white" : "text-emerald-100 hover:text-white opacity-70 hover:opacity-100" }`}>
                    <div className={`relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 ${
                      currentTab === tabItem.key ? "bg-white text-emerald-600 border-white shadow-lg scale-110"
                      : getCompletionStatus(tabItem.key) ? "bg-green-400/80 text-white border-green-300/70" 
                      : "border-emerald-200/50 text-emerald-100 group-hover:border-white group-hover:text-white" }`}>
                      {getCompletionStatus(tabItem.key) && currentTab !== tabItem.key ? (
                         <LucideCheckCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
                      ) : ( <span className="font-bold text-sm">{getTabIcon(tabItem.key) || tabItem.step}</span> )}
                    </div>
                    <div className="text-left"> <div className={`text-xs md:text-sm font-medium transition-colors duration-300`}>Langkah {tabItem.step}</div> <div className={`hidden sm:block text-sm md:text-base font-semibold transition-colors duration-300`}>{tabItem.label}</div> </div>
                  </button>
                  {index < arr.length - 1 && ( <div className={`hidden md:block flex-grow h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${ getCompletionStatus(tabItem.key) ? "bg-green-300/70" : "bg-emerald-200/40" }`} /> )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="p-6 md:p-8 lg:p-10">
            {currentTab === "overview" && (
              <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                <div> <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><FileTextIcon className="w-4 h-4 mr-2 text-emerald-600"/>Judul Produk <span className="text-red-500 ml-1">*</span></label> <input type="text" id="productTitle" value={productTitle} onChange={(e) => setProductTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-sm" placeholder="Contoh: Desain Logo Profesional untuk Startup Kuliner"/> </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div> <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><ListChecksIcon className="w-4 h-4 mr-2 text-emerald-600"/>Kategori Utama <span className="text-red-500 ml-1">*</span></label> <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"> <option value="">-- Pilih Kategori --</option> {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))} </select> </div>
                    <div> <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><ListChecksIcon className="w-4 h-4 mr-2 text-emerald-600"/>Sub-kategori <span className="text-red-500 ml-1">*</span></label> <select id="subcategory" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} disabled={!selectedCategory || availableSubcategories.length === 0} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm disabled:bg-gray-100"> <option value="">-- Pilih Sub-kategori --</option> {availableSubcategories.map((sub) => (<option key={sub} value={sub}>{sub}</option>))} </select> </div>
                </div>
                <div> <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"> <TypeIcon className="w-4 h-4 mr-2 text-emerald-600"/> Deskripsi Produk <span className="text-red-500 ml-1">*</span> </label> <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 resize-none text-sm" placeholder="Jelaskan secara detail layanan yang Anda tawarkan..."></textarea> </div>
                <div className="flex justify-end pt-6"> <button onClick={() => setCurrentTab("details")} disabled={!isOverviewComplete} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"> Lanjut ke Detail <ChevronRightIcon className="w-5 h-5"/> </button> </div>
              </div>
            )}
            {currentTab === "details" && ( <div className="space-y-6 animate-in slide-in-from-right-5 duration-300"> <div className="text-center mb-8"> <h2 className="text-2xl font-bold text-gray-800 mb-1">Detail Layanan</h2> <p className="text-gray-600 text-sm">Spesifikasi waktu, revisi, dan apa saja yang termasuk.</p> </div> <div className="grid md:grid-cols-2 gap-6"> <div> <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><ClockIcon className="w-4 h-4 mr-2 text-emerald-600"/>Waktu Pengerjaan (hari) <span className="text-red-500 ml-1">*</span></label> <input type="number" id="deliveryTime" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} min="1" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-sm" placeholder="Contoh: 3"/> </div> <div> <label htmlFor="revisions" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><RefreshCwIcon className="w-4 h-4 mr-2 text-emerald-600"/>Jumlah Revisi <span className="text-red-500 ml-1">*</span></label> <select id="revisions" value={String(revisions)} onChange={(e) => setRevisions(e.target.value === "unlimited" ? "unlimited" : parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"> <option value="0">0 Kali</option> <option value="1">1 Kali</option> <option value="2">2 Kali</option> <option value="3">3 Kali</option> <option value="5">5 Kali</option> <option value="unlimited">Tak Terbatas</option> </select> </div> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><PackageCheckIcon className="w-4 h-4 mr-2 text-emerald-600"/>Yang Termasuk dalam Layanan (Maks. 5)</label> <div className="space-y-2.5"> {includedItems.map((item, index) => ( <div key={index} className="flex items-center gap-2"> <input type="text" value={item} onChange={(e) => handleUpdateIncludedItem(index, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-sm" placeholder={`Poin ${index + 1} (mis: File master AI/PSD)`}/> {includedItems.length > 1 && ( <button type="button" onClick={() => handleRemoveIncludedItem(index)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"> <XIcon className="w-[18px] h-[18px]"/> </button> )} </div> ))} {includedItems.length < 5 && ( <button type="button" onClick={handleAddIncludedItem} className="w-full mt-2 text-sm text-emerald-600 border-2 border-dashed border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50 rounded-lg py-2.5 flex items-center justify-center gap-1.5 transition-colors"> <HeroPlusCircleIcon className="w-4 h-4"/> Tambah Poin </button> )} </div> </div> <div className="flex justify-between pt-6"> <button onClick={() => setCurrentTab("overview")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-base"><ChevronLeftIcon className="w-5 h-5"/> Kembali</button> <button onClick={() => setCurrentTab("requirements")} disabled={!isDetailsComplete} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"> Lanjut <ChevronRightIcon className="w-5 h-5"/> </button> </div> </div> )}
            {currentTab === "requirements" && ( <div className="space-y-6 animate-in slide-in-from-right-5 duration-300"> <div className="text-center mb-8"> <h2 className="text-2xl font-bold text-gray-800 mb-1">Kebutuhan dari Klien</h2> <p className="text-gray-600 text-sm">Informasi apa saja yang Anda perlukan?</p> </div> <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-lg text-sm text-sky-700 flex items-start gap-2"> <HeroInfoIcon className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5"/> <div><strong className="font-medium">Tips:</strong> Ajukan pertanyaan yang jelas dan spesifik.</div></div> <div> <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><HelpCircleIcon className="w-4 h-4 mr-2 text-emerald-600"/>Pertanyaan untuk Klien (Maks. 3)</label> <div className="space-y-2.5"> {requirementsQuestions.map((req, index) => ( <div key={index} className="flex items-center gap-2"> <input type="text" value={req} onChange={(e) => handleUpdateRequirementQuestion(index, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-sm" placeholder={`Pertanyaan ${index + 1}`}/> {requirementsQuestions.length > 1 && ( <button type="button" onClick={() => handleRemoveRequirementQuestion(index)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"> <XIcon className="w-[18px] h-[18px]"/> </button> )} </div> ))} {requirementsQuestions.length < 3 && ( <button type="button" onClick={handleAddRequirementQuestion} className="w-full mt-2 text-sm text-emerald-600 border-2 border-dashed border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50 rounded-lg py-2.5 flex items-center justify-center gap-1.5 transition-colors"> <HeroPlusCircleIcon className="w-4 h-4"/> Tambah Pertanyaan </button> )} </div> </div> <div className="flex justify-between pt-6"> <button onClick={() => setCurrentTab("details")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-base"><ChevronLeftIcon className="w-5 h-5"/> Kembali</button> <button onClick={() => setCurrentTab("gallery")} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-base"> Lanjut ke Galeri <ChevronRightIcon className="w-5 h-5"/> </button> </div> </div> )}
            {currentTab === "gallery" && ( <div className="space-y-6 animate-in slide-in-from-right-5 duration-300"> <div className="text-center mb-8"> <h2 className="text-2xl font-bold text-gray-800 mb-1">Galeri Karya & Harga</h2> <p className="text-gray-600 text-sm">Pamerkan contoh karyamu dan tentukan harganya.</p> </div> <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-start"> <div className="space-y-6"> <div> <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><DollarSignIcon className="w-4 h-4 mr-2 text-emerald-600"/>Harga Produk (IDR) <span className="text-red-500 ml-1">*</span></label> <div className="relative"> <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none text-sm">Rp</span> <input type="number" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} min="10000" step="1000" className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-sm" placeholder="Contoh: 500000"/> </div> </div> <div> <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><TagIcon className="w-4 h-4 mr-2 text-emerald-600"/>Tag Pencarian (Maks. 5)</label> <div className="flex flex-wrap gap-2 mb-2"> {tags.map((tag) => ( <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"> {tag} <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 -mr-0.5 text-emerald-500 hover:text-emerald-700"> <XIcon className="w-[12px] h-[12px]"/> </button> </span> ))} </div> {tags.length < 5 && ( <div className="flex gap-2"> <input type="text" id="tagInput" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag();}}} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-sm" placeholder="Tambah tag..."/> <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-semibold transition-colors">Tambah</button> </div> )} <p className="text-xs text-gray-500 mt-1">Pisahkan dengan enter atau klik tambah.</p> </div> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"><GalleryIcon className="w-4 h-4 mr-2 text-emerald-600"/>Gambar Produk (Maks. 5) <span className="text-red-500 ml-1">*</span></label> <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3"> {images.map((file, index) => ( <div key={index} className="relative aspect-w-1 aspect-h-1 border-2 border-gray-200 rounded-lg overflow-hidden group/image hover:border-emerald-400 transition-colors shadow-sm"> <Image src={URL.createObjectURL(file)} alt={`Preview ${index+1}`} layout="fill" className="object-cover group-hover/image:scale-105 transition-transform"/> <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-colors flex items-center justify-center"> {index === 0 && (<span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">Utama</span>)} <button type="button" onClick={() => handleRemoveImage(index)} className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover/image:opacity-100 transform scale-75 group-hover/image:scale-100" aria-label="Hapus"> <XIcon className="w-[14px] h-[14px]"/> </button> </div> </div> ))} {images.length < 5 && ( <label htmlFor="imageUploadInput" className="flex flex-col items-center justify-center aspect-w-1 aspect-h-1 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all p-2 text-center"> <UploadCloudIcon className="w-8 h-8 text-gray-400 group-hover/upload:text-emerald-500 mb-1"/> <span className="text-xs font-medium text-gray-600 group-hover/upload:text-emerald-600"> {images.length === 0 ? 'Unggah Gambar Utama' : 'Tambah Lagi'} </span> <span className="text-[10px] text-gray-400">Max 5MB</span> <input id="imageUploadInput" type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} ref={imageUploadRef}/> </label> )} </div> <p className="text-xs text-gray-500 flex items-center"><HeroInfoIcon className="w-[13px] h-[13px] mr-1 text-gray-400"/> Gambar pertama jadi thumbnail utama.</p> </div> </div> <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4"> <button onClick={() => setCurrentTab("requirements")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors text-base"><ChevronLeftIcon className="w-5 h-5"/> Kembali</button> <button onClick={handlePublish} disabled={!isGalleryComplete || isUploading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"> {isUploading ? <Loader2Icon className="w-5 h-5 animate-spin mr-2"/> : <LucideCheckCircleIcon className="w-5 h-5 mr-1.5"/>} {isUploading ? "Menerbitkan..." : "Terbitkan Produk"} </button> </div> </div> )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;