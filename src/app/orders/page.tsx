// src/app/orders/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PackageIcon, UserIcon as SellerIcon, ShoppingBagIcon as BuyerIcon, CalendarIcon, TagIcon, DollarSignIcon, EyeIcon, InfoIcon, ListFilterIcon, ChevronDownIcon } from 'lucide-react';
import NotificationModal, { ModalButton } from '@/components/NotificationModal';
// Impor tipe Order dan UserData (pastikan path dan definisi konsisten)
// Jika Anda membuat file tipe global, impor dari sana.
// Untuk contoh ini, kita definisikan ulang atau asumsikan sudah ada.

// --- Definisikan tipe yang dibutuhkan di sini jika belum diimpor ---
type Product = {
    id: string; title: string; price: number; image: string | null; images?: string[];
    category: string; subcategory: string; description: string;
    deliveryTime?: string | number; revisions?: string | number;
    includedItems?: string[]; requirements?: string[]; 
    sellerId?: string; // Penting untuk identifikasi seller pada item
};
type CartItem = Product & { quantity: number; };
type Order = {
    orderId: string; transactionId: string; items: CartItem[]; totalAmount: number;
    paymentMethod: string; customerName: string; customerEmail: string; // Idealnya ada customerId
    orderDate: string; status: 'paid' | 'processing' | 'completed' | 'cancelled';
    // Jika ingin menyimpan info seller di level order (jika semua item dari 1 seller)
    // sellerInfo?: { id: string; username: string; storeName?: string; };
};
type UserData = {
  id: string; username: string; email: string; password?: string;
  role: 'buyer' | 'seller'; createdAt: string; fullName?: string;
  bio?: string; phoneNumber?: string; profilePictureUrl?: string;
  storeName?: string; sellerBio?: string; paymentInfo?: string;
};
// --- Akhir Definisi Tipe ---

interface ModalStateType {
  isOpen: boolean; title: string; message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[]; onClose?: () => void;
}

const OrdersPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: UserData = JSON.parse(storedUser);
        setCurrentUser(user);

        const storedOrders = localStorage.getItem('userOrders');
        if (storedOrders) {
          const allOrders: Order[] = JSON.parse(storedOrders);
          let userSpecificOrders: Order[] = [];

          if (user.role === 'buyer') {
            // Buyer melihat pesanan yang customerEmail-nya cocok (atau customerId jika ada)
            userSpecificOrders = allOrders.filter(order => order.customerEmail === user.email || order.items.some(item => item.sellerId && allOrders.find(o => o.orderId === order.orderId && o.customerEmail === user.email))); // Asumsi customerEmail sebagai identifier, idealnya customerId
          } else if (user.role === 'seller') {
            // Seller melihat pesanan yang item-itemnya memiliki sellerId yang cocok
            userSpecificOrders = allOrders.filter(order => 
              order.items.some(item => item.sellerId === user.id)
            );
          }
          setOrders(userSpecificOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())); // Urutkan dari terbaru
        }
      } catch (e) {
        console.error("Gagal memuat data pesanan:", e);
        setModalState({isOpen:true, title:"Error Data", message:"Gagal memuat riwayat pesanan Anda.", type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
      }
    } else {
      setModalState({isOpen:true, title:"Akses Ditolak", message:"Anda harus login untuk melihat halaman ini.", type:'error', buttons:[{text:"Login", onClick:() => {closeGenericModal(); router.push('/login')}}], onClose:() => router.push('/login')});
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filterStatus));
    }
  }, [orders, filterStatus]);


  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'paid': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
