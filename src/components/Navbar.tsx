import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import Image from "next/image";
import NavIcons from "./NavIcons";

const Navbar = () => {
  return (
    <div className="h-20 border-b border-gray-200 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">LUMORA</div>
        </Link>
        <Menu />
      </div>

      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between h-full w-full">
        {/* LEFT - LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 mr-8">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-xl tracking-wide font-semibold">LUMORA</div>
          </Link>
        </div>

        {/* SEARCH BAR - Takes more space in the middle */}
        <div className="flex-1 mx-4 max-w-3xl">
          <SearchBar />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">
          <Link
            href="/orders"
            className="text-gray-600 hover:text-gray-900"
          ></Link>
          <Link
            href="/seller"
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Mulai Berjualan!
          </Link>

          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
