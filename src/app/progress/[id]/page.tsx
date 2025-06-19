// src/app/progress/[id]/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import NotificationModal, { ModalButton } from '@/components/NotificationModal';
import {
    ArrowLeftIcon, CheckCircleIcon as LucideCheckCircleIcon, ClockIcon, MessageSquareIcon,
    PaperclipIcon, SendIcon, DownloadIcon, ShieldCheckIcon, XIcon, UserCircleIcon as LucideUserCircleIcon,
    UploadCloudIcon, Edit2Icon, AlertTriangleIcon // Menambahkan AlertTriangleIcon untuk peringatan
} from "lucide-react";

// --- Definisikan tipe yang dibutuhkan di sini ---
type Product = {
    id: string; title: string; price: number; image: string | null; images?: string[];
    category: string; subcategory: string; description: string;
    deliveryTime?: string | number; revisions?: string | number;
    includedItems?: string[]; requirements?: string[]; sellerId?: string;
};
type CartItem = Product & { quantity: number; };
// Tipe Order (pastikan konsisten dengan yang disimpan oleh PaymentPage)
type Order = {
    orderId: string; transactionId: string; items: CartItem[]; totalAmount: number;
    paymentMethod: string; customerName: string; customerEmail: string;
    orderDate: string; status: 'paid' | 'processing' | 'completed' | 'cancelled';
};
// Tipe UserData (pastikan konsisten dengan tempat lain)
type UserData = {
  id: string; username: string; email: string; password?: string;
  role: 'buyer' | 'seller'; createdAt: string; fullName?: string;
  bio?: string; phoneNumber?: string; profilePictureUrl?: string;
  storeName?: string; sellerBio?: string; paymentInfo?: string;
};
// --- Akhir Definisi Tipe ---

interface ChatMessage {
  id: string; sender: 'buyer' | 'seller' | 'system'; senderName?: string;
  senderAvatar?: string; text: string; timestamp: string;
  file?: { name: string; url?: string; size?: number }; imageUrl?: string;
}
interface ProgressUpdate {
  id: string;
  timestamp: string;
  description: string;
  percentage: number;
  attachments?: { name: string; url: string; type?: 'image' | 'zip' | 'other' }[];
}
// MODIFIKASI: Tambahkan 'icon?: React.ReactNode;' ke ModalStateType
interface ModalStateType {
  isOpen: boolean; title: string; message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[]; onClose?: () => void;
  icon?: React.ReactNode; // Properti ini ditambahkan
}
interface ProgressModalStateType {
    isOpen: boolean;
    description: string;
    percentage: number;
    files: File[];
}

