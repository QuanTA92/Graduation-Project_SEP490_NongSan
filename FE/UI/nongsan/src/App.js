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
import HomePage from "./pages/HomePage";
import CarouselNavbar from "./components/CarouselNavbar";
import Admin from "./components/admin";
import ProductManagement from "./components/ProductManagement";
import ProductListPage from "./components/ProductListPage";
import AdminPage from "./pages/AdminPage";
// import Address from "./components/Address";
import { CartProvider } from "./CartProvider";
import OrderTrader from "./components/OrderTrader";
import PaymentResult from "./components/PaymentResult";

function App() {
  // Styles for the app layout
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensures the app takes at least full height of the viewport
  };

  // const mainContentStyle = {
  //   flex: 1, // Takes all the available space
  //   // padding: '10px', // Add some padding if desired
  // };

  return (
    <AuthProvider>
      <CartProvider>
      <div style={appStyle}>
        <Router>
          <Navbar /> {/* Navbar always visible */}
          <div >
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
              <Route path="/add"  element={<FarmerProductForm />}/>
              <Route path="/update/:idProduct"  element={<FarmerProductForm />}/>

              <Route path="/admin"  element={<Admin />}/>
              <Route path="/productmanager"  element={<ProductManagement />}/>
              <Route path="/productlist"  element={<ProductListPage />}/>
              <Route path="/adminpage"  element={<AdminPage />}/>
              <Route path="/orderhistory"  element={<OrderTrader />}/>
              <Route path="/result"  element={<PaymentResult />}/>

              {/* <Route path="/address"  element={<Address />}/> */}

            </Routes>
          </div>
          <Footer /> {/* Footer always visible */}
        </Router>
      </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
