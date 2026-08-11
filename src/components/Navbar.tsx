import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import Image from "next/image";
import NavIcons from "./NavIcons";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 h-20 bg-white/70 backdrop-blur-md border-b border-gray-100/50 transition-all duration-300">
      <div className="h-full container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* MOBILE */}
        <div className="h-full flex items-center justify-between md:hidden w-full">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                L
              </div>
              <div className="text-xl font-extrabold tracking-tight text-gray-900">
                LU<span className="text-emerald-500">MORA</span>
              </div>
            </div>
          </Link>
          <Menu />
        </div>

        {/* BIGGER SCREENS */}
        <div className="hidden md:flex items-center justify-between w-full h-full">
          {/* LEFT - LOGO & LINKS */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                L
              </div>
              <div className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-emerald-700 transition-colors">
                LU<span className="text-emerald-500">MORA</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/explore"
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Jelajahi
              </Link>
              <Link
                href="/portfolio"
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Creator Feeds
              </Link>
              <Link
                href="/addpost"
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                Post Karya
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION - ICONS & AUTH */}
          <div className="flex items-center gap-4">
            <NavIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
