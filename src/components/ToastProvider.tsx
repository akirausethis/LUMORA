// components/ToastProvider.tsx
"use client"; // Pastikan ini client component

import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/solid';

// Tipe untuk konten toast custom Anda
type ToastContentProps = {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void; // Menggunakan () => void untuk tipe onClose
};

// Komponen untuk konten toast custom
const CustomToastContent = ({ title, message, type, onClose }: ToastContentProps) => {
    let IconComponent;
    let rootToastClass; // Mengganti nama variabel agar lebih jelas
    let iconColorClass; // Mengganti nama variabel

    switch (type) {
        case 'success':
            IconComponent = CheckCircleIcon;
            rootToastClass = 'custom-success-toast'; // Ini akan jadi kelas utama untuk div root
            iconColorClass = 'text-green-500';
            break;
        case 'error':
            IconComponent = XCircleIcon;
            rootToastClass = 'custom-error-toast'; // Definisikan di globals.css jika belum
            iconColorClass = 'text-red-500';
            break;
        case 'warning':
            IconComponent = ExclamationCircleIcon;
            rootToastClass = 'custom-warning-toast'; // Definisikan di globals.css jika belum
            iconColorClass = 'text-yellow-500';
            break;
        case 'info':
            IconComponent = InformationCircleIcon;
            rootToastClass = 'custom-info-toast'; // Definisikan di globals.css jika belum
            iconColorClass = 'text-blue-500';
            break;
        default:
            IconComponent = InformationCircleIcon;
            rootToastClass = 'custom-info-toast';
            iconColorClass = 'text-gray-500';
    }

    return (
        // Div ini adalah konten custom Anda, kelas rootToastClass akan mengambil dari globals.css
        <div className={rootToastClass}> {/* Menggunakan rootToastClass */}
            <div className={`toast-icon ${iconColorClass}`}>
                <IconComponent className="w-6 h-6" />
            </div>
            <div className="toast-body">
                <div className="toast-title">{title}</div>
                <div className="toast-message">{message}</div>
            </div>
            <button className="toast-close-button" onClick={onClose}>✕</button>
        </div>
    );
};

// Utility function untuk menampilkan toast
export const showToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    options?: ToastOptions
) => {
    const defaultOptions: ToastOptions = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // PERBAIKAN: Ganti toastClassName menjadi className
        // Kelas ini akan diterapkan pada elemen pembungkus standar react-toastify
        // yang membungkus CustomToastContent Anda.
        className: "relative flex p-0 min-h-0 rounded-md justify-between overflow-hidden cursor-pointer shadow-lg",
        // PERBAIKAN: Hapus bodyClassName karena tidak ada di ToastOptions
        // dan styling body sudah dihandle oleh CustomToastContent
        icon: false, // Penting untuk tidak menampilkan ikon default jika sudah ada di CustomToastContent
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Fungsi content sekarang menerima objek props dari react-toastify
    const content = ({ closeToast }: { closeToast?: () => void }) => (
        <CustomToastContent
            title={title}
            message={message}
            type={type}
            onClose={() => closeToast && closeToast()} // Pastikan closeToast ada sebelum dipanggil
        />
    );

    switch (type) {
        case 'success':
            toast.success(content, finalOptions);
            break;
        case 'error':
            toast.error(content, finalOptions);
            break;
        case 'warning':
            toast.warn(content, finalOptions);
            break;
        case 'info':
            toast.info(content, finalOptions);
            break;
        default:
            toast(content, finalOptions);
    }
};

// Komponen ToastProvider yang akan diletakkan di RootLayout
const ToastProvider = () => {
  return (
    <ToastContainer closeButton={false} /> // `closeButton={false}` karena kita punya tombol close sendiri di CustomToastContent
  );
};

export default ToastProvider;