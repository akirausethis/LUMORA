// src/components/NotificationModal.tsx
"use client";

import React from 'react';
import { XIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import Image from 'next/image'; // Import Image jika pesan bisa berisi komponen Image

// Ekspor interface ini agar bisa digunakan di halaman lain
export interface ModalButton {
  text: string;
  onClick: () => void;
  className?: string;
}

export interface NotificationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  message: React.ReactNode; // Diubah menjadi React.ReactNode
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  buttons?: ModalButton[];
  icon?: React.ReactNode; // Ikon kustom jika diperlukan
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttons,
  icon,
}) => {
  if (!isOpen) return null;

  let DefaultIcon;
  let iconColorClass = 'text-gray-500';
  let titleColorClass = 'text-gray-800';
  let primaryButtonBaseClass = '';

  switch (type) {
    case 'success':
      DefaultIcon = CheckCircleIcon;
      iconColorClass = 'text-green-500';
      titleColorClass = 'text-green-600';
      primaryButtonBaseClass = 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500';
      break;
    case 'error':
      DefaultIcon = XCircleIcon;
      iconColorClass = 'text-red-500';
      titleColorClass = 'text-red-600';
      primaryButtonBaseClass = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500';
      break;
    case 'warning':
      DefaultIcon = AlertTriangleIcon;
      iconColorClass = 'text-yellow-500';
      titleColorClass = 'text-yellow-600';
      primaryButtonBaseClass = 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500';
      break;
    case 'confirmation':
      DefaultIcon = AlertTriangleIcon;
      iconColorClass = 'text-blue-500';
      titleColorClass = 'text-blue-600';
      primaryButtonBaseClass = 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500';
      break;
    case 'info':
    default:
      DefaultIcon = InfoIcon;
      iconColorClass = 'text-sky-500';
      titleColorClass = 'text-sky-600';
      primaryButtonBaseClass = 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500';
      break;
  }

  const modalIcon = icon || (DefaultIcon ? <DefaultIcon className={`w-12 h-12 sm:w-16 sm:h-16 ${iconColorClass} mx-auto mb-4`} /> : null);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-opacity duration-300 ease-in-out">
      <div
        className="bg-white p-6 pt-8 sm:p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalShow"
        role="alertdialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        )}
        <div className="text-center">
          {modalIcon}
          <h3 id="modal-title" className={`text-xl sm:text-2xl font-semibold ${titleColorClass} mb-2.5`}>{title}</h3>
          <div id="modal-message" className="text-gray-600 text-sm sm:text-base mb-7 whitespace-pre-line">
            {message}
          </div>
        </div>
        {buttons && buttons.length > 0 && (
          <div className={`flex gap-3 ${buttons.length === 1 || (buttons.length > 1 && !buttons.some(b => b.className?.includes('bg-gray-200'))) ? 'justify-center' : 'flex-col sm:flex-row'}`}>
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${button.className ||
                    (index === buttons.length - 1 && (type === 'success' || type === 'confirmation' || type === 'info')
                      ? primaryButtonBaseClass
                      : type === 'error'
                      ? primaryButtonBaseClass
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'
                    )
                  }`}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes modalShow {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;