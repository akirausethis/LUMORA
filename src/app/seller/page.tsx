// SellerPage.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "@heroicons/react/outline";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string | null;
  category: string;
  subcategory: string;
  description: string;
};

const SellerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(savedProducts);
  }, []);

  const handleNavigate = (id: string) => {
    router.push(`/product/${id}`); // Ubah rute sesuai struktur folder Anda
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* ... (kode sidebar tidak berubah) ... */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center text-white">
                <span className="text-xs">Evelyn</span>
              </div>
              <h2 className="text-xl font-semibold">Phainon</h2>
              <p className="text-gray-600 text-sm mb-4">@omg_phainon_hot</p>
              <button className="w-full py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                View profile
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Level overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">My level</span>
                  <span className="font-medium">New seller</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success score</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response rate</span>
                  <span>-</span>
                </div>
              </div>
              <button className="w-full py-2 mt-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                View progress
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, Evelyn and Phainon
              </h1>
              <p className="text-gray-600">
                Find important messages, tips, and links to helpful resources
                here:
              </p>
            </div>

            {/* Tombol Add More Product (di atas daftar produk) */}
            {products.length > 0 && (
              <div className="mb-6">
                <Link href="/addproduct">
                  <button className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition">
                    <span className="flex items-center">
                      <PlusCircleIcon className="h-5 w-5 mr-2" />
                      Add More Product
                    </span>
                  </button>
                </Link>
              </div>
            )}

            {/* Product List or Empty State */}
            {products.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 text-white shadow-lg flex flex-col items-center justify-center">
                <PlusCircleIcon className="h-12 w-12 mb-4 text-blue-100" />
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Ready to showcase your work?
                </h2>
                <p className="text-blue-100 mb-6 text-center">
                  Add your first product and open your shop to the world.
                </p>
                <Link href="/addproduct" className="w-full sm:w-auto">
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition w-full text-center">
                    <span className="flex items-center justify-center">
                      <PlusCircleIcon className="h-5 w-5 mr-2" />
                      Add New Product
                    </span>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
                    onClick={() => handleNavigate(product.id)}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {product.category} / {product.subcategory}
                    </p>
                    <p className="text-blue-600 font-bold mt-1">
                      {product.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerPage;