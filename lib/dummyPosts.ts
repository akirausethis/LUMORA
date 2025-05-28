// your-nextjs-project/lib/dummyPosts.ts

type PortfolioPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  image?: string; // Gambar utama untuk thumbnail, bisa jadi images[0]
  images?: string[]; // Array of images for detailed view
  createdAt?: string;
  description?: string;
};

// Fungsi untuk menghasilkan ID unik
const generateUniquePostId = () => `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const dummyPosts: PortfolioPost[] = [
  {
    id: generateUniquePostId(),
    title: "Desain Logo Modern untuk Startup Tech",
    image: "https://picsum.photos/seed/techlogo/600/400",
    images: [
      "https://picsum.photos/seed/techlogo1/800/600",
      "https://picsum.photos/seed/techlogo2/800/600",
      "https://picsum.photos/seed/techlogo3/800/600",
    ],
    category: "Branding",
    author: "Rizky Firmansyah",
    createdAt: "2024-05-20T10:30:00Z",
    description: `Desain logo yang minimalis dan modern untuk startup di bidang teknologi. Menggunakan palet warna biru dan abu-abu yang menenangkan untuk memancarkan kesan inovasi, kepercayaan, dan profesionalisme. Konsep logo terinspirasi dari jaring-jaring konektivitas digital.`,
  },
  {
    id: generateUniquePostId(),
    title: "Redesign UI Aplikasi E-commerce",
    image: "https://picsum.photos/seed/ecommerceui/600/400",
    images: [
      "https://picsum.photos/seed/ecommerceui1/800/600",
      "https://picsum.photos/seed/ecommerceui2/800/600",
      "https://picsum.photos/seed/ecommerceui3/800/600",
      "https://picsum.photos/seed/ecommerceui4/800/600",
    ],
    category: "UI/UX",
    author: "Siti Rahayu",
    createdAt: "2024-05-18T14:15:00Z",
    description: `Melakukan redesign antarmuka pengguna (UI) untuk aplikasi e-commerce yang sudah ada, dengan fokus pada peningkatan pengalaman pengguna (UX). Iterasi desain meliputi alur checkout yang disederhanakan, tampilan produk yang lebih menarik, dan navigasi yang intuitif.`,
  },
  {
    id: generateUniquePostId(),
    title: "Ilustrasi Karakter Game Fantasi",
    image: "https://picsum.photos/seed/gamechar/600/400",
    images: [
      "https://picsum.photos/seed/gamechar1/800/600",
      "https://picsum.photos/seed/gamechar2/800/600",
    ],
    category: "Desain Karakter",
    author: "Bagus Putra",
    createdAt: "2024-05-15T09:00:00Z",
    description: `Pembuatan desain karakter orisinal untuk game RPG fantasi. Karakter ini adalah seorang penyihir wanita dengan elemen alam yang kuat. Ilustrasi mencakup detail pakaian, aksesori, dan ekspresi wajah yang beragam untuk memberikan kedalaman pada karakter.`,
  },
  {
    id: generateUniquePostId(),
    title: "Video Animasi Explainer Produk Baru",
    image: "https://picsum.photos/seed/explainer/600/400",
    images: [
      "https://picsum.photos/seed/explainer1/800/600", // Contoh frame dari video
    ],
    category: "Animasi",
    author: "Dewi Lestari",
    createdAt: "2024-05-10T11:45:00Z",
    description: `Pembuatan video animasi explainer berdurasi 90 detik untuk memperkenalkan produk perangkat lunak baru. Gaya animasi flat design dengan transisi yang halus, menjelaskan fitur utama dan manfaat produk secara ringkas dan menarik.`,
  },
  {
    id: generateUniquePostId(),
    title: "Desain Sampul Buku Fiksi Ilmiah",
    image: "https://picsum.photos/seed/bookcover/600/400",
    images: [
      "https://picsum.photos/seed/bookcover1/800/600",
      "https://picsum.photos/seed/bookcover2/800/600",
    ],
    category: "Ilustrasi",
    author: "Arif Hidayat",
    createdAt: "2024-05-05T16:00:00Z",
    description: `Desain sampul buku untuk novel fiksi ilmiah dengan tema luar angkasa dan eksplorasi. Menggunakan teknik digital painting untuk menciptakan visual yang epik dan misterius, menarik pembaca untuk menyelami kisah di dalamnya.`,
  },
  {
    id: generateUniquePostId(),
    title: "Pemodelan 3D Interior Ruangan Minimalis",
    image: "https://picsum.photos/seed/3dinterior/600/400",
    images: [
      "https://picsum.photos/seed/3dinterior1/800/600",
      "https://picsum.photos/seed/3dinterior2/800/600",
      "https://picsum.photos/seed/3dinterior3/800/600",
    ],
    category: "Pemodelan 3D",
    author: "Cindy Octavia",
    createdAt: "2024-04-28T09:30:00Z",
    description: `Render 3D interior ruangan bergaya minimalis modern untuk sebuah proyek arsitektur. Detail meliputi pencahayaan natural, material furniture, dan penataan ruang yang efisien. Hasil akhir berupa gambar render berkualitas tinggi siap presentasi.`,
  },
  {
    id: generateUniquePostId(),
    title: "Set Ikon Kustom untuk Website",
    image: "https://picsum.photos/seed/icons/600/400",
    images: [
      "https://picsum.photos/seed/icons1/800/600",
    ],
    category: "Aset Grafis",
    author: "Eko Prasetyo",
    createdAt: "2024-04-20T13:00:00Z",
    description: `Pembuatan set ikon vektor kustom untuk navigasi website dan elemen UI lainnya. Ikon dirancang agar konsisten dengan brand guidelines klien, memastikan tampilan yang bersih dan mudah dipahami oleh pengguna.`,
  },
  {
    id: generateUniquePostId(),
    title: "Desain Emote dan Badge Twitch Pack",
    image: "https://picsum.photos/seed/twitchpack/600/400",
    images: [
      "https://picsum.photos/seed/twitchpack1/200/200",
      "https://picsum.photos/seed/twitchpack2/200/200",
      "https://picsum.photos/seed/twitchpack3/200/200",
      "https://picsum.photos/seed/twitchpack4/200/200",
    ],
    category: "Emote & Lencana",
    author: "Putri Anggraini",
    createdAt: "2024-04-10T17:00:00Z",
    description: `Paket lengkap desain emote dan badge subscriber untuk channel Twitch. Menggambarkan berbagai ekspresi wajah dan objek lucu yang relevan dengan komunitas streamer, siap untuk diunggah dan digunakan.`,
  },
  {
    id: generateUniquePostId(),
    title: "Desain Merchandise Kaos Konser Band",
    image: "https://picsum.photos/seed/bandshirt/600/400",
    images: [
      "https://picsum.photos/seed/bandshirt1/800/600",
      "https://picsum.photos/seed/bandshirt2/800/600",
    ],
    category: "Desain Merchandise",
    author: "Fajar Santoso",
    createdAt: "2024-03-25T10:00:00Z",
    description: `Desain kaos khusus untuk merchandise konser band rock. Menggabungkan ilustrasi grafis yang kuat dengan tipografi yang bold, menciptakan desain yang menarik dan ikonik untuk para penggemar.`,
  },
];

// Fungsi untuk menyemai produk dummy ke localStorage
export const seedPortfolioPostsToLocalStorage = () => {
  // Pastikan kode ini hanya berjalan di sisi klien (browser)
  if (typeof window !== 'undefined') {
    const storedPosts = localStorage.getItem("designerPosts");
    // Jika tidak ada produk di localStorage ATAU array produk kosong, baru tambahkan dummy data
    if (!storedPosts || JSON.parse(storedPosts).length === 0) {
      console.log("Menyemai dummy portfolio posts ke localStorage...");
      localStorage.setItem("designerPosts", JSON.stringify(dummyPosts));
    } else {
      console.log("LocalStorage 'designerPosts' sudah berisi data. Melewatkan penyemaian data dummy.");
    }
  }
};