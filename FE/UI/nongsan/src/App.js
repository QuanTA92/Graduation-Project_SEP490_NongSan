import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import DetailRegister from "./components/DetailRegister";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import DetailProduct from "./components/DetailProduct";
import CartProduct from "./components/CartProduct";
import Checkout from "./components/Checkout";
import FarmerProductForm from "./components/FarmerProductForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import Admin from "./components/admin";
import ProductManagement from "./components/ProductManagement";
import ProductListPage from "./components/ProductListPage";
import OrderTrader from "./components/OrderTrader";
import PrivateRoute from "../src/PrivateRoute";
import WalletForm from "./components/WalletForm";
import { CartProvider } from "./CartProvider";
import AdminOrderListPage from "./components/Admin/AdminOrderListPage";
import LayoutAdmin from "../src/LayoutAdmin";
import UserCRUDPage from "./components/Admin/UserCRUDPage";
import UserForm from "./components/Admin/UserForm";
import CarouselManager from "./components/Admin/CarouselManager";
import BlogManager from "./components/Admin/BlogManager";
import BlogPage from "./components/BlogPage";
import BlogDetail from "./components/BlogDetail";
import CateAndSubCRUD from "./components/Admin/CateAndSubCRUD";
import CateCRUD from "./components/Admin/CateCRUD";
import SubCRUD from "./components/Admin/SubCRUD";
import WalletAllHouseHold from "./components/Admin/WalletAllHouseHold";
import Wallet from "./components/Wallet";
import DashboardHouseHold from "./components/DashboardHouseHold";
import OrderManager from "./components/OrderManager";
import FindOrderById from "./components/FindOrderById";

// Layout component for pages that need Navbar and Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  const appStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Ensures the app takes at least full height of the viewport
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div style={appStyle}>
          <Router>
            <Routes>
              {/* Admin Routes without Navbar and Footer */}
              <Route path="/adminpage" element={<AdminPage />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/listorderforadmin"
                element={
                  <LayoutAdmin>
                    <AdminOrderListPage />
                  </LayoutAdmin>
                }
              />
              <Route
                path="/usercrud"
                element={
                  <LayoutAdmin>
                    <UserCRUDPage />
                  </LayoutAdmin>
                }
              />
              <Route path="/userform" element={<UserForm />} />
              <Route
                path="/carouselmanager"
                element={
                  <LayoutAdmin>
                    <CarouselManager />
                  </LayoutAdmin>
                }
              />
              <Route
                path="/blogmanager"
                element={
                  <LayoutAdmin>
                    <BlogManager />
                  </LayoutAdmin>
                }
              />
              <Route
                path="/cateandsubcrud"
                element={
                  <LayoutAdmin>
                    <CateAndSubCRUD />
                  </LayoutAdmin>
                }
              />
              <Route
                path="/catecrud"
                element={
                  <LayoutAdmin>
                    <CateCRUD />
                  </LayoutAdmin>
                }
              />
              <Route
                path="/subcrud"
                element={
                  <LayoutAdmin>
                    <SubCRUD />
                  </LayoutAdmin>
                }
              />
              <Route
                path="/wallethousehold"
                element={
                  <LayoutAdmin>
                    <WalletAllHouseHold />
                  </LayoutAdmin>
                }
              />

              {/* Main Routes with Navbar and Footer */}
              <Route
                path="/blogpage"
                element={
                  <MainLayout>
                    <BlogPage />
                  </MainLayout>
                }
              />

              <Route
                path="/dash"
                element={
                  <MainLayout>
                    <DashboardHouseHold/>
                  </MainLayout>
                }
              />

              <Route
                path="/ordermanager"
                element={
                  <MainLayout>
                    <OrderManager/>
                  </MainLayout>
                }
              />

              <Route
                path="/findOrderById"
                element={
                  <MainLayout>
                    <FindOrderById/>
                  </MainLayout>
                }
              />

              <Route
                path="/wallet"
                element={
                  <MainLayout>
                    <Wallet />
                  </MainLayout>
                }
              />

              <Route
                path="/blog/:id"
                element={
                  <MainLayout>
                    <BlogDetail />
                  </MainLayout>
                }
              />

              <Route
                path="/"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <MainLayout>
                    <Login />
                  </MainLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <MainLayout>
                    <Register />
                  </MainLayout>
                }
              />
              <Route
                path="/productlist"
                element={
                  <MainLayout>
                    <ProductListPage />
                  </MainLayout>
                }
              />
              <Route
                path="/product/:idProduct"
                element={
                  <MainLayout>
                    <DetailProduct />
                  </MainLayout>
                }
              />
              <Route
                path="/detailregister"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <DetailRegister />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <EditProfile />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <CartProduct />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Checkout />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <FarmerProductForm />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/update/:idProduct"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <FarmerProductForm />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/productmanager"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <ProductManagement />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <MainLayout>
                    <OrderTrader />
                  </MainLayout>
                }
              />
              <Route
                path="/create-wallet"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <WalletForm />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
