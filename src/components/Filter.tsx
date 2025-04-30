const Filter = () => {
   return (
     <div className="mt-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
       <div className="flex flex-wrap gap-4">
         <select className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
           <option>Category</option>
           <option value="video">Video Editing</option>
           <option value="design">Graphic Design</option>
           <option value="writing">Copywriting</option>
           <option value="voice">Voice Over</option>
         </select>
 
         <select className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
           <option>Delivery Time</option>
           <option value="1">Within 24 hours</option>
           <option value="3">Up to 3 days</option>
           <option value="7">Up to 7 days</option>
         </select>
 
         <input
           type="text"
           name="min"
           placeholder="Min Budget"
           className="text-xs rounded-2xl pl-3 py-2 w-24 ring-1 ring-gray-300"
         />
         <input
           type="text"
           name="max"
           placeholder="Max Budget"
           className="text-xs rounded-2xl pl-3 py-2 w-24 ring-1 ring-gray-300"
         />
 
         <select className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
           <option>Rating</option>
           <option value="5">5 Stars</option>
           <option value="4">4 Stars & up</option>
           <option value="3">3 Stars & up</option>
         </select>
 
         <select className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
           <option>More Filters</option>
         </select>
       </div>
 
       <div>
         <select className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-300">
           <option>Sort by</option>
           <option value="low">Budget (Low to High)</option>
           <option value="high">Budget (High to Low)</option>
           <option value="new">Newest First</option>
           <option value="top">Top Rated</option>
         </select>
       </div>
     </div>
   );
 };
 
 export default Filter;
 