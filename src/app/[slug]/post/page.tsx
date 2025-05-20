import React from "react";
import { notFound } from "next/navigation";

interface PostParams {
  params: { slug: string };
}

// Dummy data — kamu nanti bisa ganti dengan API/fetch dari database
const dummyPosts = [
  {
    slug: "minimalist-logo-design",
    title: "Minimalist Logo Design",
    author: "Jane Doe",
    image: "/portfolios/logo1.png",
    description:
      "Desain logo minimalis untuk brand fashion lokal, memadukan elemen elegan dan simpel.",
  },
  {
    slug: "creative-landing-page-ui",
    title: "Creative Landing Page UI",
    author: "John Smith",
    image: "/portfolios/ui1.png",
    description:
      "UI landing page dengan estetika modern untuk startup teknologi edukasi.",
  },
];

export default function SinglePost({ params }: PostParams) {
  const post = dummyPosts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-sm mb-6">by {post.author}</p>
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-lg mb-6 shadow-md"
        />
        <p className="text-base text-gray-700 leading-relaxed">
          {post.description}
        </p>
      </div>
    </div>
  );
}
