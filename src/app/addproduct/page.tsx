"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const router = useRouter();
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [currentTab, setCurrentTab] = useState("overview");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState<
    string[]
  >([]);
  const [description, setDescription] = useState("");

  const categories = [
    "Graphics & Design",
    "Digital Marketing",
    "Writing & Translation",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
    "Data",
    "Photography",
    "AI Services",
    "Education & Training",
  ];

  const subcategories: Record<string, string[]> = {
    "Graphics & Design": ["Logo Design", "Illustration", "Web & Mobile Design"],
    "Digital Marketing": ["SEO", "Content Marketing", "Email Marketing"],
    "Writing & Translation": ["Articles", "Translation", "Proofreading"],
    "Video & Animation": ["Video Editing", "3D Animation", "Whiteboard Videos"],
    "Music & Audio": ["Voice Over", "Mixing & Mastering", "Music Production"],
    "Programming & Tech": ["Web Development", "Mobile Apps", "Blockchain"],
    Business: ["Virtual Assistant", "Market Research", "Financial Consulting"],
    Lifestyle: ["Online Tutoring", "Gaming", "Wellness"],
    Data: ["Data Analysis", "Machine Learning", "Big Data"],
    Photography: ["Product Photography", "Event Photography", "Photo Editing"],
    "AI Services": [
      "AI Content Generation",
      "AI Chatbot",
      "Prompt Engineering",
    ],
    "Education & Training": [
      "Online Course Creation",
      "Curriculum Development",
      "Language Learning",
    ],
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setAvailableSubcategories(subcategories[category] || []);
    setSelectedSubcategory(""); // Reset subcategory ketika category berubah
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles].slice(0, 5));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, "");
      if (!tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const getProgressPercentage = () => {
    const steps = [
      "overview",
      "pricing",
      "description",
      "requirements",
      "gallery",
    ];
    const currentStep = steps.indexOf(currentTab);
    return `${(currentStep / (steps.length - 1)) * 100}%`;
  };

  const handlePublish = () => {
    const product = {
      title: productTitle,
      price: productPrice,
      image: images[0] ? URL.createObjectURL(images[0]) : null,
      category: selectedCategory,
      subcategory: selectedSubcategory, // <-- pastikan ini ada
      description: description, // <-- pastikan ini ada
    };

    const existingProducts = JSON.parse(
      localStorage.getItem("products") || "[]"
    );
    existingProducts.push(product);
    localStorage.setItem("products", JSON.stringify(existingProducts));

    router.push("/seller");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create a New Product
            </h1>
            <Link href="/seller" className="text-gray-600 hover:text-gray-900">
              Cancel
            </Link>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: getProgressPercentage() }}
            />
          </div>
          {/* Tabs */}
          <div className="flex mt-6 border-b overflow-x-auto no-scrollbar">
            {[
              "overview",
              "pricing",
              "description",
              "requirements",
              "gallery",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`pb-4 px-6 font-medium ${
                  currentTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {currentTab === "overview" && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold mb-6">Product Overview</h2>

              {/* Title */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="I will..."
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Keep it concise and clear.
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category
                  </label>
                  <select
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sub-Category
                  </label>
                  <select
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    disabled={!selectedCategory}
                  >
                    <option value="">
                      {selectedCategory
                        ? "Select a sub-category"
                        : "Please select a category first"}
                    </option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Tags */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Search Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press enter"
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Add keywords separated by comma or Enter key.
                  </p>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentTab("pricing")}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab Content */}
          {currentTab === "pricing" && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Pricing
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Package Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g., Basic Package"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="25"
                      min="5"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum price is $5
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Delivery Time
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white">
                      <option value="">Select delivery time</option>
                      <option value="1">1 day</option>
                      <option value="2">2 days</option>
                      <option value="3">3 days</option>
                      <option value="5">5 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Number of Revisions
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white">
                      <option value="0">No revisions</option>
                      <option value="1">1 revision</option>
                      <option value="2">2 revisions</option>
                      <option value="3">3 revisions</option>
                      <option value="unlimited">Unlimited revisions</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setCurrentTab("overview")}
                  className="text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentTab("description")}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Description Tab Content */}
          {currentTab === "description" && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Description
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    placeholder="Describe your service in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Min. 120 characters. Be detailed and specific about what
                    your service includes.
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">
                    What's Included
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add the key features of what you'll deliver to buyers
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="e.g., Source files included"
                      />
                      <button className="ml-2 text-gray-400 hover:text-gray-600 p-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center mt-2">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      Add Another Item
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setCurrentTab("pricing")}
                  className="text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentTab("requirements")}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Requirements Tab Content */}
          {currentTab === "requirements" && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Requirements
              </h2>

              <div className="space-y-6">
                <p className="text-gray-600">
                  Ask buyers for the information you need to start working on
                  their order. Clear requirements help set expectations and
                  avoid revisions.
                </p>

                <div className="space-y-4">
                  <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Question 1
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          What specifically do you need designed?
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button className="text-gray-400 hover:text-gray-600 p-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 p-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium mt-2">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Add a Question
                  </button>
                </div>
              </div>

              <div className="mt-10 flex justify-between">
                <button
                  onClick={() => setCurrentTab("description")}
                  className="text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentTab("gallery")}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Gallery Tab Content */}
          {currentTab === "gallery" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Gallery</h2>

              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 rounded-md h-40 overflow-hidden"
                    >
                      <Image
                        src={URL.createObjectURL(img)}
                        alt={`Uploaded ${index}`}
                        className="object-cover"
                        fill
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-md h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  You can upload up to 5 images (JPEG, PNG, GIF). Maximum file
                  size: 5MB each.
                </p>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentTab("requirements")}
                  className="text-gray-600 py-3 px-6 rounded-md hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  onClick={handlePublish}
                  className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Publish Product
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;
