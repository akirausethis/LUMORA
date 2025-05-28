import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import Image from "next/image";
import NavIcons from "./NavIcons";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 h-16 bg-white border-b border-gray-100 shadow-sm px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo Lumora" width={24} height={24} />
            <div className="ml-2 text-xl font-medium">
              <span className="text-gray-800">LU</span>
              <span style={{ color: "#A8D5BA" }}>MORA</span>
            </div>
          </div>
        </Link>
        <Menu />
      </div>

      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between h-full w-full">
        {/* LEFT - LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 mr-10">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                style={{ color: "#A8D5BA" }}
              >
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </div>
            <div className="text-xl font-medium">
              <span className="text-gray-800">LU</span>
              <span style={{ color: "#A8D5BA" }}>MORA</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/explore"
              className="font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              Jelajahi
            </Link>
            <Link
              href="/portfolio"
              className="font-medium text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap"
            >
              Creator Feeds
            </Link>
            <Link
              href="/addpost"
              className="font-medium text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap"
            >
              Post Karya
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3 mr-4">
            <NavIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;