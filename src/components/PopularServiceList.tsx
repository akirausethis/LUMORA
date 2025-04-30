"use client";
import { useRef } from "react";
import "swiper/css";

const popularServices = [
  { id: 1, name: "Website Development", image: "/website.jpg" },
  { id: 2, name: "Logo Design", image: "/logo.jpg" },
  { id: 3, name: "SEO", image: "/seo.jpg" },
  { id: 4, name: "Architecture & Interior", image: "/architect.jpg" },
  { id: 5, name: "Social Media Marketing", image: "/social2.jpg" },
  { id: 6, name: "Voice Over", image: "/voice1.jpg" }
];

const PopularServiceList = () => {
  const scrollRef = useRef(null);
  
  return (
    <div className="mt-12 w-full overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {popularServices.map((service) => (
          <div 
            key={service.id} 
            className="min-w-[230px] flex-shrink-0 cursor-pointer"
          >
            <div className="bg-lumora text-white rounded-lg overflow-hidden h-[220px] flex flex-col">
              <div className="p-5 h-[70px]">
                <h3 className="font-medium text-lg line-clamp-2">{service.name}</h3>
              </div>
              <div className="mt-auto bg-[#e4f5e9] p-2 rounded-b-lg h-[150px] overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PopularServiceList;