"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Definisikan tipe Product
type Product = {
  title: string;
  price: string;
  image: string | null;
  category: string;
  subcategory: string;
  description: string;
};

const SellerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(savedProducts);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center text-white">
                <span className="text-xs">AKIRA</span>
              </div>
              <h2 className="text-xl font-semibold">Byakira</h2>
              <p className="text-gray-600 text-sm mb-4">@just_akira</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Welcome, Byakira</h1>
              <p className="text-gray-600">
                Find important messages, tips, and links to helpful resources here:
              </p>
            </div>

            {/* Conditional UI */}
            {products.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold mb-2">Start your selling journey!</h2>
                    <p className="text-blue-100 mb-3">
                      Create your first product and reach customers worldwide
                    </p>
                    <ul className="text-blue-100 mb-4 space-y-2">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM13.707 8.293a1 1 0 00-1.414-1.414L10 9.172 7.707 6.879a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                        </svg>
                        Set your own prices
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM13.707 8.293a1 1 0 00-1.414-1.414L10 9.172 7.707 6.879a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                        </svg>
                        Showcase your expertise
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM13.707 8.293a1 1 0 00-1.414-1.414L10 9.172 7.707 6.879a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                        </svg>
                        Grow your business online
                      </li>
                    </ul>
                  </div>
                  <Link
                    href="/addproduct"
                    className="bg-white text-indigo-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create your first product
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Link
                  href="/addproduct"
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-transform font-medium px-5 py-2 rounded-md shadow-md"
                >
                  Add Product
                </Link>
              </div>
            )}

            {/* Active Orders Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Gigs - {products.length}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt="Product Image"
                        width={200}
                        height={150}
                        className="rounded-md object-cover"
                      />
                    )}
                    <h3 className="font-semibold text-lg mt-2">{product.title}</h3>
                    <p className="text-gray-500 text-sm">{product.category} / {product.subcategory}</p>
                    <p className="text-gray-600 text-sm mt-2">
                      {product.description.length > 100
                        ? `${product.description.slice(0, 100)}...`
                        : product.description}
                    </p>
                    <p className="text-gray-800 font-semibold mt-2">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerPage;
