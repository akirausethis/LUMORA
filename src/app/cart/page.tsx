// app/cart/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'; // Menambahkan ShoppingCart icon
import { toast } from 'react-toastify';
import Link from 'next/link'; // Import Link dari next/link

// Definisikan tipe Product (gunakan number untuk price agar konsisten)
type Product = {
    id: string;
    title: string;
    price: number; // Ubah ke number
    image: string | null;
    images?: string[];
    category: string;
    subcategory: string;
    description: string;
    deliveryTime?: string | number;
    revisions?: string | number;
    includedItems?: string[];
    requirements?: string[];
};

// Definisikan tipe CartItem
type CartItem = Product & {
    quantity: number;
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Muat item keranjang dari localStorage saat komponen dimuat
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                const parsedCart: CartItem[] = JSON.parse(storedCart);
                // Pastikan harga adalah number saat parsing
                const validatedCart = parsedCart.map(item => ({
                    ...item,
                    price: parseFloat(String(item.price)) // Konversi ke number
                }));
                setCartItems(validatedCart);
            } catch (e) {
                console.error("Gagal parsing keranjang dari localStorage", e);
                setCartItems([]);
            }
        }
    }, []);

    // Hitung total harga
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Fungsi untuk memperbarui kuantitas item
    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(id); // Jika kuantitas kurang dari 1, hapus item
            return;
        }
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Fungsi untuk menghapus item dari keranjang
    const removeItem = (id: string) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.error(
            <div className="flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                <span>Item telah dihapus dari keranjang.</span>
            </div>,
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "custom-toast-error", // Anda bisa mendefinisikan style ini di globals.css
            }
        );
    };

    const formatPrice = (price: number) => { // Ubah tipe ke number
        return price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Fungsi untuk melanjutkan ke pembayaran
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warn(
                <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-orange-500" />
                    <span>Keranjang Anda kosong.</span>
                </div>,
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
            return;
        }

        // Buat ID transaksi unik
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Simpan keranjang saat ini dengan ID transaksi sebagai key di localStorage
        localStorage.setItem(`checkoutCart_${transactionId}`, JSON.stringify(cartItems));

        // Arahkan ke halaman pembayaran dengan ID transaksi
        router.push(`/payment/${transactionId}`);
    };

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Keranjang Belanja Anda</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-4">Keranjang Anda kosong.</p>
          <button
            onClick={() => router.push("/explore")}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Lanjutkan Belanja
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Keranjang */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-lg shadow-md">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="w-24 h-24 flex-shrink-0 relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-gray-600 text-sm">
                    {item.category} / {item.subcategory}
                  </p>
                  <p className="text-blue-600 font-bold mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 border rounded-full hover:bg-gray-100 transition"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-medium text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 border rounded-full hover:bg-gray-100 transition"
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 p-2 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-max sticky top-20">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Ringkasan Pesanan</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-800">{formatPrice(calculateTotal())}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700">Biaya Layanan:</span>
              <span className="font-semibold text-gray-800">{formatPrice(0)}</span> {/* Anda bisa menambahkan logika biaya layanan di sini */}
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;