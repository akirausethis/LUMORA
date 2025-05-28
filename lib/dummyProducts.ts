// your-nextjs-project/lib/dummyProducts.ts

// ... (Definisi tipe Product, categories_id, subcategoriesMap_id, generateUniqueId tetap sama)
// ... (Array dummyProducts dan pengisiannya juga tetap sama)

type Product = {
  id: string;
  title: string;
  price: string;
  image: string | null;
  images?: string[];
  category: string;
  subcategory: string;
  description: string;
  deliveryTime?: string | number;
  revisions?: string | number; // Bisa string "unlimited" atau number
  includedItems?: string[];
  requirements?: string[];
  sellerId?: string;
};

const categories_id = [
  "Desain Karakter", "Ilustrasi", "Seni Konsep", "Desain UI/UX", "Branding",
  "Desain Merchandise", "Aset Grafis", "Pemodelan 3D", "Animasi",
  "Emote & Lencana", "Permintaan Kustom",
];
const subcategoriesMap_id: Record<string, string[]> = {
  "Desain Karakter": ["Karakter Orisinal (OC)", "Karakter D&D", "Fanart"],
  "Ilustrasi": ["Potret", "Full Body", "Latar Belakang Pemandangan"],
  "Seni Konsep": ["Desain Lingkungan", "Desain Makhluk", "Desain Senjata/Item"],
  "Desain UI/UX": ["Mockup Aplikasi", "Tata Letak Situs Web", "Antarmuka Game"],
  "Branding": ["Desain Logo", "Palet Warna", "Identitas Visual"],
  "Desain Merchandise": ["Desain Stiker", "Desain Kaos", "Seni Gantungan Kunci"],
  "Aset Grafis": ["Ikon", "Elemen UI", "Aset Game"],
  "Pemodelan 3D": ["Model Karakter", "Props", "Seni Low-Poly"],
  "Animasi": ["GIF", "Animasi Karakter", "Emote Bergerak"],
  "Emote & Lencana": ["Emote Twitch", "Stiker Discord", "Lencana Subscriber"],
  "Permintaan Kustom": ["Seni Pasangan", "Potret Hewan Peliharaan", "Adegan Fantasi"],
};
const generateUniqueId = () => `product-dummy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const dummyProducts: Product[] = []; // Pastikan ini diekspor

// Isi array dummyProducts (Contoh pengisian yang lebih ringkas)
categories_id.forEach(mainCategory => {
  const subcategories = subcategoriesMap_id[mainCategory] || ["Layanan Umum"]; // Fallback jika tidak ada subkategori
  subcategories.forEach(subCategory => {
    for (let i = 0; i < 1; i++) { // Buat 1 dummy per subkategori agar tidak terlalu banyak
      const productId = generateUniqueId();
      const productTitle = `${subCategory} ${mainCategory} Kustom #${i + 1}`;
      const price = (100000 + Math.floor(Math.random() * 500000)).toString();
      const dummyImageUrl = `https://picsum.photos/seed/${productId}/400/300`;
      dummyProducts.push({
        id: productId,
        title: productTitle,
        price: price,
        image: dummyImageUrl,
        images: [dummyImageUrl, `https://picsum.photos/seed/${productId}a/400/300`],
        category: mainCategory,
        subcategory: subCategory === "Layanan Umum" && !subcategoriesMap_id[mainCategory] ? "" : subCategory,
        description: `Layanan kustom untuk ${productTitle}. Sempurna untuk kebutuhan desain ${subCategory} Anda.`,
        deliveryTime: (5 + Math.floor(Math.random() * 5)),
        revisions: Math.random() < 0.5 ? "unlimited" : (Math.floor(Math.random() * 3) + 1),
        includedItems: [`Desain ${subCategory}`, "File Resolusi Tinggi"],
        requirements: ["Deskripsi singkat proyek", "Referensi visual (jika ada)"],
        sellerId: "dummy-seller-id" // Tambahkan sellerId dummy jika perlu
      });
    }
  });
});


// --- PERBARUI FUNGSI SEEDING INI ---
export const seedProductsToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    let productsInStorage: Product[] = [];
    const storedProductsString = localStorage.getItem("products");
    if (storedProductsString) {
      try {
        productsInStorage = JSON.parse(storedProductsString);
        if (!Array.isArray(productsInStorage)) productsInStorage = [];
      } catch (e) {
        console.warn("Gagal parse 'products' dari localStorage saat seeding:", e);
        productsInStorage = [];
      }
    }

    // Buat Map dari produk yang ada di storage untuk kemudahan update/cek
    const storageProductMap = new Map(productsInStorage.map(p => [p.id, p]));

    // Tambahkan atau perbarui produk dummy dari array dummyProducts saat ini
    // Ini memastikan ID dummy yang "fresh" dari kode selalu ada atau diperbarui di storage
    dummyProducts.forEach(dummyProd => {
      storageProductMap.set(dummyProd.id, dummyProd);
    });

    // Produk yang akan disimpan adalah gabungan dari dummy terbaru dan produk pengguna yang sudah ada
    const finalProductsToStore = Array.from(storageProductMap.values());

    localStorage.setItem("products", JSON.stringify(finalProductsToStore));
    console.log("LocalStorage 'products' disinkronkan dengan dummyProducts terbaru dan produk pengguna.");
  }
};