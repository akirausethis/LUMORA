'use client';

import { useState, useRef, useEffect } from 'react'; // Tambahkan useRef dan useEffect

const CustomerServicePage = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Halo! Ada yang bisa kami bantu hari ini?' },
  ]);
  const [input, setInput] = useState('');

  // Ref untuk menggulir ke bawah secara otomatis
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efek untuk menggulir ke bawah setiap kali pesan diperbarui
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simpan input saat ini untuk digunakan dalam balasan bot
    const currentInput = input;
    setInput(''); // Kosongkan input segera setelah pesan user dikirim

    // Dummy AI response
    setTimeout(() => {
      const botResponse = {
        from: 'bot',
        // PERBAIKAN SINTAKSIS: Gunakan backticks (`) untuk template literal
        text: `Terima kasih sudah menghubungi kami. Kami akan segera menindaklanjuti pertanyaan: "${currentInput}".`,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow-lg flex flex-col h-[80vh]">
        <div className="px-6 py-4 border-b font-semibold text-lg bg-[rgb(168,213,186)] text-white rounded-t">
          💬 Customer Service Chat
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col"> {/* Tambahkan flex flex-col di sini */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] p-3 rounded ${
                msg.from === 'user'
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-gray-200 self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Elemen kosong untuk scroll otomatis */}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pesan..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSend}
            className="bg-[rgb(168,213,186)] text-white font-semibold px-4 py-2 rounded hover:bg-green-300"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;