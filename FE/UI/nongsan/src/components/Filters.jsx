import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { GiFruitTree, GiBookCover, GiPhone, GiInfo } from "react-icons/gi";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Filter = ({ icon, title, onClick  }) => {
  return (
    <div className="flex items-center text-white bg-green-400 hover:bg-orange-400 hover:text-green-400 duration-200 ease-out gap-2 py-1 px-3 sm:px-4 rounded-full text-[14px] sm:text-[16px]"
    onClick={onClick}
    >
      {icon}
      {title}
    </div>
  );
};

const Filters = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null); // Track hovered category
  const navigate = useNavigate(); // Initialize navigate

  // Fetch categories and subcategories data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/categoriesAndSubcategories/get"
        );
        const data = await response.json();
        setCategories(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const sorting = [
    {
      title: "Trang chủ",
      icon: <FaHome />,
      onClick: () => navigate("/"), // Navigate to home
    },
    { 
      title: "Sản phẩm",
       icon: <GiFruitTree />,
      onClick: () => navigate("/productlist") },
    { title: "Bài viết", icon: <GiBookCover /> },
    { title: "Liên hệ", icon: <GiPhone /> },
    { title: "Giới thiệu", icon: <GiInfo /> },
  ];

  const handleCategoryMouseEnter = (categoryId) => {
    setHoveredCategoryId(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    setHoveredCategoryId(null);
  };

  return (
    <div className="flex">
      {/* Left Sidebar with Categories and Subcategories */}
      <div className="w-1/5 p-4 bg-white-100">
        <Menu>
          <MenuHandler>
            <Button className="w-full bg-green-400 text-white flex items-center justify-between px-3 py-2">
              <div className="flex flex-col gap-1">
                <div className="h-[2px] bg-gray-600 w-2" />
                <div className="h-[2px] bg-gray-600 w-2" />
                <div className="h-[2px] bg-gray-600 w-2" />
              </div>
              Danh mục sản phẩm
              <ChevronDownIcon className="h-5 w-5" />
            </Button>
          </MenuHandler>
          <MenuList className="w-72" >
            {/* Category and Subcategory Logic */}
            <div>
              {categories.map((category) => (
                <div
                  key={category.idCategory}
                  onMouseEnter={() =>
                    handleCategoryMouseEnter(category.idCategory)
                  } // Hover enter
                  onMouseLeave={handleCategoryMouseLeave} // Hover leave
                >
                  <div className="flex justify-between items-center py-2 px-4 bg-gray-200 hover:bg-gray-300 cursor-pointer">
                    {category.nameCategory}
                    {category.subcategoriesResponses && (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </div>

                  {/* Render subcategories when category is hovered */}
                  {hoveredCategoryId === category.idCategory && (
                    <div className="mt-2 pl-4">
                      {category.subcategoriesResponses && (
                        <ul className="space-y-2">
                          {category.subcategoriesResponses.map(
                            (subcategory) => (
                              <li
                                key={subcategory.idSubcategory}
                                className="py-2 px-4 hover:bg-gray-200"
                                onClick={() => navigate(`/productlist`)} // Navigate to detail page
                              >
                                {subcategory.nameSubcategory}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MenuList>
        </Menu>
      </div>

      {/* Main Filters section */}
      <div className="flex-1 sm:mx-6 md:mx-10 lg:mx-12">
        <div className="flex flex-wrap justify-center gap-6 mt-4 px-3">
          {sorting.map((obj, index) => (
            <Filter key={index} title={obj.title} icon={obj.icon} onClick={obj.onClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
