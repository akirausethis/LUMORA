// src/app/seller/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    PlusCircleIcon,
    ShoppingBagIcon,
    EditIcon,
    EyeIcon,
    DollarSignIcon,
    ArchiveIcon,
    UsersIcon
} from "lucide-react";
import NotificationModal, { ModalButton } from '@/components/NotificationModal';
import { Order } from "../payment/[id]/page";

// Tipe Product (pastikan konsisten)
type Product = {
  id: string;
  title: string;
  price: string | number;
  image: string | null;
  category: string;
  subcategory: string;
  description?: string;
  sellerId?: string;
  status?: 'active' | 'draft' | 'archived';
};

// Tipe CurrentUser (pastikan konsisten)
type CurrentUser = {
  id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller';
  fullName?: string;
  profilePictureUrl?: string;
  storeName?: string;
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

const SellerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  // State untuk statistik
  const [totalSales, setTotalSales] = useState<number>(0);
  const [uniqueCustomers, setUniqueCustomers] = useState<number>(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    let user: CurrentUser | null = null;
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (e) {
         console.error("Gagal parse currentUser di SellerPage:", e);
         setModalState({ isOpen: true, title: "Sesi Tidak Valid", message: "Terjadi kesalahan saat memuat data sesi Anda. Silakan login kembali.", type: 'error', buttons: [{ text: "Login", onClick: () => {closeGenericModal(); router.push('/login'); }}], onClose: () => {closeGenericModal(); router.push('/login'); }});
         setIsLoading(false); return;
      }
    } else {
      setModalState({ isOpen: true, title: "Akses Ditolak!", message: "Anda harus login untuk mengakses halaman ini.", type: 'warning', buttons: [{ text: "Login", onClick: () => {closeGenericModal(); router.push('/login'); }}], onClose: () => {closeGenericModal(); router.push('/login'); }});
      setIsLoading(false); return;
    }

    if (user && user.role !== 'seller') {
        setModalState({ isOpen: true, title: "Akses Ditolak", message: "Halaman ini hanya untuk penjual. Apakah Anda ingin mendaftar sebagai penjual?", type: 'confirmation',
            buttons: [
                {text: "Tidak, Kembali", onClick: () => {closeGenericModal(); router.push('/');}, className: "bg-gray-200 text-gray-700 hover:bg-gray-300"},
                {text: "Ya, Daftar Jadi Penjual", onClick: () => {closeGenericModal(); if(user) router.push(`/setseller/${user.id}`);}}
            ],
            onClose: () => {closeGenericModal(); router.push('/');}
        });
        setIsLoading(false); return;
    }

    // Muat produk seller
    const savedProductsString = localStorage.getItem("products");
    if (savedProductsString && user) {
        try {
            const allProducts: Product[] = JSON.parse(savedProductsString);
            const userProducts = allProducts.filter((product) => product.sellerId === user!.id);
            setProducts(userProducts);
        } catch(e) {
            console.error("Gagal parse products di SellerPage:", e);
            setProducts([]);
            setModalState({ isOpen: true, title: "Error Data Produk", message: "Gagal memuat daftar produk Anda.", type: 'error', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
        }
    } else if (user) {
        setProducts([]);
    }

    // Hitung Statistik Penjualan dan Pelanggan (LOGIKA DARI SEBELUMNYA SUDAH BENAR)
    if (user) {
        const storedOrdersString = localStorage.getItem("userOrders");
        let calculatedTotalSales = 0;
        const customerEmails = new Set<string>();

        if (storedOrdersString) {
            try {
                const allOrders: Order[] = JSON.parse(storedOrdersString);
                allOrders.forEach(order => {
                    const sellerItemsInOrder = order.items.filter(item => item.sellerId === user!.id);
                    if (sellerItemsInOrder.length > 0) {
                        if (['paid', 'processing', 'completed'].includes(order.status)) {
                            customerEmails.add(order.customerEmail);
                        }
                        if (order.status === 'completed') {
                            const salesFromThisOrder = sellerItemsInOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                            calculatedTotalSales += salesFromThisOrder;
                        }
                    }
                });
            } catch (e) { console.error("Gagal parse userOrders untuk statistik:", e); }
        }
        setTotalSales(calculatedTotalSales);
        setUniqueCustomers(customerEmails.size);
    }
    setIsLoading(false);
  }, [router]);

  const handleNavigateToProductDetail = (id: string) => {
    router.push(`/product/${id}`);
  };

  // --- PERBAIKAN: Tombol Edit sekarang menggunakan router.push ---
  const handleEditProduct = (productId: string) => {
    router.push(`/editproduct/${productId}`);
  };

  const formatPriceForStat = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };
  const formatPriceForProduct = (value: string | number) => {
    if (value === null || value === undefined || String(value).trim() === "") return "Rp 0";
    const cleanValue = String(value).replace(/\D/g, '');
    const numberValue = Number(cleanValue);
    if (isNaN(numberValue)) return "Harga Tdk Valid";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numberValue);
  };

  const stats = [
    { name: 'Total Produk Aktif', value: products.filter(p => p.status !== 'archived').length.toString(), icon: ArchiveIcon, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { name: 'Total Penjualan Selesai', value: formatPriceForStat(totalSales), icon: DollarSignIcon, color: 'text-green-500', bgColor: 'bg-green-50' },
    { name: 'Jumlah Pelanggan', value: uniqueCustomers.toString(), icon: UsersIcon, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ];

  if (isLoading) { /* ... JSX Loading ... */ 
    return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div> <p className="ml-3 text-gray-700 text-lg">Memuat dashboard penjual...</p> </div> );
  }
  
  if (!currentUser || currentUser.role !== 'seller') { /* ... Fallback jika bukan seller ... */ 
    return ( <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-100"> {/* Modal akan ditampilkan dari useEffect */} </div> );
  }

  return (
    <>
        <NotificationModal {...modalState} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-sky-50 selection:bg-emerald-500 selection:text-white">
        <main className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Dashboard */}
            <div className="mb-8 md:mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white rounded-2xl shadow-xl border border-gray-200/80">
                    <div className="flex items-center gap-4">
                        <Image 
                            src={currentUser?.profilePictureUrl || '/profile-placeholder.png'} 
                            alt="Foto Profil Penjual" width={64} height={64} 
                            className="rounded-full object-cover border-2 border-emerald-300"
                        />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                            Selamat Datang, {currentUser?.storeName || currentUser?.fullName || currentUser?.username}!
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-md">
                            Ini adalah dashboard penjualan Anda.
                            </p>
                        </div>
                    </div>
                    <Link href="/addproduct"
                        className="w-full mt-4 md:mt-0 md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-green-500/30 hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-semibold">
                        <PlusCircleIcon className="h-5 w-5" />
                        Tambah Produk Baru
                    </Link>
                </div>
            </div>

            {/* Stats Ringkas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 md:mb-10">
                {stats.map((stat) => (
                    <div key={stat.name} className={`p-5 rounded-xl shadow-lg flex items-center gap-4 ${stat.bgColor} border border-gray-200/70`}>
                        <div className={`p-3 rounded-full bg-white shadow-sm ${stat.color}`}> <stat.icon className="w-6 h-6" /> </div>
                        <div> <p className="text-sm text-gray-600">{stat.name}</p> <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p> </div>
                    </div>
                ))}
            </div>

            {/* Section Produk Anda */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Daftar Produk Anda</h2>
            {products.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <ShoppingBagIcon className="mx-auto h-20 w-20 text-gray-300" />
                    <p className="mt-5 text-xl font-semibold text-gray-700">Anda belum memiliki produk.</p>
                    <p className="mt-2 text-gray-500 mb-6">Mulai dengan menambahkan produk pertama Anda untuk dijual!</p>
                    <Link href="/addproduct" className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-xl shadow-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105">
                        <PlusCircleIcon className="h-5 w-5" /> Tambahkan Produk
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200/80 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden transform hover:-translate-y-1">
                        <div className="relative w-full h-52 bg-gray-100 flex-shrink-0">
                            {product.image ? (
                                <Image src={product.image} alt={product.title} layout="fill" objectFit="cover" className="rounded-t-xl group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png';}}/>
                            ) : ( <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center"> <ShoppingBagIcon className="w-12 h-12 mb-2 text-gray-300"/> Gambar Tidak Tersedia </div> )}
                            {product.status && product.status !== 'active' && ( <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full shadow-sm ${ product.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-gray-100 text-gray-600 border border-gray-300' }`}> {product.status === 'draft' ? 'Draft' : 'Diarsipkan'} </span> )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-md font-semibold text-gray-800 mb-1.5 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2 leading-tight h-12 cursor-pointer"  onClick={() => handleNavigateToProductDetail(product.id)}> {product.title} </h3>
                            <div className="flex items-center text-xs mb-2.5"> <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium line-clamp-1" title={product.category}> {product.category} </span> {product.subcategory && ( <> <span className="text-gray-300 mx-1.5">•</span> <span className="text-gray-500 font-medium line-clamp-1" title={product.subcategory}> {product.subcategory} </span> </> )} </div>
                            <div className="mt-auto pt-3 border-t border-gray-100">
                                <p className="text-xl font-bold text-emerald-600 mb-3"> {formatPriceForProduct(product.price)} </p>
                                <div className="flex items-center gap-2 text-xs">
                                    {/* --- PERBAIKAN TOMBOL EDIT --- */}
                                    <button onClick={() => handleEditProduct(product.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium">
                                        <EditIcon className="w-[14px] h-[14px]" /> Edit
                                    </button>
                                    <button onClick={() => handleNavigateToProductDetail(product.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors font-medium">
                                        <EyeIcon className="w-[14px] h-[14px]" /> Lihat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </main>
        </div>
    </>
  );
};

export default SellerPage;