"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PortfolioPost {
  id: string;
  title: string;
  category: string;
  author: string;
  image?: string;
  images?: string[];
  createdAt?: string;
  description?: string;
}

const dummyPosts: PortfolioPost[] = [
  {
    id: "dummy-1",
    title: "Minimalist Logo Design",
    image: "/editor1.jpg",
    category: "Logo Design",
    author: "Kelvin",
    createdAt: "2023-01-01T00:00:00Z",
    images: [],
  },
  {
    id: "dummy-2",
    title: "Creative Landing Page UI",
    image: "/editor2.jpg",
    category: "UI/UX",
    author: "Kelvin",
    createdAt: "2023-01-15T00:00:00Z",
    images: [],
  },
  {
    id: "dummy-3",
    title: "Event After Movie Editing",
    image: "/editor4.jpg",
    category: "Video Editing",
    author: "Kelvin",
    createdAt: "2023-02-01T00:00:00Z",
    images: [],
  },
  {
    id: "dummy-4",
    title: "Branding Social Media Post",
    image: "/editor4.jpg",
    category: "Social Media",
    author: "Kelvin",
    createdAt: "2023-02-15T00:00:00Z",
    images: [],
  },
];

export default function DesignerPortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [extraPosts, setExtraPosts] = useState<PortfolioPost[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("designerPosts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setExtraPosts(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error parsing designerPosts:", error);
        setExtraPosts([]);
      }
    }
  }, []);

  const combinedPosts = [...dummyPosts, ...extraPosts];

  const filteredPosts = combinedPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 md:px-16 lg:px-32 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Freelancer Creative Feed
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Explore creative works posted by freelancers
      </p>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search works or freelancers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-3 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/portfolio/${post.id}`}
              className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
            >
              <div className="relative h-60">
                {post.images && post.images.length > 0 ? (
                  <Image
                    src={post.images[0]}
                    alt={post.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                ) : post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 space-y-1">
                  <h2 className="text-white text-lg font-semibold">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-200">{post.category}</p>
                  <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-sm">
                    By {post.author}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">
              No results found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
