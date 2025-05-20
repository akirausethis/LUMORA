"use client"
import React, { useState } from 'react';
import CategoryTabs from '@/components/CategoryTabs';
import SearchBar from '@/components/SearchBar';
import ProductList from '@/components/ProductList';

const ExplorePage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  return (
    <div>
      <CategoryTabs onSubcategorySelect={(sub) => setSelectedSubcategory(sub)} />
      <div className="p-6 text-gray-700">
        {selectedSubcategory ? (
          <p className="mb-4">Showing results for: <strong>{selectedSubcategory}</strong></p>
        ) : (
          <p className="mb-4">Please select a sub-category</p>
        )}

        <SearchBar/>
        <ProductList/>

        {/* List Card: Bisa diisi filter berdasarkan subcategory */}
      </div>
    </div>
  );
};

export default ExplorePage;