const ProgressPage = () => {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChatFile, setSelectedChatFile] = useState<File | null>(null);
  const [chatImagePreview, setChatImagePreview] = useState<string | null>(null);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [currentProgressPercentage, setCurrentProgressPercentage] = useState<number>(0);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [viewingAs, setViewingAs] = useState<'buyer' | 'seller' | 'observer' | null>(null);
  const [sellerForThisOrder, setSellerForThisOrder] = useState<UserData | null>(null);

  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const progressFileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [modalState, setModalState] = useState<ModalStateType>({
    isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
  });
  const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const [progressModal, setProgressModal] = useState<ProgressModalStateType>({
    isOpen: false, description: '', percentage: 0, files: []
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    let parsedCurrentUser: UserData | null = null;
    if(storedUser) {
        try { 
            parsedCurrentUser = JSON.parse(storedUser);
            setCurrentUserData(parsedCurrentUser); 
        }
        catch(e) { 
            console.error("Gagal parse currentUserData di ProgressPage:", e);
            setModalState({isOpen:true, title:"Error Sesi", message:"Sesi Anda tidak valid, silakan login kembali.", type:'error', buttons:[{text:"Login", onClick:() => {closeGenericModal(); router.push('/login')}}], onClose: () => {closeGenericModal(); router.push('/login')}});
            setIsLoading(false); 
            return;
        }
    } else {
        setModalState({isOpen:true, title:"Akses Ditolak", message:"Anda harus login untuk melihat halaman ini.", type:'error', buttons:[{text:"Login", onClick:() => {closeGenericModal(); router.push('/login')}}], onClose: () => {closeGenericModal(); router.push('/login')}});
        setIsLoading(false); 
        return;
    }

    if (orderId && parsedCurrentUser) { 
      const storedOrders = localStorage.getItem("userOrders");
      if (storedOrders) {
        try {
          const allOrders: Order[] = JSON.parse(storedOrders);
          const foundOrder = allOrders.find(o => o.orderId === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
            const orderSellerId = foundOrder.items[0]?.sellerId;

            if (parsedCurrentUser.id === orderSellerId) { 
                setViewingAs('seller'); 
            } else if (parsedCurrentUser.email === foundOrder.customerEmail) { 
                setViewingAs('buyer');
            } else { 
                setViewingAs('observer'); 
                setModalState({isOpen:true, title:"Akses Terbatas", message:"Anda tidak memiliki akses penuh ke detail progres pesanan ini.", type:'warning', buttons:[{text:"OK", onClick: closeGenericModal}], onClose:closeGenericModal});
            }
            
            if(orderSellerId){ 
                const allRegisteredUsers: UserData[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const sellerInfo = allRegisteredUsers.find(u => u.id === orderSellerId);
                if(sellerInfo) setSellerForThisOrder(sellerInfo);
            }

            const storedChat = localStorage.getItem(`chat_${orderId}`);
            if (storedChat) { try { setChatMessages(JSON.parse(storedChat)); } catch (e) { setChatMessages([{ id: `sys-${Date.now()}`, sender: 'system', text: `Selamat datang di ruang diskusi untuk pesanan #${orderId}!`, timestamp: new Date().toISOString() }]); }}
            else { setChatMessages([{ id: `sys-${Date.now()}`, sender: 'system', text: `Selamat datang di ruang diskusi untuk pesanan #${orderId}!`, timestamp: new Date().toISOString() }]);}
            
            const storedProgress = localStorage.getItem(`progress_${orderId}`);
            if (storedProgress) { 
                try { 
                    const updates: ProgressUpdate[] = JSON.parse(storedProgress); 
                    setProgressUpdates(updates); 
                    if (updates.length > 0) {
                        const latestPercentage = Number(updates[updates.length - 1].percentage);
                        setCurrentProgressPercentage(isNaN(latestPercentage) ? 0 : latestPercentage);
                    } else {
                        setCurrentProgressPercentage(0);
                    }
                } catch (e) { 
                    console.warn("Gagal parse progress atau format tidak sesuai");
                    setCurrentProgressPercentage(0); 
                } 
            } else {
                if(foundOrder.status === 'completed'){
                    setCurrentProgressPercentage(100);
                } else {
                    setCurrentProgressPercentage(0); 
                }
            }
          } else { 
            setModalState({isOpen: true, title: "Pesanan Tidak Ditemukan", message: `Pesanan dengan ID #${orderId} tidak ditemukan.`, type: 'error', buttons: [{text: "Kembali ke Pesanan", onClick: () => {closeGenericModal(); router.push('/orders')}}], onClose: () => {closeGenericModal(); router.push('/orders')}});
          }
        } catch (e) { setModalState({isOpen: true, title: "Error Data", message: "Gagal memuat detail pesanan atau format data tidak sesuai.", type: 'error', buttons: [{text: "Kembali", onClick: () => {closeGenericModal(); router.back()}}], onClose: () => {closeGenericModal(); router.back()}}); }
      } else { setModalState({isOpen: true, title: "Tidak Ada Pesanan", message: "Belum ada riwayat pesanan yang tersimpan.", type: 'info', buttons: [{text: "Kembali ke Beranda", onClick: () => {closeGenericModal(); router.push('/')}}], onClose: () => {closeGenericModal(); router.push('/')}}); }
      setIsLoading(false);
    } else if(!parsedCurrentUser && !orderId) { setIsLoading(false); } 
      else if(!orderId) { setIsLoading(false); setModalState({isOpen: true, title: "ID Pesanan Tidak Valid", message: "ID Pesanan tidak ditemukan di URL.", type: 'error', buttons: [{text: "Kembali", onClick: () => {closeGenericModal(); router.back()}}], onClose: () => {closeGenericModal(); router.back()}}); }
  }, [orderId, router]);

  useEffect(() => { if (orderId && chatMessages.length > 0 && chatMessages.some(msg => msg.sender !== 'system' || chatMessages.length > 1) ) { localStorage.setItem(`chat_${orderId}`, JSON.stringify(chatMessages)); }}, [chatMessages, orderId]);
  useEffect(() => { if (orderId && progressUpdates.length > 0) { localStorage.setItem(`progress_${orderId}`, JSON.stringify(progressUpdates)); }}, [progressUpdates, orderId]);
  useEffect(() => { if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }}, [chatMessages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'chat' | 'progress') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { setModalState({isOpen:true, title: "File Terlalu Besar", message: "Ukuran file maksimal 5MB.", type:'warning', buttons:[{text: "OK", onClick:closeGenericModal}], onClose:closeGenericModal}); if (e.target) e.target.value = ""; return; }
      if (type === 'chat') {
        setSelectedChatFile(file);
        if (file.type.startsWith("image/")) { setChatImagePreview(URL.createObjectURL(file)); } else { setChatImagePreview(null); }
      } else if (type === 'progress') {
        setProgressModal(prev => ({...prev, files: [...prev.files, file]}));
      }
      if (e.target) e.target.value = "";
    }
  };

  // Fungsi untuk mendeteksi informasi pribadi
  const containsPrivateInfo = (text: string): boolean => {
    const lowerCaseText = text.toLowerCase();
    // Regex untuk nomor telepon (contoh sederhana, bisa lebih kompleks)
    // Mendeteksi +62, 08xx, atau format angka panjang. Memasukkan spasi, strip, atau titik
    const phoneRegex = /(\+62|0)\s*\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}|\d{7,15}/g;

    // Kata kunci dan pola untuk media sosial/komunikasi
    const socialMediaKeywords = [
        /@[\w\d._-]+/, // @username
        /wa\.me\//, /whatsapp\.com\//, // WhatsApp
        /t\.me\//, /telegram\.me\//, // Telegram
        /line\.me\//, // Line
        /instagram\.com\//, /ig\.com\//, // Instagram
        /facebook\.com\//, /fb\.com\//, // Facebook
        /linkedin\.com\//, // LinkedIn
        /discord\./, // Discord
        /email|e-mail|gmail|yahoo|outlook/ // Kata kunci email
    ];

    return phoneRegex.test(lowerCaseText) || socialMediaKeywords.some(regex => regex.test(lowerCaseText));
  };


  const handleSendMessage = async () => { 
    if (!newMessage.trim() && !selectedChatFile) return;
    if (!currentUserData) {
        setModalState({isOpen: true, title: "Error Pengguna", message: "Data sesi pengguna tidak ditemukan.", type:'error', buttons: [{text: "Login", onClick: () => {closeGenericModal(); router.push('/login')}}], onClose: () => {closeGenericModal(); router.push('/login')} });
        return;
    }
    setIsSendingMessage(true);

    // --- LOGIC DETEKSI INFORMASI PRIBADI ---
    if (containsPrivateInfo(newMessage.trim())) {
        setModalState({
            isOpen: true,
            title: "Peringatan Keamanan!",
            message: (
                <>
                    <p className="mb-3">
                        Demi keamanan dan kenyamanan transaksi, kami sangat menyarankan untuk tidak membagikan informasi kontak pribadi (nomor telepon, email, akun media sosial, dll.) di luar platform chat Lumora.
                    </p>
                    <p className="font-semibold text-gray-700">
                        Semua komunikasi dan transaksi sebaiknya dilakukan melalui fitur yang tersedia di website ini.
                    </p>
                </>
            ),
            type: 'warning',
            buttons: [
                { text: "Oke, Saya Mengerti", onClick: closeGenericModal, className: 'bg-emerald-500 text-white hover:bg-emerald-600' }
            ],
            icon: <AlertTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        });
        setIsSendingMessage(false);
        return; // Hentikan pengiriman pesan
    }
    // --- AKHIR LOGIC DETEKSI ---


    let fileData: ChatMessage['file'] | undefined = undefined;
    let uploadedImageUrlForChat: string | undefined = undefined;

    if (selectedChatFile) {
      fileData = { name: selectedChatFile.name, size: selectedChatFile.size, url: "#preview" };
      if (selectedChatFile.type.startsWith("image/")) {
        uploadedImageUrlForChat = URL.createObjectURL(selectedChatFile); 
      }
    }
    const newChatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sender: currentUserData.role, senderName: currentUserData.fullName || currentUserData.username,
      senderAvatar: currentUserData.profilePictureUrl, text: newMessage.trim(),
      timestamp: new Date().toISOString(), file: fileData, imageUrl: uploadedImageUrlForChat,
    };
    setChatMessages(prev => [...prev, newChatMessage]);
    setNewMessage(""); setSelectedChatFile(null); setChatImagePreview(null);
    if (chatFileInputRef.current) chatFileInputRef.current.value = "";
    setIsSendingMessage(false);
  };
  const handleOpenProgressModal = (percentage?: number) => { 
    if (viewingAs !== 'seller') return;
    setProgressModal({ isOpen: true, description: '', percentage: percentage !== undefined ? Number(percentage) : Number(currentProgressPercentage), files: [] });
  };
  const handleSubmitProgressUpdate = async () => {
    if (viewingAs !== 'seller' || !order) return;
    const newPercentage = Number(progressModal.percentage);
    const currentPercentageNum = Number(currentProgressPercentage);

    if (!progressModal.description.trim() || (newPercentage <= currentPercentageNum && newPercentage !== 100) ) {
        let alertMessage = "Deskripsi progres harus diisi.";
        if (newPercentage <= currentPercentageNum && newPercentage !== 100) {
            alertMessage = "Persentase baru harus lebih besar dari progres saat ini, atau set ke 100% untuk finalisasi.";
        }
        setModalState({isOpen:true, title:"Input Tidak Valid", message: alertMessage, type:'warning', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal});
        return;
    }

    setIsSendingMessage(true); 
    const uploadedAttachments: ProgressUpdate['attachments'] = [];
    for (const file of progressModal.files) {
        const formData = new FormData(); formData.append('file', file);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error(`Gagal unggah ${file.name}`);
            const result = await response.json();
            if (result.fileUrl) { uploadedAttachments.push({ name: file.name, url: result.fileUrl, type: file.type.startsWith('image/') ? 'image' : (file.name.endsWith('.zip') ? 'zip' : 'other') }); }
        } catch (err) { console.error(err); setModalState({isOpen:true, title:"Upload Gagal", message:`Gagal mengunggah file ${file.name}.`, type:'error', buttons:[{text:"OK", onClick:closeGenericModal}], onClose:closeGenericModal}); setIsSendingMessage(false); return; }
    }
    const newUpdate: ProgressUpdate = { id: `prog-${Date.now()}`, timestamp: new Date().toISOString(), description: progressModal.description, percentage: newPercentage, attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined, };
    setProgressUpdates(prev => [...prev, newUpdate]); 
    setCurrentProgressPercentage(newPercentage); 
    const systemMessage: ChatMessage = { id: `sys-prog-${Date.now()}`, sender: 'system', text: `Penjual memperbarui progres menjadi ${newUpdate.percentage}%: ${newUpdate.description}${uploadedAttachments.length > 0 ? `\nLampiran: ${uploadedAttachments.map(a => a.name).join(', ')}` : ''}`, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, systemMessage]);
    setProgressModal({ isOpen: false, description: '', percentage: 0, files: [] });
    setIsSendingMessage(false);
  };

  // --- FUNGSI YANG DIPERBARUI ---
  const handleFinalizeOrder = () => { 
    if (viewingAs !== 'buyer' || !order) {
        setModalState({isOpen:true, title:"Aksi Tidak Valid", message:"Hanya pembeli yang dapat menyelesaikan pesanan.", type:'error', buttons:[{text:"OK", onClick: closeGenericModal}], onClose: closeGenericModal });
        return;
    }
    if (Number(currentProgressPercentage) !== 100) {
        setModalState({isOpen:true, title:"Progres Belum Selesai", message:`Progres pesanan baru ${currentProgressPercentage}%, belum bisa diselesaikan.`, type:'warning', buttons:[{text:"OK", onClick: closeGenericModal}], onClose: closeGenericModal });
        return;
    }
    if (order.status !== 'processing' && order.status !== 'paid') { // Ditambahkan 'paid' jika seller bisa langsung 100%
        setModalState({isOpen:true, title:"Status Tidak Sesuai", message:`Pesanan dengan status "${order.status}" tidak dapat diselesaikan saat ini.`, type:'warning', buttons:[{text:"OK", onClick: closeGenericModal}], onClose: closeGenericModal });
        return;
    }

    // Jika semua kondisi terpenuhi, lanjutkan ke konfirmasi
    setModalState({
        isOpen: true,
        title: "Konfirmasi Penyelesaian Pesanan",
        message: "Apakah Anda yakin pesanan ini sudah sesuai dan ingin menyelesaikannya?\n\nPeringatan: Setelah diselesaikan, Anda tidak bisa meminta revisi lebih lanjut.",
        type: 'confirmation',
        buttons: [
            { text: "Batal", onClick: closeGenericModal, className: 'bg-gray-200 text-gray-700 hover:bg-gray-300' },
            { text: "Ya, Selesaikan", onClick: () => { 
                closeGenericModal();
                // Logika untuk benar-benar menyelesaikan pesanan
                const updatedOrder = { ...order, status: 'completed' as Order['status'] };
                const storedOrders = localStorage.getItem("userOrders");
                if (storedOrders) {
                    try {
                        let allOrders: Order[] = JSON.parse(storedOrders);
                        const orderIndex = allOrders.findIndex(o => o.orderId === orderId);
                        if (orderIndex !== -1) { 
                            allOrders[orderIndex] = updatedOrder; 
                            localStorage.setItem("userOrders", JSON.stringify(allOrders)); 
                            setOrder(updatedOrder); 
                            setCurrentProgressPercentage(100); 
                            setModalState({isOpen:true, title:"Pesanan Selesai!", message:"Terima kasih! Penjual telah diberitahu dan pesanan ini ditandai selesai.", type:"success", buttons:[{text: "OK", onClick:closeGenericModal}], onClose:closeGenericModal}); 
                        }
                    } catch (e) { setModalState({isOpen:true, title:"Error", message:"Gagal memperbarui status pesanan.", type:'error', buttons:[{text:"OK", onClick: closeGenericModal}], onClose: closeGenericModal });}
                }
            }}
        ],
        onClose: closeGenericModal
    });
  };
  // --- AKHIR FUNGSI YANG DIPERBARUI ---


  if (isLoading) { return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div><p className="ml-3 text-gray-700">Memuat...</p></div> ); }
  if (!order || !currentUserData) { return null; }

  const mainProduct = order.items.length > 0 ? order.items[0] : null;
  const isSellerView = viewingAs === 'seller';

  const timelineSteps = [
    { label: "Diterima", percentage: 0 }, { label: "Awal", percentage: 25 },
    { label: "Tengah", percentage: 50 }, { label: "Akhir", percentage: 75 },
    { label: "Review", percentage: 100 },
  ];

  return (
    <>
      <NotificationModal {...modalState} />
      {progressModal.isOpen && viewingAs === 'seller' && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-semibold text-gray-800">Perbarui Progres Pesanan</h3> <button onClick={() => setProgressModal(prev => ({...prev, isOpen: false}))} className="text-gray-400 hover:text-gray-600"><XIcon className="w-[20px] h-[20px]"/></button> </div>
            <div className="space-y-4">
              <div> <label htmlFor="progressPercentage" className="block text-sm font-medium text-gray-700 mb-1">Persentase Selesai (%)</label> <input type="number" id="progressPercentage" min={Number(currentProgressPercentage) > 0 ? Number(currentProgressPercentage) + 1 : 0} max="100" step="1" value={progressModal.percentage} onChange={(e) => setProgressModal(prev => ({...prev, percentage: parseInt(e.target.value) || 0}))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"/> </div>
              <div> <label htmlFor="progressDescription" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Update <span className="text-red-500">*</span></label> <textarea id="progressDescription" rows={3} value={progressModal.description} onChange={(e) => setProgressModal(prev => ({...prev, description: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-emerald-500 focus:border-emerald-500" placeholder="Jelaskan progres terbaru..."></textarea> </div>
              <div> <label className="block text-sm font-medium text-gray-700 mb-1">Lampirkan File Preview (Opsional)</label> <input type="file" multiple onChange={(e) => handleFileSelect(e, 'progress')} ref={progressFileInputRef} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/> <div className="mt-2 space-y-1"> {progressModal.files.map((file, idx) => ( <div key={idx} className="text-xs text-gray-600 p-1 bg-gray-100 rounded flex items-center justify-between"> <span className="truncate pr-2">{file.name}</span> <button onClick={() => setProgressModal(p => ({...p, files: p.files.filter((_,i) => i !== idx)}))} className="text-red-500 hover:text-red-700 flex-shrink-0"><XIcon className="w-[14px] h-[14px]"/></button> </div> ))} </div> </div>
              <div className="flex justify-end gap-3 mt-6"> <button onClick={() => setProgressModal(prev => ({...prev, isOpen: false}))} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">Batal</button> <button onClick={handleSubmitProgressUpdate} disabled={isSendingMessage} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-semibold disabled:opacity-50 flex items-center gap-2"> {isSendingMessage ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <LucideCheckCircleIcon className="w-[16px] h-[16px]"/>} Simpan Update </button> </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-6xl mx-auto">
            <div className="mb-6"> <Link href={isSellerView ? "/seller" : "/orders" } className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium group"> <ArrowLeftIcon className="w-5 h-5 mr-1.5 transition-transform group-hover:-translate-x-1"/> {isSellerView ? "Kembali ke Dashboard Penjual" : "Kembali ke Daftar Pesanan"} </Link> </div>
            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4"> <div> <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Progres Pesanan {isSellerView ? `dari Klien: ${order.customerName}` : 'Anda'}</h1> <p className="text-sm text-gray-500 font-mono">ID Pesanan: <span className="font-semibold">{order.orderId}</span></p> <p className="text-sm text-gray-500">Tanggal Pesan: {new Date(order.orderDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p> {!isSellerView && sellerForThisOrder && <p className="text-sm text-gray-500">Penjual: {sellerForThisOrder.storeName || sellerForThisOrder.username}</p> } {isSellerView && <p className="text-sm text-gray-500">Klien: {order.customerName} ({order.customerEmail})</p> } </div> <div className="text-left sm:text-right flex-shrink-0"> <p className="text-sm text-gray-600">Total Pembayaran:</p> <p className="text-xl font-semibold text-emerald-600"> {order.totalAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })} </p> <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-1.5 inline-block ${ order.status === 'paid' ? 'bg-yellow-100 text-yellow-700' : order.status === 'processing' ? 'bg-blue-100 text-blue-700' : order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }`}> Status: {order.status === 'paid' ? 'Menunggu Pengerjaan' : order.status === 'processing' ? 'Sedang Dikerjakan' : order.status === 'completed' ? 'Selesai' : order.status.replace('_', ' ')} </span> </div> </div>
                {mainProduct && ( <div className="mt-4 border-t pt-4"> <h3 className="text-md font-semibold text-gray-700 mb-1">Layanan Utama Dipesan:</h3> <p className="text-gray-600 text-sm">{mainProduct.title} (x{mainProduct.quantity})</p> </div> )}
            </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white shadow-xl rounded-xl p-6"> <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3">Timeline Progres</h2> <div className="flex justify-between items-start mb-2 text-center"> {timelineSteps.map((step, index) => ( <div key={step.percentage} className="flex flex-col items-center w-1/5"> <button onClick={() => viewingAs === 'seller' && handleOpenProgressModal(step.percentage)} disabled={viewingAs !== 'seller'} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${Number(currentProgressPercentage) >= step.percentage ? 'bg-emerald-500 border-emerald-600 shadow-lg' : 'bg-gray-300 border-gray-400'} ${viewingAs === 'seller' ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`} title={viewingAs === 'seller' ? `Update ke ${step.percentage}%` : `Progres ${step.percentage}%`}> {Number(currentProgressPercentage) >= step.percentage && <LucideCheckCircleIcon className="w-[16px] h-[16px] text-white"/>} </button> <div className={`mt-1 w-px h-4 ${index < timelineSteps.length -1 ? (Number(currentProgressPercentage) > step.percentage ? 'bg-emerald-500' : 'bg-gray-300') : 'bg-transparent'}`}></div> <p className={`text-[10px] mt-1 font-medium ${Number(currentProgressPercentage) >= step.percentage ? 'text-emerald-600' : 'text-gray-500'}`}>{step.label}</p> </div> ))} </div> <div className="relative w-full h-2.5 bg-gray-200 rounded-full mb-2 mt-1"> <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500 ease-out shadow-md" style={{ width: `${currentProgressPercentage}%` }} > </div> </div> <p className="text-xs text-gray-600 text-right mb-5">{Number(currentProgressPercentage) > 0 ? `${currentProgressPercentage}% Selesai` : "Pesanan diterima"}</p> <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2"> {progressUpdates.length === 0 && ( <div className="text-center py-4"> <ClockIcon className="w-10 h-10 text-gray-300 mx-auto mb-2"/> <p className="text-sm text-gray-500 italic">Belum ada update progres.</p> </div> )} {progressUpdates.slice().reverse().map(update => ( <div key={update.id} className="pb-3 border-b border-gray-100 last:border-b-0"> <div className="flex items-center justify-between mb-1"> <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${Number(update.percentage) === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}> {update.percentage}% Tercapai </span> <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString('id-ID', {day:'2-digit',month:'short', hour:'2-digit',minute:'2-digit'})}</p> </div> <p className="text-sm text-gray-700 break-words">{update.description}</p> {update.attachments && update.attachments.length > 0 && ( <div className="mt-1.5 space-y-1"> {update.attachments.map(att => ( <a key={att.name} href={att.url} target="_blank" rel="noopener noreferrer" className={`text-xs hover:underline flex items-center gap-1 p-1.5 rounded hover:bg-emerald-100 ${att.type === 'image' ? 'text-blue-600' : 'text-emerald-600'}`}> <DownloadIcon className="w-[12px] h-[12px]"/> {att.name} </a> ))} </div> )} </div> ))} </div> {viewingAs === 'seller' && ( <button onClick={() => handleOpenProgressModal()} className="mt-6 w-full text-sm bg-emerald-500 text-white p-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"> <Edit2Icon className="w-[16px] h-[16px]"/> Perbarui Manual Progres </button> )} </div>
                    <div className="bg-white shadow-xl rounded-xl p-6"> <h2 className="text-xl font-semibold text-gray-800 mb-4">Aksi Pesanan</h2> <div className="space-y-3"> 
                        {viewingAs === 'buyer' && (<> 
                            <button 
                                onClick={() => { 
                                    const progressNum = Number(currentProgressPercentage);
                                    if (order && order.status === 'completed') {
                                        setModalState({isOpen:true, title: "Informasi Pesanan", message: "Pesanan ini sudah selesai.", type:'info', buttons:[{text: "OK", onClick:closeGenericModal}], onClose:closeGenericModal});
                                    } else if (order && (order.status === 'processing' || order.status === 'paid') && progressNum === 100) { // PERBAIKAN KONDISI
                                        setModalState({isOpen:true, title: "Konfirmasi Penyelesaian", message: "Apakah Anda yakin pesanan ini sudah sesuai dan ingin menyelesaikannya?\n\nPeringatan: Setelah diselesaikan, Anda tidak bisa meminta revisi lebih lanjut.", type:'confirmation', buttons:[ {text: "Batal", onClick: closeGenericModal, className: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}, {text: "Ya, Selesaikan", onClick: () => { closeGenericModal(); handleFinalizeOrder();}} ], onClose:closeGenericModal});
                                    } else if (progressNum < 100) {
                                        setModalState({isOpen:true, title: "Progres Belum 100%", message: `Pesanan baru mencapai ${currentProgressPercentage}%. Anda hanya bisa menyelesaikan pesanan jika progres sudah mencapai 100%.`, type:'warning', buttons:[{text: "OK", onClick:closeGenericModal}], onClose:closeGenericModal});
                                    } else {
                                        setModalState({ isOpen: true, title: "Informasi", message: `Status pesanan saat ini adalah "${order?.status || 'tidak diketahui'}". Progres sudah ${currentProgressPercentage}%. Silakan hubungi penjual jika ada kendala atau status tidak sesuai.`, type: 'info', buttons: [{ text: "OK", onClick: closeGenericModal }], onClose: closeGenericModal });
                                    }
                                }} 
                                className={`w-full flex items-center justify-center gap-2 text-white font-medium py-2.5 px-4 rounded-lg transition-colors ${order.status === 'completed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`} 
                                disabled={order.status === 'completed'}
                            > 
                                <LucideCheckCircleIcon className="w-5 h-5"/> Selesaikan Pesanan 
                            </button> 
                            
                            <button className="w-full flex items-center justify-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium py-2.5 px-4 rounded-lg transition-colors"> <ShieldCheckIcon className="w-5 h-5"/> Ajukan Komplain </button> 
                        </> )} 
                        {viewingAs === 'seller' && ( <p className="text-sm text-gray-500 italic">Aksi oleh pembeli.</p> )} 
                        {viewingAs === 'observer' && ( <p className="text-sm text-gray-500 italic">Anda hanya bisa melihat progres pesanan ini.</p> )} 
                    </div> </div>
                </div>
                <div className="lg:col-span-2 bg-white shadow-xl rounded-xl flex flex-col h-[calc(100vh-10rem)] max-h-[750px]">
                  <h2 className="text-xl font-semibold text-gray-800 p-5 border-b border-gray-200 sticky top-0 bg-white z-10">Ruang Diskusi</h2>
                   <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar bg-gray-50/30">
                     {chatMessages.map(msg => {
                        let alignmentClass = 'justify-start';
                        let bubbleClass = 'bg-gray-200 text-gray-800 rounded-bl-none';
                        let timestampClass = 'text-gray-500 text-left';
                        let senderDisplayNameForChat = msg.senderName || (msg.sender === 'buyer' ? (order?.customerName || 'Pembeli') : (msg.sender === 'seller' ? (sellerForThisOrder?.storeName || sellerForThisOrder?.username || 'Penjual') : 'Sistem'));
                        let showLeftAvatar = true;
                        let showRightAvatar = false;
                        let senderAvatarUrl = msg.senderAvatar || '/profile-placeholder.png';

                        if (msg.sender === 'system') {
                            alignmentClass = 'justify-center';
                            bubbleClass = 'bg-sky-100 text-sky-700 text-xs italic text-center w-full sm:w-auto rounded-lg my-1 mx-auto py-1.5 px-2.5';
                            timestampClass = 'text-sky-600 text-center';
                            showLeftAvatar = false;
                        } else if (currentUserData && msg.sender === currentUserData.role) {
                            alignmentClass = 'justify-end';
                            bubbleClass = 'bg-emerald-500 text-white rounded-br-none';
                            timestampClass = 'text-emerald-100 text-right';
                            showLeftAvatar = false;
                            showRightAvatar = true;
                            senderDisplayNameForChat = 'Anda';
                            senderAvatarUrl = currentUserData.profilePictureUrl || '/profile-placeholder.png';
                        } else if (msg.sender === 'buyer') {
                            senderAvatarUrl = '/profile-placeholder.png';
                        } else if (msg.sender === 'seller') {
                            senderAvatarUrl = sellerForThisOrder?.profilePictureUrl || '/profile-placeholder.png';
                        }
                        
                        return ( <div key={msg.id} className={`flex mb-3 ${alignmentClass}`}> { showLeftAvatar && msg.sender !== 'system' && ( <Image src={senderAvatarUrl} alt={senderDisplayNameForChat} width={32} height={32} className="w-8 h-8 rounded-full mr-2 flex-shrink-0 object-cover shadow-sm"/> )} <div className={`max-w-[75%] sm:max-w-[70%]`}> {msg.sender !== 'system' && !showRightAvatar && ( <p className="text-xs text-gray-600 mb-0.5 ml-1 font-medium">{senderDisplayNameForChat}</p> )} <div className={`p-2.5 sm:p-3 rounded-xl shadow-sm ${bubbleClass}`}> {msg.text && <p className="text-sm whitespace-pre-line break-words">{msg.text}</p>} {msg.imageUrl && ( <Image src={msg.imageUrl} alt="Lampiran Gambar" width={160} height={160} className="rounded-md mt-1.5 object-contain max-h-48 w-auto cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setModalState({ isOpen: true, title:"Preview Gambar Lampiran", message: msg.imageUrl ? <div className="max-h-[60vh] overflow-auto"><Image src={msg.imageUrl} alt="preview" width={400} height={400} className="object-contain rounded-md mx-auto"/></div> : "Tidak ada gambar.", type:"info", buttons:[{text: "Tutup", onClick: closeGenericModal}], onClose: closeGenericModal })} /> )} {msg.file && !msg.imageUrl && (  <a href={msg.file.url || '#'} target="_blank" rel="noopener noreferrer" className="block text-xs mt-1.5 hover:underline p-1.5 bg-black/5 rounded-md"> <PaperclipIcon className="w-[12px] h-[12px] inline mr-1"/>{msg.file.name} ({msg.file.size ? Math.round(msg.file.size / 1024) : 0} KB) </a> )} <p className={`text-xs mt-1 ${timestampClass}`}> {new Date(msg.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} {msg.sender === 'system' && ` - ${new Date(msg.timestamp).toLocaleDateString('id-ID', {day:'numeric',month:'short'})}`} </p> </div> </div> { showRightAvatar && msg.sender !== 'system' && ( <Image src={senderAvatarUrl} alt="Anda" width={32} height={32} className="w-8 h-8 rounded-full ml-2 flex-shrink-0 object-cover shadow-sm"/> )} </div> );
                     })}
                  </div>
                  <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                     {chatImagePreview && (  <div className="mb-2 p-2 border rounded-lg bg-white flex items-center justify-between shadow-sm"> <Image src={chatImagePreview} alt="Preview Lampiran" width={40} height={40} className="object-cover rounded"/> <span className="text-xs text-gray-600 mx-2 truncate flex-grow">{selectedChatFile?.name}</span> <button onClick={() => { setChatImagePreview(null); setSelectedChatFile(null); if(chatFileInputRef.current) chatFileInputRef.current.value = "";}} className="text-red-500 hover:text-red-700 text-xs p-1"> <XIcon className="w-[16px] h-[16px]"/> </button> </div> )}
                    {selectedChatFile && !chatImagePreview && (  <div className="mb-2 p-2.5 border rounded-lg bg-white flex items-center justify-between text-xs text-gray-700 shadow-sm"> <PaperclipIcon className="w-[14px] h-[14px] mr-2 text-gray-500 flex-shrink-0"/> <span className="truncate mr-2 flex-grow">{selectedChatFile.name}</span>  <span className="text-gray-500 flex-shrink-0">({selectedChatFile.size ? Math.round(selectedChatFile.size / 1024) : 0} KB)</span> <button onClick={() => { setSelectedChatFile(null); if(chatFileInputRef.current) chatFileInputRef.current.value = "";}} className="text-red-500 hover:text-red-700 ml-2 p-1"> <XIcon className="w-[16px] h-[16px]"/> </button> </div> )}
                    <div className="flex items-center gap-2"> <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} placeholder="Ketik pesan Anda..." className="flex-grow p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-shadow focus:shadow-sm" /> <input type="file" onChange={(e) => handleFileSelect(e, 'chat')} ref={chatFileInputRef} className="hidden" id="chatFileAttachment"/> <button onClick={() => chatFileInputRef.current?.click()} title="Lampirkan File" className="p-2.5 text-gray-500 hover:text-emerald-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"> <PaperclipIcon className="w-5 h-5" /> </button> <button onClick={handleSendMessage} disabled={(!newMessage.trim() && !selectedChatFile) || isSendingMessage} className="p-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"> <SendIcon className="w-5 h-5" /> </button> </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ProgressPage;