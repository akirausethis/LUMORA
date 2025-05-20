"use client";

import { useState, useRef } from "react";
import Image from "next/image";

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

const buyerName = "Mydei";
const orderCode = "20257425T025954Z-I-351";

const timelineSteps = [
  { id: 1, label: "Permintaan Diterima", date: "30 Feb 2028", progress: 0 },
  { id: 2, label: "Proses Pengerjaan", date: "02 Mar 2028", progress: 33 },
  { id: 3, label: "Revisi", date: "05 Mar 2028", progress: 66 },
  { id: 4, label: "Selesai", date: "08 Mar 2028", progress: 100 },
];

const formatRupiah = (angka: number): string => {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

interface ProgressPageProps {
  params: { id: string };
}

const ProgressPage = ({ params }: ProgressPageProps) => {
  const { id } = params;
  const product = freelancers.find((item) => item.id === id);
  const [chatMessages, setChatMessages] = useState<
    {
      sender: "buyer" | "seller";
      message: string;
      file?: File | null;
      imageUrl?: string;
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentProgress, setCurrentProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Produk tidak ditemukan.
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() || selectedFile) {
      const messageToSend = newMessage.trim();
      const containsContactInfo = detectContactInfo(messageToSend);

      if (containsContactInfo) {
        setWarning("Kamu ngga boleh sembarangan kasih infomu ke orang woe!");
        setTimeout(() => setWarning(null), 3000);
        setNewMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      let imageUrl: string | undefined;
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        imageUrl = await readFileAsDataUrl(selectedFile);
      }

      setChatMessages([
        ...chatMessages,
        {
          sender: "buyer",
          message: messageToSend,
          file: selectedFile,
          imageUrl,
        },
      ]);
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateProgress = (stepId: number) => {
    const step = timelineSteps.find((s) => s.id === stepId);
    if (step) setCurrentProgress(step.progress);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const detectContactInfo = (text: string): boolean => {
    const patterns = [
      /\d{8,}/,
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/\w+/,
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:profile\.php\?id=\d+|\w+)/,
      /(?:https?:\/\/)?(?:t\.me\/|telegram\.me\/)\w+/,
      /@\w+\.(com|net|org|id)/,
      /\w+\.(ig|fb)\b/,
      /\b(?:wa\.me\/\d+|line\.me\/ti\/p\/\~?\w+)\b/,
      /\btwitter\.com\/\w+\b/,
    ];
    return patterns.some((pattern) => pattern.test(text));
  };

  const handleEnlargeImage = (url: string) => {
    setEnlargedImage(url);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 text-white py-4 px-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Pesanan Anda</h2>
            <p className="text-sm">{buyerName}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-center">Kode Pesanan</h2>
            <p className="text-sm text-center">{orderCode}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold">Tagihan Anda</h2>
            <p className="text-sm">{formatRupiah(product.price)}</p>
          </div>
        </div>

        {/* Timeline dengan UI yang Ditingkatkan */}
        <div className="py-6 px-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Progres Pengerjaan
          </h3>
          <div className="relative">
            {/* Background track dengan shadow untuk kedalaman */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2 shadow-inner">
              {/* Progress fill dengan gradient dan transition */}
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full absolute left-0 transition-all duration-500 ease-in-out shadow"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>

            {/* Flex container for timeline steps */}
            <div className="flex justify-between items-center relative z-10">
              {timelineSteps.map((step) => (
                <div key={step.id} className="text-center relative">
                  {/* Button with pulsing effect when active */}
                  <button
                    onClick={() => handleUpdateProgress(step.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110 shadow ${
                      currentProgress >= step.progress
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white font-bold"
                        : "bg-white text-gray-500 border-2 border-gray-300"
                    }`}
                    style={{ marginBottom: "1.5rem" }} // Tambahkan margin bawah untuk memberi jarak
                  >
                    {step.id}
                  </button>

                  {/* Step label dengan improved styling */}
                  <p
                    className={`text-sm font-medium mt-2 ${
                      currentProgress >= step.progress
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </p>

                  {/* Date with badge style for better visibility */}
                  <p
                    className={`text-xs px-2 py-1 mt-1 rounded-full inline-block ${
                      currentProgress >= step.progress
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chatbox */}
        <div className="py-6 px-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Diskusi dengan Penjual
          </h3>
          {warning && (
            <div className="bg-red-200 text-red-700 border border-red-500 rounded-md p-3 mb-3">
              {warning}
            </div>
          )}
          <div className="bg-gray-100 rounded-md p-4 space-y-2 h-64 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "buyer" ? "items-end" : "items-start"
                }`}
              >
                <span
                  className={`text-xs text-gray-500 ${
                    msg.sender === "buyer" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  {msg.sender === "buyer" ? buyerName : "Penjual"}
                </span>
                <p
                  className={`rounded-lg py-2 px-3 text-sm ${
                    msg.sender === "buyer"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.message}
                </p>
                {msg.imageUrl && (
                  <button
                    onClick={() => handleEnlargeImage(msg.imageUrl!)}
                    className={`mt-1 cursor-pointer ${
                      msg.sender === "buyer" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <Image
                      src={msg.imageUrl}
                      alt="Attached Image"
                      width={100}
                      height={100}
                      objectFit="cover"
                      className="rounded-md shadow-sm"
                    />
                  </button>
                )}
                {msg.file && !msg.imageUrl && (
                  <div
                    className={`mt-1 text-xs ${
                      msg.sender === "buyer" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <span className="font-semibold">Terlampir:</span>{" "}
                    {msg.file.name} ({Math.round(msg.file.size / 1024)} KB)
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ketik pesan..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => fileInputRef.current?.click()}
            >
              Lampirkan
            </button>
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSendMessage}
            >
              Kirim
            </button>
          </div>
        </div>

        {/* Preview Order */}
        <div className="py-6 px-8 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Pratinjau Pesanan
          </h3>
          <ul className="space-y-2">
            <li>
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-800">Contoh File 1.jpg</span>
              <a
                href="#"
                className="ml-auto text-blue-500 hover:underline text-sm"
              >
                Unduh
              </a>
            </li>
            <li>
              <svg
                className="w-5 h-5 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-800">Draft Awal.pdf</span>
              <a
                href="#"
                className="ml-auto text-blue-500 hover:underline text-sm"
              >
                Unduh
              </a>
            </li>
          </ul>
        </div>

        {/* Finish Order */}
        <div className="py-6 px-8">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            Selesaikan Pesanan
          </button>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Dengan menyelesaikan pesanan, Anda mengonfirmasi bahwa pekerjaan
            telah selesai sesuai harapan Anda.
          </p>
        </div>
      </div>

      {/* Modal Perbesar Gambar */}
      {enlargedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <Image
            src={enlargedImage}
            alt="Enlarged Image"
            width={800}
            height={600}
            layout="intrinsic"
            objectFit="contain"
            className="max-h-90 max-w-90"
          />
          <button
            onClick={handleCloseEnlargedImage}
            className="absolute top-4 right-4 text-white text-xl font-bold focus:outline-none hover:text-gray-300 transition-colors"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
