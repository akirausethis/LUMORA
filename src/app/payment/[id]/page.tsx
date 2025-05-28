// src/app/payment/[id]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NotificationModal, { ModalButton } from '@/components/NotificationModal';
import { 
    CreditCardIcon, 
    MailIcon, 
    UserIcon, 
    ShoppingBagIcon, 
    ArrowLeftIcon as SolidArrowLeftIcon 
} from "@heroicons/react/solid"; // Path untuk Heroicons v2 Solid
import { QrcodeIcon } from "@heroicons/react/outline"; // Path untuk Heroicons v2 Outline
import { XIcon } from "lucide-react"; // Untuk tombol close di modal QR

// Definisikan tipe Product (pastikan konsisten)
type Product = {
    id: string; title: string; price: number; image: string | null; images?: string[];
    category: string; subcategory: string; description: string;
    deliveryTime?: string | number; revisions?: string | number;
    includedItems?: string[]; requirements?: string[]; sellerId?: string;
};
type CartItem = Product & { quantity: number; };
export type Order = { // Diekspor agar bisa diimpor di ProgressPage jika perlu
    orderId: string; transactionId: string; items: CartItem[]; totalAmount: number;
    paymentMethod: string; // Akan menyimpan nama metode yang dipilih
    customerName: string; customerEmail: string;
    orderDate: string; status: 'paid' | 'processing' | 'completed' | 'cancelled';
};

interface ModalStateType {
  isOpen: boolean; title: string; message: React.ReactNode;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons: ModalButton[]; onClose?: () => void;
}

// State untuk modal pembayaran QR
interface QRPaymentModalStateType {
    isOpen: boolean;
    qrCodeUrl: string; 
    amount: number;
    paymentMethodName: string; 
    orderToProceed: Order | null;
}

