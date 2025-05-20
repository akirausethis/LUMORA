"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText) {
      router.push(`/list?name=${searchText}`);
    }
  };

  return (
    <form
      className="flex items-center bg-gray-100 p-2 rounded-md flex-1 shadow-sm focus-within:shadow-md transition-shadow duration-200"
      onSubmit={handleSearch}
    >
      <Image src="/search.png" alt="Search Icon" width={20} height={20} className="ml-2 text-gray-500" />
      <input
        type="text"
        name="name"
        placeholder="Mau cari jasa apa?"
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 ml-2"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Cari
      </button>
    </form>
  );
};

export default SearchBar;