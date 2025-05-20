import AboutUs from "@/components/AboutUs";
import CategoryList from "@/components/CategoryList"
import LandingHighlightSection from "@/components/LandingHighlightSection";
import LandingPage from "@/components/LandingPage";
import PopularServiceList from "@/components/PopularServiceList"
import ProductList from "@/components/ProductList"
import Slider from "@/components/Slider"
import WhyUs from "@/components/WhyUs";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const HomePage = () => {
  return (
    <div>
      <LandingPage />
      <Slider />
      <LandingHighlightSection/>
      <AboutUs />
      <WhyUs />

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-bold">Featured</h1>
        <ProductList />
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-bold">Jasa paling dicari!</h1>
        <PopularServiceList />
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-bold">Jasa yang baru ditambah</h1>
        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;
