import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-20 px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-64 bg-gray-100 text-sm text-gray-700 mt-24 border-t border-gray-200">
      {/* TOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* COMPANY */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="text-2xl font-bold tracking-wide text-gray-800">
            LUMORA
          </Link>
          <p>Empowering Freelancers Across Indonesia</p>
          <p className="text-gray-600">Universitas Ciputra</p>
          <p className="font-medium">iniemail@gmail.com</p>
          <p className="font-medium">+62 812 1234 5678</p>
          <div className="flex gap-4 mt-2">
            <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
            <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
            <Image src="/youtube.png" alt="YouTube" width={24} height={24} />
            <Image src="/pinterest.png" alt="Pinterest" width={24} height={24} />
            <Image src="/x.png" alt="X" width={24} height={24} />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-gray-800 text-lg">Explore</h2>
          <div className="flex flex-col gap-3">
            <Link href="" className="hover:text-black">Browse Services</Link>
            <Link href="" className="hover:text-black">Freelancers</Link>
            <Link href="" className="hover:text-black">How It Works</Link>
            <Link href="" className="hover:text-black">Success Stories</Link>
            <Link href="" className="hover:text-black">Support</Link>
          </div>
        </div>

        {/* RESOURCES */}
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-gray-800 text-lg">Resources</h2>
          <div className="flex flex-col gap-3">
            <Link href="" className="hover:text-black">Community</Link>
            <Link href="" className="hover:text-black">Partnership</Link>
            <Link href="" className="hover:text-black">Affiliate</Link>
            <Link href="" className="hover:text-black">Blog</Link>
            <Link href="" className="hover:text-black">Terms & Policies</Link>
          </div>
        </div>

        {/* SUBSCRIBE */}
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-gray-800 text-lg">Subscribe</h2>
          <p>Get updates on the latest freelance trends, tips, and exclusive offers.</p>
          <div className="flex w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm rounded-l-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-lumora"
            />
            <button className="bg-lumora text-white px-4 rounded-r-xl text-sm font-medium hover:opacity-90">
              Join
            </button>
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-700">Secure Payments</span>
            <div className="flex gap-3 mt-2">
              <Image src="/discover.png" alt="Discover" width={40} height={24} />
              <Image src="/skrill.png" alt="Skrill" width={40} height={24} />
              <Image src="/paypal.png" alt="PayPal" width={40} height={24} />
              <Image src="/mastercard.png" alt="Mastercard" width={40} height={24} />
              <Image src="/visa.png" alt="Visa" width={40} height={24} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-16 border-t pt-8 text-xs text-gray-500">
        <span>© 2025 Lumora Freelance Platform. All rights reserved.</span>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <span className="text-gray-400 mr-2">Language:</span>
            <span className="font-medium text-gray-700">Indonesia</span>
          </div>
          <div>
            <span className="text-gray-400 mr-2">Currency:</span>
            <span className="font-medium text-gray-700">IDR (Rp)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
