'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const freelancers = [
    {
        id: "0",
        title: "Editor Video Profesional",
        price: 490000,
        description: "After movie, promosi, konten sosial media.",
        image1: "/editor1.jpg",
        image2: "/editor2.jpg",
    },
    {
        id: "1",
        title: "Desainer Logo Kreatif",
        price: 390000,
        description: "Desain logo unik dan profesional.",
        image1: "/design1.jpg",
        image2: "/design2.jpg",
    },
    {
        id: "2",
        title: "Pengelola Media Sosial",
        price: 590000,
        description: "Kelola Instagram, TikTok, & lainnya.",
        image1: "/social1.jpg",
        image2: "/social2.jpg",
    },
    {
        id: "3",
        title: "Pengisi Suara Profesional",
        price: 350000,
        description: "Pengisi suara untuk video, iklan, & narasi.",
        image1: "/voice1.jpg",
        image2: "/voice2.jpg",
    },
];

const formatRupiah = (angka: number): string => {
    return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

interface PaymentPageProps {
    params: {
        id: string;
    };
}

const PaymentPage = ({ params }: PaymentPageProps) => {
    const { id } = params;
    const product = freelancers.find((item) => item.id === id);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const router = useRouter();

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Produk tidak ditemukan.</div>;
    }

    const handlePayNow = () => {
        if (paymentMethod) {
            alert(`Pembayaran berhasil melalui ${paymentMethod} untuk ${product.title}!`);
            // Langsung arahkan ke ProgressPage dengan ID produk
            router.push(`/progress/${product.id}`);
        } else {
            alert('Pilih metode pembayaran terlebih dahulu.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-12 lg:px-20">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gray-50 py-6 px-8 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Pembayaran</h2>
                    <p className="text-gray-600 text-sm mt-1">Selesaikan pembayaran Anda untuk layanan "{product.title}".</p>
                </div>
                <div className="p-8">
                    <div className="mb-6">
                        {/* ... (Ringkasan Pesanan) ... */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Ringkasan Pesanan</h3>
                        <div className="flex items-center border-b border-gray-200 py-2">
                            <div className="w-20 h-20 rounded-md overflow-hidden shadow-sm">
                                <Image src={product.image1} alt={product.title} width={80} height={80} objectFit="cover" />
                            </div>
                            <div className="ml-4 flex-grow">
                                <p className="font-semibold text-gray-800">{product.title}</p>
                                <p className="text-gray-600 text-sm">{product.description.substring(0, 50)}...</p>
                            </div>
                            <span className="font-semibold text-gray-800">{formatRupiah(product.price)}</span>
                        </div>
                        <div className="py-3 text-right">
                            <span className="font-semibold text-gray-800">Total: {formatRupiah(product.price)}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        {/* ... (Pilih Metode Pembayaran) ... */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Pilih Metode Pembayaran</h3>
                        <div className="space-y-3">
                            <div className="border rounded-md p-3 flex items-center justify-between">
                                <label htmlFor="bca" className="flex items-center">
                                    <input type="radio" id="bca" name="payment" value="bca" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <span className="ml-2 text-gray-700">Bank BCA</span>
                                </label>
                                <Image src="/bca.png" alt="BCA" width={40} height={20} objectFit="contain" />
                            </div>
                            <div className="border rounded-md p-3 flex items-center justify-between">
                                <label htmlFor="mandiri" className="flex items-center">
                                    <input type="radio" id="mandiri" name="payment" value="mandiri" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <span className="ml-2 text-gray-700">Bank Mandiri</span>
                                </label>
                                <Image src="/mandiri.png" alt="Mandiri" width={40} height={20} objectFit="contain" />
                            </div>
                            <div className="border rounded-md p-3 flex items-center justify-between">
                                <label htmlFor="gopay" className="flex items-center">
                                    <input type="radio" id="gopay" name="payment" value="gopay" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <span className="ml-2 text-gray-700">GoPay</span>
                                </label>
                                <Image src="/gopay.png" alt="GoPay" width={40} height={20} objectFit="contain" />
                            </div>
                            <div className="border rounded-md p-3 flex items-center justify-between">
                                <label htmlFor="dana" className="flex items-center">
                                    <input type="radio" id="dana" name="payment" value="dana" className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <span className="ml-2 text-gray-700">DANA</span>
                                </label>
                                <Image src="/dana.png" alt="DANA" width={40} height={20} objectFit="contain" />
                            </div>
                            {paymentMethod && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">Anda memilih pembayaran melalui <span className="font-semibold">{paymentMethod}</span>. Silakan lanjutkan ke langkah berikutnya.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <button
                            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${paymentMethod ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-gray-300 cursor-not-allowed'}`}
                            disabled={!paymentMethod}
                            onClick={handlePayNow}
                        >
                            Bayar Sekarang
                        </button>
                        <p className="mt-2 text-xs text-gray-500 text-center">Data Anda akan dienkripsi dengan aman.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;