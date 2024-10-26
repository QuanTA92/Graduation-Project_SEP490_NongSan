import React from 'react';
import { GiFruitTree, GiFarmTractor, GiWheat, GiCorn, GiAppleCore } from "react-icons/gi";
import { FaCarrot, FaSeedling } from "react-icons/fa";
import Filter from "../components/Filter";

const Filters = () => {
  const sorting = [
    { title: "Fruits", icon: <GiAppleCore /> },        // Apple icon for fruits
    { title: "Vegetables", icon: <FaCarrot /> },       // Carrot icon for vegetables
    { title: "Grains", icon: <GiWheat /> },            // Wheat icon for grains
    { title: "Corn", icon: <GiCorn /> },               // Corn icon for corn
    { title: "Farm Equipment", icon: <GiFarmTractor /> }, // Tractor for farm equipment
    { title: "Seedlings", icon: <FaSeedling /> },      // Seedling icon for plant products
  ];

  return (
    <div className="sm:mx-6 md:mx-10 lg:mx-12">
      <div className="flex flex-wrap justify-center gap-6 mt-4 px-3">
        {sorting.map((obj, index) => (
          <Filter key={index} title={obj.title} icon={obj.icon} />
        ))}
      </div>
    </div>
  );
}

export default Filters;
