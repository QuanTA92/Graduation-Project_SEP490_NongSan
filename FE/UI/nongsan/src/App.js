import Navbar from "./components/Navbar";
import Filters from "./components/Filters";
import Rentals from "./pages/Rentals";
import Footer from "./components/Footer";
import Login from "./components/Login"; // Import Login
import Register from "./components/Register"; // Import Register
import DetailRegister from "./components/DetailRegister";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import DetailProduct from "./components/DetailProduct";
import CartProduct from "./components/CartProduct";
import Checkout from "./components/Checkout";
import FarmerProductForm from "./components/FarmerProductForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Import the provider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/home";

function App() {
  // Styles for the app layout
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensures the app takes at least full height of the viewport
  };

  const mainContentStyle = {
    flex: 1, // Takes all the available space
    padding: '10px', // Add some padding if desired
  };

  return (
    <AuthProvider>
      <div style={appStyle}>
        <Router>
          <Navbar /> {/* Navbar always visible */}
          <div style={mainContentStyle}>
            <Routes>
              {/* <Route path="/filters" element={<Filters />} /> */}
              {/* <Route path="/" element={<Rentals />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} /> {/* Login route */}
              <Route path="/register" element={<Register />} /> {/* Register route */}
              <Route path="/detailregister" element={<DetailRegister />} /> {/* Detail Register route */}
              <Route path="/profile" element={<Profile />} /> {/* Profile route */}
              <Route path="/edit-profile" element={<EditProfile />} /> {/* Edit Profile route */}
              <Route path="/product/:idProduct" element={<DetailProduct />} />
              <Route path="/cart" element={<CartProduct />}/> {/* Register route */}
              <Route path="/checkout"  element={<Checkout />}/> {/* Register route */}
              <Route path="/farmer"  element={<FarmerProductForm />}/>
            </Routes>
          </div>
          <Footer /> {/* Footer always visible */}
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
