import React, { useState, useEffect, useContext } from "react";
import ProductService from "../services/ProductService";
import { BsStarFill } from "react-icons/bs";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Rentals = () => {
  const { accountId, token } = useContext(AuthContext);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState([]); // State to store cart items

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

  const addToCart = (product) => {
    // Add product to cart and update state
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save cart to localStorage
      return updatedCart;
    });
    alert(`${product.nameProduct} has been added to your cart!`);
  };

  const Rental = ({ idProduct, title, image, price, description }) => {
    const navigate = useNavigate(); // Hook to enable navigation

    const defaultImage = "/assets/img/default.jpg";
    const imgSrc = image && image.length > 0 ? `${image[0]}` : defaultImage;

    const product = {
      idProduct,
      nameProduct: title,
      priceProduct: price,
      imageProducts: image,
      descriptionProduct: description,
    };

    return (
      <div
        onClick={() => navigate(`/product/${idProduct}`)} // Navigate to the product detail page
        className="card border rounded-lg shadow-md overflow-hidden cursor-pointer w-72"
      >
        <img
          className="card-img-top object-cover h-48 w-full"
          src={imgSrc}
          alt={title}
        />
        <div className="card-body p-4">
          <h5 className="card-title text-xl font-semibold">{title}</h5>
          <p className="card-text text-gray-700">{description}</p>
          <p className="text-lg font-bold">{price}</p>
          <div className="flex items-center space-x-1">
            <BsStarFill className="text-yellow-500" />
            <p className="text-sm">5.0</p>
          </div>
          <div className="flex flex-col space-y-2 mt-3">
            {" "}
            {/* Flex container with vertical spacing */}
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => navigate(`/product/${idProduct}`)}
            >
              View Details
            </button>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded"
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigating to product detail
                addToCart(product); // Add to cart
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
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
    <div className="py-3 sm:py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
        {rentals.map((rental, index) => (
          <Rental
            key={index}
            idProduct={rental.idProduct}
            title={rental.nameProduct || "No Title"}
            image={rental.imageProducts}
            price={
              rental.priceProduct
                ? `${rental.priceProduct}.000 VNĐ`
                : "Price not available"
            }
            description={
              rental.descriptionProduct || "No description available."
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Rentals;
