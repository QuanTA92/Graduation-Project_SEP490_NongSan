import React, { useState, useEffect, useContext } from 'react';
import { listProducts } from '../services/ProductService';
import { BsStarFill } from "react-icons/bs";
import { AuthContext } from '../AuthContext'; // Import AuthContext

const Rentals = () => {
  const { accountId, token } = useContext(AuthContext); // Access accountId and token from AuthContext
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      listProducts(token)  // Pass the token from AuthContext
        .then((response) => {
          console.log("Fetched rentals: ", response.data); // Log the data for debugging
          setRentals(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching rentals:", error.response || error.message); // Log error details
          setError("Unable to fetch rentals. Please try again later.");
          setLoading(false);
        });
    } else {
      setError("Authorization failed. Please log in.");
      setLoading(false);
    }
  }, [token]);
   // Trigger the effect only when token changes

  // Rental component
  const Rental = ({ title, image, price, description }) => {
    return (
      <div className="border rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <div className="grad absolute w-full h-full rounded-b-[1.3rem]"></div>
          <div className="flex">
            <img
              src={image && image[0] ? `/assets/img/${image[0]}` : '/assets/img/default.jpg'} // Use default image if image is missing
              alt={title}
              className="object-cover rounded-[1.3rem] sm:h-[17rem] md:h-[13rem] w-full"
            />
            <div className="absolute text-white font-bold bottom-6 left-6 text-[22px] flex items-center gap-2">
              {title}
              <span>&#x2022;</span>
              <p className="text-[18px] text-slate-200">
                {price || "Price not available"} VNĐ
              </p>
            </div>
          </div>
        </div>
        <div className="pt-3 flex justify-between items-start">
          <div>
            <p className="max-w-[17rem] font-semibold text-[17px]">
              {description}
            </p>
            <p className="max-w-[17rem] font-semibold text-[17px]">
              {price} VNĐ
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <BsStarFill className="text-yellow-500" />
            <p className="text-[15px]">5.0</p> {/* Static rating, can be updated */}
          </div>
        </div>
      </div>
    );
  };

  // Display error message if there's an error
  if (error) {
    return <p>{error}</p>;
  }

  // Display loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Check if there are no rentals available
  if (!Array.isArray(rentals) || rentals.length === 0) {
    return <p>No rentals available.</p>;
  }

  // Render list of rentals
  return (
    <div className="py-3 sm:py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rentals.map((rental, index) => (
          <Rental
            key={index}
            title={rental.nameProduct || "No Title"}
            image={rental.imageProducts}
            price={rental.priceProduct ? `${rental.priceProduct} VNĐ` : "Price not available"}
            description={rental.descriptionProduct || "No description available."}
          />
        ))}
      </div>
    </div>
  );
};

export default Rentals;
