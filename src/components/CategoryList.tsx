const categories = [
  { id: 1, name: "Design", icon: "/design.png" },
  { id: 2, name: "Programming", icon: "/programming.png" },
  { id: 3, name: "Marketing", icon: "/marketing.png" },
  { id: 4, name: "Writing", icon: "/writing.png" },
  { id: 5, name: "Music", icon: "/music.png" },
  { id: 6, name: "Business", icon: "/business.png" }
];

const CategoryList = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {categories.map((category) => (
        <div key={category.id} className="flex flex-col items-center p-4 bg-lumora shadow-md rounded-lg">
          <div className="w-12 h-12 flex items-center justify-center bg-lumora rounded-full">
            <img src={category.icon} alt={category.name} className="w-8 h-8 filter invert" />
          </div>
          <p className="mt-2 text-center text-sm font-medium text-white">{category.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;