const getStatusText = (status: Order['status'] | string): string => { // Izinkan string juga untuk fallback
    switch (status) {
      case 'paid': return 'Menunggu Pengerjaan';
      case 'processing': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default:
        // Jika status adalah nilai yang tidak terduga dari Order['status']
        // atau jika kita melewatkan string generik
        if (typeof status === 'string' && status.length > 0) {
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
        return 'Status Tidak Diketahui'; // Fallback jika default adalah nilai aneh
    }
}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="ml-3 text-gray-700">Memuat daftar pesanan...</p>
      </div>
    );
  }
  if (!currentUser) { // Jika tidak ada user (sudah dihandle modal, tapi sebagai fallback)
      return null; 
  }


  return (
    <>
      <NotificationModal {...modalState} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-sky-50 py-10 sm:py-12 px-4 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {currentUser.role === 'seller' ? 'Pesanan Diterima' : 'Riwayat Pesanan Saya'}
            </h1>
            <div className="relative">
                <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                    <ListFilterIcon size={16}/>
                    Filter Status: <span className="font-semibold text-emerald-600">{filterStatus === 'all' ? 'Semua' : getStatusText(filterStatus)}</span>
                    <ChevronDownIcon size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}/>
                </button>
                {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10 py-1">
                        {(['all', 'paid', 'processing', 'completed', 'cancelled'] as const).map(statusOpt => (
                            <button 
                                key={statusOpt}
                                onClick={() => { setFilterStatus(statusOpt); setShowFilterDropdown(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === statusOpt ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'}`}>
                                {statusOpt === 'all' ? 'Semua Status' : getStatusText(statusOpt)}
                            </button>
                        ))}
                    </div>
                )}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200/70">
              <PackageIcon className="mx-auto h-24 w-24 text-gray-300 mb-5" />
              <p className="text-xl font-semibold text-gray-700">
                {filterStatus === 'all' ? 'Anda belum memiliki pesanan.' : `Tidak ada pesanan dengan status "${getStatusText(filterStatus)}".`}
              </p>
              {currentUser.role === 'buyer' && (
                <p className="mt-2 text-gray-500">Mulai jelajahi layanan terbaik di Lumora!</p>
              )}
              {currentUser.role === 'seller' && (
                <p className="mt-2 text-gray-500">Tunggu pesanan pertama Anda masuk!</p>
              )}
              {currentUser.role === 'buyer' && (
                <Link href="/explore"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 text-base font-medium rounded-xl shadow-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform transform hover:scale-105">
                  Jelajahi Layanan
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map(order => {
                const mainItem = order.items[0]; // Ambil item pertama sebagai representasi
                // Untuk seller, kita perlu cari info buyer (customerName sudah ada di order)
                // Untuk buyer, kita perlu cari info seller (perlu ada di item atau order)
                let counterPartyName = '';
                let counterPartyRoleIcon = null;

                if (currentUser.role === 'buyer' && mainItem?.sellerId) {
                    // Di aplikasi nyata, Anda akan fetch data seller berdasarkan mainItem.sellerId
                    // Untuk sekarang, kita bisa coba tampilkan placeholder atau ID seller
                    counterPartyName = `Penjual ID: ${mainItem.sellerId.substring(0,8)}...`; // Placeholder
                    counterPartyRoleIcon = <SellerIcon size={14} className="mr-1 text-gray-400"/>;
                } else if (currentUser.role === 'seller') {
                    counterPartyName = order.customerName;
                    counterPartyRoleIcon = <BuyerIcon size={14} className="mr-1 text-gray-400"/>;
                }

                return (
                  <div key={order.orderId} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-200/80 overflow-hidden">
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                            <div>
                                <Link href={`/progress/${order.orderId}`} className="hover:text-emerald-600 transition-colors">
                                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 line-clamp-1">
                                        {mainItem ? mainItem.title : 'Detail Pesanan'}
                                    </h2>
                                </Link>
                                <p className="text-xs text-gray-500 font-mono">ID: {order.orderId}</p>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                            <div className="flex items-center">
                                <CalendarIcon size={13} className="mr-1.5 text-gray-400"/>
                                {new Date(order.orderDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                             {counterPartyName && (
                                <div className="flex items-center" title={counterPartyName}>
                                    {counterPartyRoleIcon}
                                    <span className="line-clamp-1">{counterPartyName}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <TagIcon size={13} className="mr-1.5 text-gray-400"/>
                                {mainItem?.category || 'N/A'}
                            </div>
                        </div>

                        {mainItem && mainItem.image && (
                             <div className="my-3 h-24 w-full sm:w-1/3 md:w-1/4 relative rounded-md overflow-hidden bg-gray-100">
                                <Image src={mainItem.image} alt={mainItem.title} layout="fill" objectFit="cover"/>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Total Pembayaran</p>
                                <p className="text-lg font-semibold text-emerald-600">
                                    {order.totalAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                                </p>
                            </div>
                            <Link href={`/progress/${order.orderId}`}
                                className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md">
                                <EyeIcon size={16}/> Lihat Detail Progres
                            </Link>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;