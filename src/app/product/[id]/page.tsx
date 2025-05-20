// app/product/[id]/page.tsx
"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Star,
  ShieldCheck,
  MessageCircleMore,
} from "lucide-react";
import { useState, useEffect } from "react";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string | null;
  category: string;
  subcategory: string;
  description: string;
  deliveryTime?: string | number; // Tambahkan properti lain sesuai kebutuhan
  revisions?: string | number;
  includedItems?: string[];
  requirements?: string[];
  // Tambahkan properti lain jika ada
};

const SinglePage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setError("Product ID tidak valid.");
      setLoading(false);
      return;
    }

    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      const products: Product[] = JSON.parse(storedProducts);
      const foundProduct = products.find((p) => p.id === id);

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError(`Produk dengan ID ${id} tidak ditemukan.`);
      }
    } else {
      setError("Tidak ada data produk ditemukan.");
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Memuat detail produk...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center mt-20 text-red-500">
        Error: {error || "Produk tidak ditemukan."}{" "}
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16 pb-16 mt-10">
      {/* IMAGE */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        {product.image && (
          <Image
            src={product.image}
            alt={product.title}
            className="rounded-lg w-full object-cover"
            width={500}
            height={500}
            priority
          />
        )}
      </div>

      {/* TEXT */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/* Nama Produk */}
        <h1 className="text-4xl font-semibold">{product.title}</h1>

        {/* Harga */}
        <p className="text-xl text-green-600 font-semibold">
          Rp {parseFloat(product.price).toLocaleString("id-ID")}
        </p>

        {/* Deskripsi */}
        <p className="text-gray-600 text-lg">{product.description}</p>

        {/* Kategori */}
        <div className="text-sm text-gray-500">
          <p>
            <strong>Kategori:</strong> {product.category}
          </p>
          <p>
            <strong>Subkategori:</strong> {product.subcategory}
          </p>
        </div>

        {/* Detail Tambahan (Contoh) */}
        {product.deliveryTime && (
          <p>
            <strong>Waktu Pengiriman:</strong> {product.deliveryTime} hari
          </p>
        )}
        {product.revisions !== undefined && (
          <p>
            <strong>Jumlah Revisi:</strong>{" "}
            {product.revisions === "unlimited"
              ? "Tidak Terbatas"
              : product.revisions}
          </p>
        )}
        {product.includedItems && product.includedItems.length > 0 && (
          <div>
            <h4 className="font-semibold text-lg mt-4 mb-2">
              Termasuk dalam layanan ini:
            </h4>
            <ul className="list-disc pl-4 text-gray-700">
              {product.includedItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {product.requirements && product.requirements.length > 0 && (
          <div>
            <h4 className="font-semibold text-lg mt-4 mb-2">
              Yang dibutuhkan dari Anda:
            </h4>
            <ul className="list-disc pl-4 text-gray-700">
              {product.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Anda bisa menambahkan bagian lain sesuai dengan data yang Anda simpan */}

        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default SinglePage;
