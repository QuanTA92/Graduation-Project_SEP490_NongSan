import Navbar from "./components/Navbar";
import Filters from "./components/Filters";
import Rentals from "./components/Rentals";
import Footer from "./components/Footer";
import Login from "./components/Login"; // Import Login
import Register from "./components/Register"; // Import Register
import DetailRegister from "./components/DetailRegister";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import DetailProduct from "./components/DetailProduct";
import CartProduct from "./components/CartProduct";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Import the provider

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar /> {/* Navbar always visible */}
          <div className="sm:mx-6 md:mx-10 lg:mx-12 px-3">
            <Routes>
              <Route path="/" element={<Filters />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/login" element={<Login />} /> {/* Login route */}
              <Route path="/register" element={<Register />} /> {/* Register route */}
              <Route path="/detailregister" element={<DetailRegister />} /> {/* Register route */}
              <Route path="/profile" element={<Profile />} /> {/* Register route */}
              <Route path="/edit-profile" element={<EditProfile />} /> {/* Register route */}
              <Route path="/detailproduct" element={<DetailProduct />}/> {/* Register route */}
              <Route path="/cart" element={<CartProduct />}/> {/* Register route */}
            </Routes>
          </div>
          <Footer /> {/* Footer always visible */}
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
