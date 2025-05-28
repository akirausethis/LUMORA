// "use client";

// import Image from "next/image";
// import { useEffect, useState } from "react";

// const freelancers = [
//   {
//     id: "0",
//     title: "Editor Video Profesional",
//     price: 490000,
//     description: "After movie, promosi, konten sosial media.",
//     image1: "/editor1.jpg",
//     image2: "/editor2.jpg",
//     category: "Video & Animasi",
//     subcategory: "Video Editing",
//     skills: [
//       "After Movie",
//       "Video Promosi",
//       "Konten Sosial Media",
//       "Motion Graphics",
//       "Color Grading",
//       "Sound Design",
//     ],
//     rating: 5.0,
//     reviewCount: 62,
//     testimonials: [
//       {
//         name: "Rina",
//         role: "Event Organizer",
//         text: "Hasil editannya keren banget! Detail, profesional, dan cepet banget responnya.",
//       },
//       {
//         name: "Dimas",
//         role: "Owner Clothing Brand",
//         text: "Video promosi toko online ku langsung keliatan pro, banyak yang nanya siapa editornya!",
//       },
//     ],
//     image: "/editor_single.jpg", // Tambahkan gambar untuk single page
//   },
//   {
//     id: "1",
//     title: "Desainer Logo Kreatif",
//     price: 390000,
//     description: "Desain logo unik dan profesional.",
//     image1: "/design1.jpg",
//     image2: "/design2.jpg",
//     category: "Desain & Kreatif",
//     subcategory: "Desain Logo",
//     skills: [
//       "Desain Logo",
//       "Brand Identity",
//       "Visual Branding",
//       "Logo Modern",
//       "Desain Minimalis",
//     ],
//     rating: 4.8,
//     reviewCount: 45,
//     testimonials: [
//       {
//         name: "Budi",
//         role: "Startup Founder",
//         text: "Logonya dapet banget esensi bisnis kami, prosesnya juga enak diajak diskusi.",
//       },
//       {
//         name: "Siti",
//         role: "UMKM Owner",
//         text: "Desainnya fresh dan beda dari yang lain, harganya juga oke.",
//       },
//     ],
//     image: "/design_single.jpg", // Tambahkan gambar untuk single page
//   },
//   {
//     id: "2",
//     title: "Pengelola Media Sosial",
//     price: 590000,
//     description: "Kelola Instagram, TikTok, & lainnya.",
//     image1: "/social1.jpg",
//     image2: "/social2.jpg",
//     category: "Pemasaran",
//     subcategory: "Social Media Management",
//     skills: [
//       "Instagram Marketing",
//       "TikTok Management",
//       "Content Creation",
//       "Social Media Strategy",
//       "Engagement",
//     ],
//     rating: 4.9,
//     reviewCount: 58,
//     testimonials: [
//       {
//         name: "Andi",
//         role: "Business Owner",
//         text: "Engagement sosmed kami naik signifikan setelah pakai jasanya.",
//       },
//       {
//         name: "Lina",
//         role: "Marketing Manager",
//         text: "Laporan detail dan strateginya jelas, recommended!",
//       },
//     ],
//     image: "/social_single.jpg", // Tambahkan gambar untuk single page
//   },
//   {
//     id: "3",
//     title: "Pengisi Suara Profesional",
//     price: 350000,
//     description: "Pengisi suara untuk video, iklan, & narasi.",
//     image1: "/voice1.jpg",
//     image2: "/voice2.jpg",
//     category: "Audio & Musik",
//     subcategory: "Voice Over",
//     skills: ["Narasi", "Iklan TV/Radio", "Dubbing", "E-learning", "Audiobook"],
//     rating: 4.7,
//     reviewCount: 32,
//     testimonials: [
//       {
//         name: "Rizky",
//         role: "Video Producer",
//         text: "Suaranya khas dan profesional, hasilnya selalu memuaskan.",
//       },
//       {
//         name: "Maya",
//         role: "Content Creator",
//         text: "Fleksibel dan bisa menyesuaikan dengan kebutuhan proyek kami.",
//       },
//     ],
//     image: "/voice_single.jpg", // Tambahkan gambar untuk single page
//   },
// ];

// const CartModal = () => {
//   const [cartItems, setCartItems] = useState<
//     ((typeof freelancers)[0] & { quantity: number })[]
//   >([]);

//   useEffect(() => {
//     const storedCartItems = localStorage.getItem("cartItems");
//     if (storedCartItems) {
//       try {
//         const parsedCartItems = JSON.parse(storedCartItems);
//         if (Array.isArray(parsedCartItems)) {
//           setCartItems(parsedCartItems);
//         } else {
//           setCartItems([]); // Set ke array kosong jika format tidak valid
//         }
//       } catch (error) {
//         console.error("Error parsing cart items from localStorage:", error);
//         setCartItems([]); // Set ke array kosong jika terjadi error parsing
//       }
//     } else {
//       setCartItems([]); // Set ke array kosong jika tidak ada data di localStorage
//     }
//   }, []);

//   const formatRupiahManual = (angka: number): string => {
//     const rupiah = angka.toLocaleString("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });
//     return rupiah;
//   };

//   const handleRemoveFromCart = (itemId: string) => {
//     const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(updatedCartItems);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };

//   const handleDecreaseQuantity = (itemId: string) => {
//     const updatedCartItems = cartItems.map((item) =>
//       item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
//     );
//     setCartItems(updatedCartItems);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };

//   const handleIncreaseQuantity = (itemId: string) => {
//     const updatedCartItems = cartItems.map((item) =>
//       item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCartItems(updatedCartItems);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return (
//     <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgba(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
//       {cartItems && cartItems.length === 0 ? ( // Tambahkan pemeriksaan cartItems
//         <div>Cart is Empty</div>
//       ) : (
//         <>
//           <h2 className="text-xl">Shopping Cart</h2>
//           {/* Wrapper untuk semua konten */}
//           <div className="flex flex-col gap-8">
//             {cartItems && cartItems.map((item) => ( // Tambahkan pemeriksaan cartItems
//               <div className="flex gap-4" key={item.id}>
//                 <Image
//                   src={item.image1}
//                   alt={item.title}
//                   width={72}
//                   height={96}
//                   className="object-cover rounded-md"
//                 />
//                 <div className="flex flex-col justify-between w-full">
//                   <div>
//                     <div className="flex items-center justify-between gap-8">
//                       <h3 className="font-semibold">{item.title}</h3>
//                       <div className="p-1 bg-gray-100 rounded-sm">
//                         {formatRupiahManual(item.price)}
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-500">Available</div>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <button
//                       onClick={() => handleRemoveFromCart(item.id)}
//                       className="text-blue-500"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Subtotal & Tombol, dijadikan satu div */}
//             <div>
//               <div className="flex items-center justify-between font-semibold">
//                 <span>Subtotal</span>
//                 <span>{formatRupiahManual(calculateSubtotal())}</span>
//               </div>
//               <p className="text-gray-500 text-sm mt-2 mb-4">
//                 Shipping and taxes calculated at checkout.
//               </p>
//               <div className="flex justify-between text-sm">
//                 <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
//                   View Cart
//                 </button>
//                 <button className="rounded-md py-3 px-4 bg-black text-white">
//                   Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartModal;