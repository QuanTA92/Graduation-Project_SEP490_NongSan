import React, { useState, useEffect } from 'react';
import { GiFruitTree, GiCarrot, GiMilkCarton, GiCow } from 'react-icons/gi'; // Replace GiCheese with GiMilkCarton
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch categories data from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categoriesAndSubcategories/get");
        const data = await response.json();
        setCategories(data); // Set the categories data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Function to get the icon based on category name
  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Fruit':
        return <GiFruitTree className="text-3xl text-white" />;
      case 'Vegetable':
        return <GiCarrot className="text-3xl text-white" />;
      case 'Dairy':
        return <GiMilkCarton className="text-3xl text-white" />;
      case 'Meat':
        return <GiCow className="text-3xl text-white" />;
      case 'Grain':
        return <GiFruitTree className="text-3xl text-white" />; // Replace with a grain-related icon
      default:
        return <GiFruitTree className="text-3xl text-white" />;
    }
  };

  // Handle category click to navigate to product list
  const handleCategoryClick = () => {
    navigate(`/productlist`); // Navigate to product list page with category ID
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Danh mục sản phẩm</h1>
      
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => (
          <div
            key={category.idCategory}
            className="w-48 p-4 bg-white rounded-full text-center cursor-pointer hover:bg-gray-100 transition flex flex-col items-center justify-center"
            onClick={() => handleCategoryClick(category.idCategory)} // Call handleCategoryClick on click
          >
            <div className="flex items-center justify-center w-24 h-24 bg-green-400 rounded-full text-white mb-4">
              {getCategoryIcon(category.nameCategory)} {/* Display icon */}
            </div>
            <span className="text-xl font-semibold">{category.nameCategory}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
