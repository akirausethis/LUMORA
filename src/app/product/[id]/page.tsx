// src/app/product/[id]/page.tsx
"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle, Star, ShieldCheck, MessageCircleMore,
  Truck, Repeat, Package, HelpCircle, ShoppingCartIcon as LucideShoppingCartIcon // Menggunakan ikon keranjang dari Lucide
} from "lucide-react";
import { useState, useEffect } from "react";
import NotificationModal, { ModalButton } from '@/components/NotificationModal';
// Menggunakan CheckCircleIcon dari Lucide untuk konsistensi, atau Solid jika preferensi
// import { CheckCircleIcon as SolidCheckCircleIcon } from "@heroicons/react/solid"; 

// --- START: Komponen ProductImages (tetap sama seperti sebelumnya) ---
interface ProductImagesProps {
  images: string[];
  productTitle: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, productTitle }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg shadow-inner">
        <Image src="/placeholder-image.png" alt="Tidak ada gambar" width={100} height={100} className="opacity-50" />
        <p className="text-lg ml-2">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] relative rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50">
        {selectedImage ? (
          <Image
            key={selectedImage}
            src={selectedImage}
            alt={`Gambar utama untuk ${productTitle}`}
            fill
            className="object-contain transition-opacity duration-300 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={images.indexOf(selectedImage) === 0}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; (e.target as HTMLImageElement).alt = "Gagal memuat gambar"; }}
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Image src="/placeholder-image.png" alt="Memuat gambar..." width={100} height={100} className="opacity-50" />
           </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative cursor-pointer border-2 
                ${selectedImage === imgUrl ? "border-emerald-500 ring-2 ring-emerald-500/50 shadow-md" : "border-gray-200 hover:border-gray-400"} 
                rounded-lg overflow-hidden transition-all duration-200 bg-gray-50`}
              onClick={() => setSelectedImage(imgUrl)}
            >
              <Image
                src={imgUrl}
                alt={`Thumbnail ${productTitle} ${index + 1}`}
                fill
                className="object-cover"
                sizes="112px"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = '/placeholder-thumbnail.png'; (e.target as HTMLImageElement).alt = "Gagal memuat thumbnail"; }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// --- END: Komponen ProductImages ---

type Product = {
  id: string; title: string; price: string | number;
  image: string | null; images?: string[]; category: string; subcategory: string;
  description: string; deliveryTime?: string | number; revisions?: string | number;
  includedItems?: string[]; requirements?: string[]; sellerId?: string;
};
type CartItem = Product & { quantity: number; };
interface ModalStateType {
  isOpen: boolean; title: string; message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[]; onClose?: () => void;
}

const SinglePage = () => {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1); // State untuk kuantitas di SinglePage (opsional)

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    // ... (logika useEffect untuk memuat produk tetap sama)
    if (!id) {
      setModalState({ isOpen: true, title: "Error", message: "Product ID tidak valid atau tidak tersedia.", type: 'error', buttons: [{ text: "OK", onClick: () => { closeGenericModal(); router.push('/'); }}], onClose: () => router.push('/') });
      setLoading(false); return;
    }
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      try {
        const productsList: Product[] = JSON.parse(storedProducts);
        const foundProduct = productsList.find((p) => p.id === id);
        if (foundProduct) { setProduct(foundProduct); } 
        else { setModalState({ isOpen: true, title: "Produk Tidak Ditemukan", message: `Produk dengan ID "${id}" tidak ditemukan.`, type: 'error', buttons: [{ text: "Kembali", onClick: () => { closeGenericModal(); router.back(); }}], onClose: () => router.back() }); }
      } catch (e) { setModalState({ isOpen: true, title: "Error Data", message: "Gagal memuat data produk.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal }); }
    } else { setModalState({ isOpen: true, title: "Data Produk Kosong", message: "Tidak ada data produk di penyimpanan lokal.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal }); }
    setLoading(false);
  }, [id, router]);

  const handleAddToCart = (itemToAdd: Product, qty: number = 1) => {
    const storedCart = localStorage.getItem("cart");
    let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
    const existingItemIndex = cart.findIndex((item) => item.id === itemToAdd.id);

    let modalMessage = '';
    let modalTitle = '';
    let modalType: ModalStateType['type'] = 'success';

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += qty;
      modalTitle = "Kuantitas Diperbarui!";
      modalMessage = `Kuantitas untuk **${itemToAdd.title}** di keranjang Anda telah diperbarui.`;
      modalType = 'info';
    } else {
      // Pastikan harga adalah number sebelum dimasukkan ke keranjang
      const priceAsNumber = typeof itemToAdd.price === 'string' ? parseFloat(itemToAdd.price.replace(/\D/g, '')) : itemToAdd.price;
      if (isNaN(priceAsNumber)) {
           setModalState({ isOpen: true, title: "Error Harga", message: "Harga produk tidak valid.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
           return false; // Gagal menambahkan
      }
      cart.push({ ...itemToAdd, price: priceAsNumber, quantity: qty });
      modalTitle = "Berhasil Ditambahkan!";
      modalMessage = `**${itemToAdd.title}** telah berhasil ditambahkan ke keranjang Anda.`;
      modalType = 'success';
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    
    setModalState({
        isOpen: true, title: modalTitle, message: modalMessage, type: modalType,
        buttons: [
            { text: "Lanjut Belanja", onClick: closeGenericModal, className: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400" },
            { text: "Lihat Keranjang", onClick: () => { closeGenericModal(); router.push('/cart'); }, className: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500" }
        ],
        onClose: closeGenericModal
    });
    return true; // Berhasil menambahkan
  };

  // --- FUNGSI handleBuyNow DIPERBARUI ---
  const handleBuyNow = () => {
    if (!product) {
        setModalState({ isOpen: true, title: "Gagal", message: "Produk tidak valid untuk dibeli.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
        return;
    }

    // 1. Pastikan harga produk adalah number
    const priceAsNumber = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/\D/g, '')) 
        : product.price;

    if (isNaN(priceAsNumber)) {
        setModalState({ isOpen: true, title: "Error Harga", message: "Harga produk tidak valid.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
        return;
    }

    // 2. Buat item untuk di-checkout (hanya produk ini dengan kuantitas yang dipilih, misal 1)
    const itemToCheckout: CartItem = { ...product, price: priceAsNumber, quantity: quantity }; // Gunakan state quantity

    // 3. Buat ID transaksi unik
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // 4. Simpan item ini ke localStorage dengan key untuk checkout
    // PaymentPage akan membaca dari `checkoutCart_${transactionId}`
    localStorage.setItem(`checkoutCart_${transactionId}`, JSON.stringify([itemToCheckout]));

    // 5. Kosongkan keranjang utama (opsional, tergantung alur yang diinginkan)
    // Jika "Beli Sekarang" berarti item ini saja, maka keranjang utama bisa jadi tidak perlu diubah
    // atau item ini dihapus dari keranjang utama jika sudah ada.
    // Untuk kesederhanaan, kita tidak ubah keranjang utama di sini,
    // PaymentPage akan membersihkan 'cart' setelah proses.

    // 6. Arahkan ke halaman pembayaran
    router.push(`/payment/${transactionId}`);
  };

  const formatPrice = (priceInput: string | number) => { /* ... (sama) ... */ 
    const priceNumber = typeof priceInput === 'string' ? parseFloat(priceInput.replace(/\D/g, '')) : priceInput;
    if (isNaN(priceNumber)) { return "Harga tidak valid"; }
    return priceNumber.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  if (loading) { /* ... (JSX loading) ... */ }
  if (!product && !modalState.isOpen) { /* ... (JSX produk tidak ditemukan) ... */ }
  if (!product) return null;

  const productImagesArray: string[] =
    product.images && product.images.length > 0
      ? product.images.filter(img => typeof img === 'string' && img.trim() !== '')
      : product.image && typeof product.image === 'string' && product.image.trim() !== ''
      ? [product.image]
      : [];

  return (
    <>
      <NotificationModal {...modalState} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-10 sm:py-12 bg-white my-6 sm:my-8 rounded-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="w-full lg:w-1/2 lg:sticky top-24 self-start h-max">
              <ProductImages images={productImagesArray} productTitle={product.title} />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  {product.title}
              </h1>
              <div className="flex items-baseline gap-3 mt-1">
                  <h3 className="text-xl sm:text-2xl text-gray-400 line-through font-semibold">
                    {/* Contoh harga coret */}
                    {formatPrice( (typeof product.price === 'string' ? parseFloat(product.price.replace(/\D/g, '')) : product.price) * 1.25)}
                  </h3>
                  <h2 className="font-bold text-3xl sm:text-4xl text-emerald-600">
                    {formatPrice(product.price)}
                  </h2>
              </div>
              {/* ... (Rating & Terjual JSX tetap sama) ... */}
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-b border-gray-100 py-3 my-2"> <div className="flex items-center gap-1"> <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/> <span className="font-semibold">4.8</span> <span className="text-gray-500">(251 ulasan)</span> </div> <span className="text-gray-300">|</span> <span>1.2rb+ Terjual</span> </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  {product.description || "Tidak ada deskripsi untuk produk ini."}
              </p>
              {/* ... (Kategori & Subkategori JSX tetap sama) ... */}
              <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200"> <p> <strong className="font-medium text-gray-800">Kategori:</strong>{" "} <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium"> {product.category} </span> </p> <p> <strong className="font-medium text-gray-800">Subkategori:</strong>{" "} <span className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-medium"> {product.subcategory} </span> </p> </div>
              {/* --- Akhir Opsi Kuantitas --- */}
              <div className="space-y-5 mt-3">
                  {/* ... (Detail Tambahan: Waktu Pengiriman, Revisi JSX tetap sama) ... */}
                  {product.deliveryTime && ( <div className="flex items-center gap-3 p-3 bg-blue-50/70 rounded-lg border border-blue-200"> <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" /> <div> <h4 className="font-medium text-gray-800">Estimasi Waktu Pengiriman</h4> <p className="text-gray-600 text-sm">{product.deliveryTime} hari kerja</p> </div> </div> )}
                  {product.revisions !== undefined && ( <div className="flex items-center gap-3 p-3 bg-green-50/70 rounded-lg border border-green-200"> <Repeat className="w-5 h-5 text-green-600 flex-shrink-0" /> <div> <h4 className="font-medium text-gray-800">Jumlah Revisi</h4> <p className="text-gray-600 text-sm"> {String(product.revisions).toLowerCase() === "unlimited" ? "Tidak Terbatas" : `${product.revisions} kali`} </p> </div> </div> )}
              </div>
              {product.includedItems && product.includedItems.length > 0 && ( <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"> <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3 text-md"> <Package className="w-5 h-5 text-gray-500" /> Apa Saja yang Termasuk: </h4> <ul className="list-inside list-disc space-y-1.5 pl-2 text-sm text-gray-700"> {product.includedItems.map((item, index) => ( <li key={index} className="flex items-start"> <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" /> <span>{item}</span> </li> ))} </ul> </div> )}
              {product.requirements && product.requirements.length > 0 && ( <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"> <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3 text-md"> <HelpCircle className="w-5 h-5 text-gray-500" /> Yang Dibutuhkan dari Anda: </h4> <ul className="list-inside list-disc space-y-1.5 pl-2 text-sm text-gray-700"> {product.requirements.map((req, index) => ( <li key={index} className="flex items-start"> <MessageCircleMore className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" /> <span>{req}</span> </li> ))} </ul> </div> )}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button onClick={() => product && handleAddToCart(product, quantity)}
                  className="flex-1 bg-emerald-600 text-white py-3.5 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 font-semibold text-base shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 flex items-center justify-center gap-2">
                  <LucideShoppingCartIcon className="w-5 h-5"/> {/* Ganti ikon jika perlu */}
                  Tambah ke Keranjang
                  </button>
                  <button onClick={handleBuyNow}
                  className="flex-1 border-2 border-emerald-600 text-emerald-600 py-3.5 px-6 rounded-xl hover:bg-emerald-50 transition duration-300 font-semibold text-base shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                  Beli Sekarang
                  </button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default SinglePage;