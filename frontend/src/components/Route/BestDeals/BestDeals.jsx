import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-12">
      <div className={`${styles.section}`}>
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 relative inline-block">
            Best Deals
            <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Grab the hottest deals on top-selling products 
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {data && data.length !== 0 && (
            <>
              {data.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
