import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-20 px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-64 bg-gradient-to-b from-white to-green-50 text-sm text-gray-700 mt-24 border-t border-green-100">
      {/* TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* COMPANY */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: "#A8D5BA" }}>
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-gray-800">LU</span>
              <span style={{ color: "#A8D5BA" }}>MORA</span>
            </div>
          </Link>
          <p className="text-gray-700 font-medium">Empowering Freelancers Across Indonesia</p>
          <p className="text-gray-600">Universitas Ciputra</p>
          <div className="flex items-center gap-2 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: "#A8D5BA" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="font-medium">iniemail@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: "#A8D5BA" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="font-medium">+62 812 1234 5678</span>
          </div>
          <div className="flex gap-4 mt-2">
            {["facebook", "instagram", "youtube", "pinterest", "x"].map((social) => (
              <div 
                key={social} 
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-all cursor-pointer"
              >
                <Image src={`/${social}.png`} alt={social} width={18} height={18} />
              </div>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-gray-800 text-lg relative">
            <span className="relative z-10">Explore</span>
            <span className="absolute bottom-0 left-0 w-10 h-2 bg-green-100 z-0"></span>
          </h2>
          <div className="flex flex-col gap-3">
            {["Browse Services", "Freelancers", "How It Works", "Success Stories", "Support"].map((link) => (
              <Link 
                key={link} 
                href="" 
                className="hover:text-green-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3" style={{ color: "#A8D5BA" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* RESOURCES */}
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-gray-800 text-lg relative">
            <span className="relative z-10">Resources</span>
            <span className="absolute bottom-0 left-0 w-10 h-2 bg-green-100 z-0"></span>
          </h2>
          <div className="flex flex-col gap-3">
            {["Community", "Partnership", "Affiliate", "Blog", "Terms & Policies"].map((link) => (
              <Link 
                key={link} 
                href="" 
                className="hover:text-green-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3" style={{ color: "#A8D5BA" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* SUBSCRIBE */}
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-gray-800 text-lg relative">
            <span className="relative z-10">Subscribe</span>
            <span className="absolute bottom-0 left-0 w-10 h-2 bg-green-100 z-0"></span>
          </h2>
          <p>Get updates on the latest freelance trends, tips, and exclusive offers.</p>
          <div className="flex w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm rounded-l-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-300 bg-white shadow-sm"
            />
            <button 
              className="text-white px-4 rounded-r-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(to right, #A8D5BA, #8EC3A7)" }}
            >
              Join
            </button>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: "#A8D5BA" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Secure Payments
            </span>
            <div className="flex gap-3 mt-2 bg-white p-3 rounded-lg shadow-sm">
              {["discover", "skrill", "paypal", "mastercard", "visa"].map((payment) => (
                <Image key={payment} src={`/${payment}.png`} alt={payment} width={36} height={22} className="opacity-80 hover:opacity-100 transition-opacity" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-16 border-t border-green-100 pt-8 text-xs text-gray-500">
        <span>© 2025 Lumora Freelance Platform. All rights reserved.</span>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1" style={{ color: "#A8D5BA" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span className="text-gray-400 mr-2">Language:</span>
            <span className="font-medium text-gray-700">Indonesia</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1" style={{ color: "#A8D5BA" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400 mr-2">Currency:</span>
            <span className="font-medium text-gray-700">IDR (Rp)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;