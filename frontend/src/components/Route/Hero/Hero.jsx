import React from "react";
import Lottie from "lottie-react";   
import heroAnimation from "../../../Assests/animations/hero.json";

const Hero = () => {
  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center bg-gradient-to-r from-gray-100 via-white to-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-10 py-16">
        
        {/* Left Side - Text Content */}
        <div className="w-full md:w-[45%] z-10 space-y-6">
          <h1 className="text-[38px] md:text-[60px] font-bold leading-tight text-gray-900">
            Best <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-900">Multivendor</span> Store
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Explore a world of premium products, elegant fashion, and stylish 
            accessories — everything you need to elevate your lifestyle. 
            Shop smart, shop modern, shop with confidence.
          </p>

          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-pink-500 transition duration-300 ease-in-out font-medium text-lg">
            Shop Now
          </button>
        </div>

        {/* Right Side - Lottie Animation */}
        <div className="w-full md:w-[55%] flex items-center justify-center">
          <Lottie 
            animationData={heroAnimation} 
            loop 
            autoplay 
            style={{ width: "100%", maxWidth: "650px", height: "auto" }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