const PaymentPage = () => {
    const params = useParams();
    const transactionId = params.id as string;
    const router = useRouter();

    const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const initialModalState: ModalStateType = {
        isOpen: false, title: '', message: '', type: 'info', buttons: [], onClose: undefined,
    };
    const [modalState, setModalState] = useState<ModalStateType>(initialModalState);
    const closeGenericModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

    const [qrPaymentModal, setQrPaymentModal] = useState<QRPaymentModalStateType>({
        isOpen: false,
        qrCodeUrl: '/qr-dummy-generic.png', // Pastikan gambar ini ada di public
        amount: 0,
        paymentMethodName: '',
        orderToProceed: null,
    });
    const closeQrPaymentModal = () => setQrPaymentModal(prev => ({ ...prev, isOpen: false, orderToProceed: null }));

    const paymentMethods = [
        { id: 'qris_generic', name: 'Scan QR (Semua E-Wallet & M-Banking)', icon: <QrcodeIcon className="w-6 h-6 mr-2 text-emerald-600" /> },
        { id: 'bank_transfer_bca', name: 'Bank Transfer (Virtual Account BCA)', icon: <Image src="/bca.webp" alt="BCA" width={30} height={18} className="mr-2 object-contain"/> },
        { id: 'bank_transfer_mandiri', name: 'Bank Transfer (Virtual Account Mandiri)', icon: <Image src="/mandiri.webp" alt="Mandiri" width={36} height={18} className="mr-2 object-contain"/> },
        { id: 'credit_card', name: 'Kartu Kredit/Debit (Visa, Mastercard)', icon: <CreditCardIcon className="w-5 h-5 mr-2 text-sky-600" /> },
    ];

    useEffect(() => {
        const storedCurrentUser = localStorage.getItem('currentUser');
        if (storedCurrentUser) {
            try {
                const currentUser: { fullName?: string; email?: string } = JSON.parse(storedCurrentUser);
                if (currentUser.fullName) setCustomerName(currentUser.fullName);
                if (currentUser.email) setCustomerEmail(currentUser.email);
            } catch (e) { console.warn("Gagal parse currentUser:", e); }
        }

        if (transactionId) {
            const storedCheckoutCart = localStorage.getItem(`checkoutCart_${transactionId}`);
            if (storedCheckoutCart) {
                try {
                    const parsedCart: CartItem[] = JSON.parse(storedCheckoutCart);
                    const validatedCart = parsedCart.map(item => ({ ...item, price: parseFloat(String(item.price)) || 0 }));
                    if (validatedCart.length === 0) {
                        setModalState({ isOpen: true, title: "Keranjang Kosong", message: "Keranjang pembayaran Anda kosong.", type: 'warning', buttons: [{ text: 'Ke Keranjang', onClick: () => { closeGenericModal(); router.push("/cart"); }}], onClose: () => { closeGenericModal(); router.push("/cart"); }});
                        // Jangan return di sini agar loading tetap false di akhir
                    }
                    setCheckoutItems(validatedCart);
                } catch (e: any) {
                    setModalState({ isOpen: true, title: "Error Data Pembayaran", message: e.message || "Gagal memuat detail pembayaran. Silakan coba dari keranjang.", type: 'error',
                        buttons: [{ text: 'Ke Keranjang', onClick: () => { closeGenericModal(); router.push("/cart"); }}],
                        onClose: () => { closeGenericModal(); router.push("/cart"); }});
                }
            } else {
                 setModalState({ isOpen: true, title: "Sesi Tidak Valid", message: "Detail pembayaran tidak ada atau sudah diproses. Kembali ke keranjang.", type: 'warning',
                    buttons: [{ text: 'Ke Keranjang', onClick: () => { closeGenericModal(); router.push("/cart"); }}],
                    onClose: () => { closeGenericModal(); router.push("/cart"); }});
            }
        } else {
            setModalState({ isOpen: true, title: "ID Transaksi Error", message: "ID Transaksi tidak ditemukan.", type: 'error',
                buttons: [{ text: 'Ke Beranda', onClick: () => { closeGenericModal(); router.push("/"); }}],
                onClose: () => { closeGenericModal(); router.push("/"); }});
        }
        setIsLoading(false); // Pastikan setIsLoading(false) di akhir semua jalur
    }, [transactionId, router]);

    const calculateTotal = () => checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const formatPrice = (price: number) => price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const confirmAndSaveOrder = async (orderToSave: Order) => {
        setIsProcessingPayment(true);
        closeQrPaymentModal();
        setModalState({
            isOpen: true, title: "Memverifikasi Pembayaran...",
            message: "Harap tunggu, sistem sedang memverifikasi pembayaran Anda.",
            type: 'info', buttons: [], onClose: undefined
        });

        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

        try {
            const existingOrders: Order[] = JSON.parse(localStorage.getItem("userOrders") || "[]");
            localStorage.setItem("userOrders", JSON.stringify([...existingOrders, orderToSave]));
            localStorage.removeItem(`checkoutCart_${transactionId}`);
            localStorage.removeItem("cart");

            closeGenericModal();
            setModalState({
                isOpen: true, title: "Pembayaran Berhasil!",
                message: `Pesanan Anda #${orderToSave.orderId} dengan metode ${orderToSave.paymentMethod} telah diterima.\nAnda akan diarahkan ke halaman progres.`, type: 'success',
                buttons: [{ text: 'Lihat Progres Pesanan', onClick: () => {
                    closeGenericModal(); router.push(`/progress/${orderToSave.orderId}`);
                }}],
                onClose: () => {closeGenericModal(); router.push(`/progress/${orderToSave.orderId}`);}
            });
        } catch (error) {
            console.error("Gagal menyimpan pesanan setelah konfirmasi QR:", error);
            closeGenericModal();
            setModalState({isOpen: true, title: "Error Sistem", message: "Terjadi kesalahan saat memproses pesanan Anda setelah konfirmasi.", type: 'error', buttons: [{text: "Tutup", onClick: closeGenericModal}], onClose: closeGenericModal});
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleProcessPayment = async () => {
        if (!customerName.trim() || !customerEmail.trim()) {
            setModalState({isOpen: true, title: "Data Tidak Lengkap", message: "Harap isi Nama Lengkap dan Alamat Email Anda.", type: 'warning', buttons: [{text: "Mengerti", onClick: closeGenericModal}], onClose: closeGenericModal});
            return;
        }
        if (!/\S+@\S+\.\S+/.test(customerEmail)) {
            setModalState({isOpen: true, title: "Format Email Salah", message: "Format alamat email yang Anda masukkan tidak valid.", type: 'warning', buttons: [{text: "Mengerti", onClick: closeGenericModal}], onClose: closeGenericModal});
            return;
        }
        if (!selectedPaymentMethod) {
            setModalState({isOpen: true, title: "Metode Pembayaran", message: "Harap pilih salah satu metode pembayaran.", type: 'warning', buttons: [{text: "Mengerti", onClick: closeGenericModal}], onClose: closeGenericModal});
            return;
        }
        if (checkoutItems.length === 0) {
             setModalState({isOpen: true, title: "Keranjang Kosong", message: "Tidak ada item untuk dibayar.", type: 'warning', buttons: [{text: "OK", onClick: closeGenericModal}], onClose: closeGenericModal});
            return;
        }


        const paymentMethodObject = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
        if (!paymentMethodObject) {
             setModalState({isOpen: true, title: "Error", message: "Metode pembayaran tidak valid.", type: 'error', buttons: [{text: "OK", onClick: closeGenericModal}], onClose: closeGenericModal});
            return;
        }

        const newOrderId = `LUMORA-ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const orderDetails: Order = {
            orderId: newOrderId, transactionId: String(transactionId), items: checkoutItems,
            totalAmount: calculateTotal(), 
            paymentMethod: paymentMethodObject.name,
            customerName: customerName, customerEmail: customerEmail,
            orderDate: new Date().toISOString(), status: 'paid',
        };

        setQrPaymentModal({
            isOpen: true,
            qrCodeUrl: '/qr-dummy-generic.png', 
            amount: orderDetails.totalAmount,
            paymentMethodName: paymentMethodObject.name,
            orderToProceed: orderDetails
        });
    };

    if (isLoading) {
        return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div> <p className="ml-3 text-gray-700">Memuat detail pembayaran...</p> </div> );
    }
    
    // Tampilkan pesan keranjang kosong jika memang kosong dan tidak ada modal error/QR yang aktif
    if (checkoutItems.length === 0 && !modalState.isOpen && !qrPaymentModal.isOpen) {
         return ( <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6"> <ShoppingBagIcon className="w-24 h-24 text-gray-300 mb-6" /> <h2 className="text-2xl font-semibold text-gray-700 mb-3">Keranjang Pembayaran Kosong</h2> <p className="text-gray-500 mb-8 text-center max-w-md"> Tidak ada item untuk pembayaran ini atau transaksi mungkin sudah selesai. </p> <button onClick={() => router.push("/explore")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg hover:bg-emerald-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg" > Lanjutkan Belanja </button> </div> );
    }

    return (
        <>
            <NotificationModal {...modalState} />
            {qrPaymentModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full text-center transform transition-all scale-100 opacity-100 animate-modalShow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 text-left">Bayar dengan {qrPaymentModal.paymentMethodName}</h3>
                            <button onClick={closeQrPaymentModal} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                            Silakan pindai QR Code di bawah ini untuk menyelesaikan pembayaran Anda.
                        </p>
                        <div className="my-6 flex justify-center">
                            <Image src={qrPaymentModal.qrCodeUrl} alt="QR Code Pembayaran" width={280} height={280} className="border-4 border-emerald-200 rounded-lg shadow-sm p-1 bg-white" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">Total Pembayaran:</p>
                        <p className="text-3xl font-bold text-emerald-600 mb-6">{formatPrice(qrPaymentModal.amount)}</p>
                        <p className="text-xs text-gray-500 mb-3">Setelah melakukan pembayaran, klik tombol konfirmasi di bawah ini.</p>
                        <button
                            onClick={() => qrPaymentModal.orderToProceed && confirmAndSaveOrder(qrPaymentModal.orderToProceed)}
                            disabled={isProcessingPayment}
                            className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg
                                ${isProcessingPayment ? 'bg-gray-400 text-gray-800 cursor-wait' : 'bg-emerald-500 text-white hover:bg-emerald-600 '}`}
                        >
                            {isProcessingPayment ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Memverifikasi...
                                </div>
                            ) : "Saya Sudah Bayar & Konfirmasi"}
                        </button>
                         <p className="text-xs text-gray-400 mt-4 italic">Ini adalah simulasi pembayaran. Tidak ada transaksi nyata yang terjadi.</p>
                    </div>
                </div>
            )}

            {/* Hanya render bagian utama jika ada item dan tidak ada modal QR aktif */}
            {(checkoutItems.length > 0 && !qrPaymentModal.isOpen) && (
                <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 selection:bg-emerald-500 selection:text-white">
                    <div className="max-w-4xl mx-auto">
                        <button onClick={() => router.push('/cart')} className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group text-sm font-medium"> <SolidArrowLeftIcon className="w-5 h-5 mr-1.5 transition-transform group-hover:-translate-x-1" /> Kembali ke Keranjang </button>
                        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 text-center">Rincian Pembayaran</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
                            <div className="lg:col-span-3 space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">Detail Pesanan Anda</h2>
                                    {checkoutItems.map((item) => (
                                        <div key={item.id} className="flex items-start gap-4 pt-1 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                                                {item.image ? ( <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" /> ) : ( <ShoppingBagIcon className="w-full h-full text-gray-300 p-2"/> )}
                                            </div>
                                            <div className="flex-grow"> <h3 className="text-sm sm:text-md font-semibold text-gray-700 leading-tight line-clamp-2">{item.title}</h3> <p className="text-gray-500 text-xs sm:text-sm">Kuantitas: {item.quantity}</p> <p className="text-emerald-600 font-semibold mt-0.5 text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p> </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">Informasi Kontak</h2>
                                    <div className="space-y-4">
                                        <div> <label htmlFor="customerName" className="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label> <div className="relative"> <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" /> <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nama Anda" className="w-full text-sm pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder-gray-400"/> </div> </div>
                                        <div> <label htmlFor="customerEmail" className="block text-xs font-medium text-gray-600 mb-1">Alamat Email</label> <div className="relative"> <MailIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" /> <input type="email" id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Email Anda" className="w-full text-sm pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder-gray-400"/> </div> </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 space-y-6 sticky top-24 self-start">
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">Pilih Metode Pembayaran</h2>
                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => (
                                            <label key={method.id} htmlFor={`payment-${method.id}`} className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:border-emerald-400 ${ selectedPaymentMethod === method.id ? 'border-emerald-500 ring-2 ring-emerald-500/70 bg-emerald-50/50' : 'border-gray-200' }`}>
                                                <input type="radio" id={`payment-${method.id}`} name="paymentMethod" value={method.id} checked={selectedPaymentMethod === method.id} onChange={() => setSelectedPaymentMethod(method.id)} className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500"/>
                                                <div className="ml-3 flex items-center gap-2">{method.icon} <span className="text-xs sm:text-sm font-medium text-gray-700">{method.name}</span></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">Ringkasan Pembayaran</h2>
                                     <div className="space-y-2.5 text-sm"> <div className="flex justify-between items-center"> <span className="text-gray-600">Subtotal ({checkoutItems.reduce((acc, item) => acc + item.quantity, 0)} item):</span> <span className="font-medium text-gray-800">{formatPrice(calculateTotal())}</span> </div> <div className="flex justify-between items-center"> <span className="text-gray-600">Biaya Layanan & Pajak:</span> <span className="font-medium text-gray-800">{formatPrice(0)}</span> </div> <div className="border-t border-gray-200 my-3 pt-3"></div> <div className="flex justify-between items-center text-lg"> <span className="font-bold text-gray-800">Total Tagihan:</span> <span className="font-bold text-emerald-600">{formatPrice(calculateTotal())}</span> </div> </div>
                                    <button onClick={handleProcessPayment} disabled={isProcessingPayment || checkoutItems.length === 0}
                                        className={`mt-6 w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 ${isProcessingPayment ? 'opacity-70 cursor-wait' : ''} ${checkoutItems.length === 0 ? 'bg-gray-300 text-gray-700 hover:bg-gray-300 cursor-not-allowed' : ''}`}>
                                        {isProcessingPayment ? ( <div className="flex items-center justify-center"> <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Memproses... </div> ) : ( <div className="flex items-center justify-center"> <CreditCardIcon className="w-5 h-5 mr-2"/> Bayar Sekarang </div> )}
                                    </button>
                                    {transactionId && <p className="text-xs text-gray-400 mt-3 text-center">ID Transaksi: <span className="font-mono">{String(transactionId)}</span></p>}
                                </div>
                            </div>
                        </div>
                        )
                </div>
            </div>
            )
        }</>
    );
};

export default PaymentPage;