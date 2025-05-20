"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  author: string;
  image?: string;
  images?: string[];
  description?: string; // Pastikan properti description ada
  category?: string;
  createdAt?: string;
}

const dummyPosts: Post[] = [
  {
    id: "dummy-1",
    title: "Minimalist Logo Design",
    author: "Kelvin",
    image: "/editor1.jpg",
    description: "A clean minimalist logo design...",
    category: "Logo Design",
    createdAt: "2023-01-01T00:00:00Z",
    images: [],
  },
  {
    id: "dummy-2",
    title: "Creative Landing Page UI",
    author: "Kelvin",
    image: "/editor2.jpg",
    description: "A responsive landing page design...",
    category: "UI/UX",
    createdAt: "2023-01-15T00:00:00Z",
    images: [],
  },
  {
    id: "dummy-3",
    title: "Event After Movie Editing",
    author: "Kelvin",
    image: "/editor4.jpg",
    description: "Professional video editing for a corporate event...",
    category: "Video Editing",
    createdAt: "2023-02-01T00:00:00Z",
    images: [],
  },
  {
    id: "dummy-4",
    title: "Branding Social Media Post",
    author: "Kelvin",
    image: "/editor4.jpg",
    description: "Series of social media posts...",
    category: "Social Media",
    createdAt: "2023-02-15T00:00:00Z",
    images: [],
  },
];

interface SinglePostProps {
  params: {
    id: string;
  };
}

export default function SinglePost({ params }: SinglePostProps) {
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = () => {
      try {
        const storedPosts = localStorage.getItem("designerPosts");
        const localPosts: Post[] = storedPosts ? JSON.parse(storedPosts) : [];
        const allPosts = [...dummyPosts, ...localPosts];
        const foundPost = allPosts.find((p) => p.id === id);

        if (foundPost) {
          setPost(foundPost);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error loading post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 md:px-16 lg:px-32 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-lg w-full mb-6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return notFound();

  const dateDisplay = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">by {post.author}</p>
          <div className="flex gap-2">
            {post.category && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {post.category}
              </span>
            )}
            {dateDisplay && (
              <span className="text-gray-500 text-sm">{dateDisplay}</span>
            )}
          </div>
        </div>

        {post.images && post.images.length > 0 ? (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ) : post.image ? (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ) : (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-md bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {post.description} {/* Tampilkan deskripsi di sini */}
          </p>
        </div>
      </div>
    </div>
  );
}
