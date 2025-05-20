// components/CategoryTabs.tsx
import React, { useState } from 'react';

interface CategoryTabsProps {
  onSubcategorySelect: (subcategory: string) => void;
}

const categories = [
  "Character Design", "Illustration", "Concept Art", "UI/UX Design",
  "Branding", "Merch Design", "Graphic Assets", "3D Modeling",
  "Animation", "Emotes & Badges", "Custom Requests"
];

const subcategories: Record<string, string[]> = {
  "Character Design": ["Original Characters (OC)", "D&D Characters", "Fanart"],
  "Illustration": ["Portraits", "Full Body", "Scenic Backgrounds"],
  "Concept Art": ["Environment Design", "Creature Design", "Weapon/Item Design"],
  "UI/UX Design": ["App Mockups", "Website Layouts", "Game Interfaces"],
  "Branding": ["Logo Design", "Color Palette", "Visual Identity"],
  "Merch Design": ["Sticker Design", "T-Shirt Design", "Keychain Art"],
  "Graphic Assets": ["Icons", "UI Elements", "Game Assets"],
  "3D Modeling": ["Character Models", "Props", "Low-Poly Art"],
  "Animation": ["GIFs", "Character Animation", "Animated Emotes"],
  "Emotes & Badges": ["Twitch Emotes", "Discord Stickers", "Subscriber Badges"],
  "Custom Requests": ["Couple Art", "Pet Portraits", "Fantasy Scenes"],
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ onSubcategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="bg-white sticky top-[64px] z-10 border-b">
      <div className="flex overflow-x-auto gap-3 px-4 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`whitespace-nowrap px-4 py-1 rounded-full border text-sm font-medium ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dropdown Subcategory */}
      {selectedCategory && (
        <div className="bg-white border-t px-4 pb-3">
          <select
            className="w-full mt-2 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            onChange={(e) => onSubcategorySelect(e.target.value)}
            defaultValue=""
          >
            <option value="">Select a sub-category</option>
            {subcategories[selectedCategory].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;
