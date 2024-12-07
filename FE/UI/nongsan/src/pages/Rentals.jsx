// components/Rentals.js
import React, { useState, useEffect, useContext, Fragment } from 'react';
import ProductService from "../services/ProductService";
import { BsStarFill } from "react-icons/bs";
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Filters from '../components/Filters';

const Rentals = () => {
  const { accountId, token } = useContext(AuthContext);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ProductService.listAllProducts()
      .then((response) => {
        console.log("Fetched rentals: ", response.data);
        setRentals(response.data);
      })
      .catch((err) => {
        console.error("Error fetching rentals:", err);
        setError("Unable to fetch rentals. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const Rental = ({ idProduct, title, image, price, description }) => {
    const navigate = useNavigate(); // Hook to enable navigation

    const defaultImage = '/assets/img/default.jpg';
    const imgSrc = image && image.length > 0 ? `${image[0]}` : defaultImage;

    return (
      <>
      
      <div
        onClick={() => navigate(`/product/${idProduct}`)} // Navigate to the product detail page
        className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
      >
        <div className="relative">
          <div className="grad absolute w-full h-full rounded-b-[1.3rem]"></div>
          
          <div className="flex">
            <img
              src={imgSrc}
              alt={title}
              className="object-cover rounded-[1.3rem] sm:h-[17rem] md:h-[13rem] w-full"
            />
            {/* <div className="absolute text-white font-bold bottom-6 left-6 text-[22px] flex items-center gap-2">
              {title}
              <span>&#x2022;</span>
              <p className="text-[18px] text-slate-200">
                {price || "Price not available"}
              </p>
            </div> */}
          </div>
        </div>
        <div className="pt-3 flex justify-between items-start">
          <div>
            <p className="max-w-[17rem] font-semibold text-[17px]">
              {title}
            </p>
            <p className="max-w-[17rem] font-semibold text-[17px]">
              {price}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <BsStarFill className="text-yellow-500" />
            <p className="text-[15px]">5.0</p>
          </div>
        </div>
      </div>
      </>
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!Array.isArray(rentals) || rentals.length === 0) {
    return <p>No rentals available.</p>;
  }

  return (
    <>
    {/* <div>
      <Filters />

      </div> */}
    <div className="py-3 sm:py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rentals.map((rental, index) => (
          <Rental
            key={index}
            idProduct={rental.idProduct} // Pass the product ID
            title={rental.nameProduct || "No Title"}
            image={rental.imageProducts}
            price={rental.priceProduct ? `${rental.priceProduct}.000 VNĐ` : "Price not available"}
            description={rental.descriptionProduct || "No description available."}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default Rentals;
