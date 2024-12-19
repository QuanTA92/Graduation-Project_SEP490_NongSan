import React, { useEffect, useState } from "react";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import { Link } from "react-router-dom";
import Filters from "./Filters";
import { useCart } from "../CartProvider";
import FindAddress from "../components/FindAddress";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
  apiGetPublicWard,
} from "../services/findAddress";
import SellectAddress from "../components/SellectAddress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 4; // Số sản phẩm mỗi trang
  const token = localStorage.getItem("token"); // Giả sử bạn lưu JWT trong localStorage
  const { cartCount, setCartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0); // Tổng số sản phẩm

  // Address-related states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState(""); // Selected province
  const [district, setDistrict] = useState(""); // Selected district
  const [ward, setWard] = useState(""); // Selected ward
  const [provinceName, setProvinceName] = useState(""); // Province name
  const [districtName, setDistrictName] = useState(""); // District name
  const [wardName, setWardName] = useState(""); // Ward name

  const [provinceId, setProvinceId] = useState(""); // Province ID
  const [districtId, setDistrictId] = useState(""); // District ID
  const [wardId, setWardId] = useState(""); // Ward ID
  const [specificAddress, setSpecificAddress] = useState("");
  const [address, setAddress] = useState("");

  const [minPrice, setMinPrice] = useState(""); // Giá tối thiểu
  const [maxPrice, setMaxPrice] = useState(""); // Giá tối đa

  // Tìm kiếm sản phẩm theo khoảng giá
  const handlePriceSearch = async () => {
    if (!minPrice && !maxPrice) {
      toast.warning("Vui lòng nhập khoảng giá.");
      return;
    }

    try {
      const response = await ProductService.findProductByPrice(
        minPrice,
        maxPrice
      );
      if (response.status === 200) {
        setProducts(response.data);
        setCurrentPage(1); // Reset về trang đầu tiên
      } else {
        toast.warning("Không tìm thấy sản phẩm nào với khoảng giá này.");
        setProducts([]); // Nếu không có sản phẩm, đặt danh sách sản phẩm rỗng
      }
    } catch (error) {
      console.error("Error searching products by price:", error);
      toast.error("Không thể tìm kiếm sản phẩm theo giá. Vui lòng thử lại.");
    }
  };

  const updateAddressValue = () => {
    const newAddress = `${specificAddress} ${
      ward ? `${wards?.find((item) => item.ward_id === ward)?.ward_name},` : ""
    } ${
      district
        ? `${
            districts?.find((item) => item.district_id === district)
              ?.district_name
          },`
        : ""
    } ${
      province
        ? provinces?.find((item) => item.province_id === province)
            ?.province_name
        : ""
    }`;
    setAddress(newAddress.trim());
  };

  // Fetch products and categories
  useEffect(() => {
    Promise.all([
      ProductService.listAllProducts(), // Fetch all products
      ProductService.listCategoriesAndSubcategories(), // Fetch categories
    ])
      .then(([productResponse, categoryResponse]) => {
        setProducts(productResponse.data); // Set products
        setCategories(categoryResponse.data); // Set categories
        setTotalProducts(productResponse.data.length); // Set total products
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await apiGetPublicProvinces();
        if (response.status === 200) setProvinces(response.data.results);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (province) {
      setDistrict("");
      setWard("");
      const fetchDistricts = async () => {
        try {
          const response = await apiGetPublicDistrict(province);
          if (response.status === 200) setDistricts(response.data.results);
        } catch (error) {
          console.error("Failed to fetch districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      setWard("");
      const fetchWards = async () => {
        try {
          const response = await apiGetPublicWard(district);
          if (response.status === 200) setWards(response.data.results);
        } catch (error) {
          console.error("Failed to fetch wards:", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [district]);

  useEffect(() => {
    const selectedProvince = provinces.find(
      (item) => item.province_id === province
    );
    const selectedDistrict = districts.find(
      (item) => item.district_id === district
    );
    const selectedWard = wards.find((item) => item.ward_id === ward);

    setProvinceName(selectedProvince?.province_name || "");
    setDistrictName(selectedDistrict?.district_name || "");
    setWardName(selectedWard?.ward_name || "");

    updateAddressValue();
  }, [province, district, ward]);

  // Fetch products by address
  useEffect(() => {
    const fetchProductsByAddress = async () => {
      try {
        // console.log("Tỉnh:", provinceName);
        // console.log("Quận:", districtName);
        // console.log("Phường:", wardName);

        const response = await ProductService.findProductByAddress(
          provinceName,
          districtName,
          wardName
        );

        if (response.status === 200 && response.data.length > 0) {
          setProducts(response.data); // Cập nhật danh sách sản phẩm
          setCurrentPage(1); // Reset về trang đầu tiên
        } else {
          // Khi không tìm thấy sản phẩm
          toast.warning(
            "Không có sản phẩm tại địa điểm này. Hiển thị tất cả sản phẩm."
          );
          resetAddressAndProducts(); // Reset địa chỉ và sản phẩm
        }
      } catch (error) {
        console.error("Error fetching products by address:", error);
        toast.warning(
          "Không thể tải sản phẩm theo địa điểm. Hiển thị tất cả sản phẩm."
        );
        resetAddressAndProducts(); // Reset địa chỉ và sản phẩm
      }
    };

    if (provinceName || districtName || wardName) {
      fetchProductsByAddress();
    }
  }, [provinceName, districtName, wardName]);

  // Hàm reset địa chỉ và danh sách sản phẩm
  const resetAddressAndProducts = async () => {
    try {
      // Reset địa chỉ
      setProvince("");
      setDistrict("");
      setWard("");
      setProvinceName("");
      setDistrictName("");
      setWardName("");
      setAddress("");

      // Tải lại toàn bộ danh sách sản phẩm
      const response = await ProductService.listAllProducts();
      setProducts(response.data);
      setCurrentPage(1); // Reset về trang đầu tiên
    } catch (error) {
      console.error("Error resetting products and address:", error);
      toast.error("Không thể tải lại danh sách sản phẩm. Vui lòng thử lại.");
    }
  };

  // Xử lý debounce cho tìm kiếm
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    //   // Đặt thời gian chờ trước khi gọi API
    const timeout = setTimeout(async () => {
      try {
        if (!searchTerm.trim()) {
          // Nếu không có từ khóa, tải lại danh sách sản phẩm đầy đủ
          const response = await ProductService.listAllProducts();
          setProducts(response.data);
        } else {
          // Gọi API tìm kiếm sản phẩm theo từ khóa
          const response = await ProductService.findProductByName(searchTerm);
          setProducts(response.data);
          setCurrentPage(1); // Reset về trang đầu tiên
        }
      } catch (error) {
        console.error("Error searching for products:", error);
        toast.error("Không tìm thấy sản phẩm nào.");
        setProducts([]); // Nếu lỗi, đặt danh sách sản phẩm rỗng
      }
    }, 500); // Delay 500ms

    setDebounceTimeout(timeout);

    // Dọn dẹp timeout trước đó nếu người dùng nhập tiếp
    return () => clearTimeout(timeout);
  }, [searchTerm]);
  // Hàm thêm sản phẩm vào giỏ hàng

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    // Tìm sản phẩm theo ID
    const product = products.find((p) => p.idProduct === productId);

    if (product && product.quantityProduct <= 0) {
      toast.warning("Sản phẩm này đã hết hàng.");
      return; // Dừng lại nếu sản phẩm hết hàng
    }

    const cartItem = {
      idProduct: productId,
      quantity: 1, // Mặc định số lượng là 1
    };

    try {
      // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
      await CartService.addItemToCart(cartItem, token);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng.");

      // Cập nhật số lượng giỏ hàng trực tiếp mà không cần gọi lại API
      setCartCount(cartCount + 1); // Tăng số lượng giỏ hàng
    } catch (error) {
      console.error("Có lỗi xảy ra khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  // Hàm lấy sản phẩm theo subcategory
  const handleSubcategoryClick = async (subcategoryId) => {
    try {
      const response = await ProductService.getProductBySubcategory(
        subcategoryId
      );
      setProducts(response.data); // Cập nhật state `products`
      setCurrentPage(1); // Reset về trang đầu tiên
    } catch (error) {
      console.error("Error fetching products by subcategory:", error);
      toast.error("Không thể tải sản phẩm theo loại này. Vui lòng thử lại.");
      setProducts([]); // Nếu lỗi, đặt danh sách sản phẩm rỗng
    }
  };
  const availableProducts = products.filter((product) => {
    const expirationDate = new Date(product.expirationDate);
    const currentDate = new Date();
    return expirationDate >= currentDate; // Chỉ giữ sản phẩm có ngày hết hạn lớn hơn hoặc bằng ngày hiện tại
  });
  const resetProducts = async () => {
    try {
      const response = await ProductService.listAllProducts();
      setProducts(response.data); // Đặt lại danh sách sản phẩm
      setCurrentPage(1); // Reset về trang đầu tiên
    } catch (error) {
      console.error("Error resetting products:", error);
      toast.error("Không thể tải lại danh sách sản phẩm. Vui lòng thử lại.");
    }
  };

  // Tính toán các sản phẩm hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = availableProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Tổng số trang
  const totalPages = Math.ceil(availableProducts.length / itemsPerPage);

  // Điều hướng trang
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  // Lọc các sản phẩm có ngày hết hạn trong tương lai

  return (
    <div>
      <>
        <div className="container-fluid fruite">
          <div className="container py-3">
            <Filters />
            <ToastContainer
              position="bottom-left" // Hiển thị thông báo ở góc dưới bên trái
              autoClose={3000} // Thời gian tự động đóng (ms)
              hideProgressBar={false} // Hiển thị thanh tiến trình
              newestOnTop={false} // Thông báo mới nhất không hiển thị trên cùng
              closeOnClick // Đóng thông báo khi click
              rtl={false} // Không dùng chế độ RTL
              pauseOnFocusLoss // Tạm dừng khi mất tiêu điểm
              draggable // Có thể kéo thông báo
              pauseOnHover // Tạm dừng khi hover vào thông báo
            />
            <div className="row g-4">
              <div className="col-lg-12">
                <div className="row g-4">
                  <div className="col-lg-3">
                    <div className="row g-4">
                      {/* Phần thanh tìm kiếm */}
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <h4>Tìm kiếm sản phẩm</h4>
                          <div className="input-group w-100 mx-auto d-flex">
                            <input
                              type="search"
                              className="form-control p-3"
                              placeholder="Nhập từ khóa cần tìm"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)} // Xử lý ngay khi thay đổi
                            />
                            <span
                              id="search-icon-1"
                              className="input-group-text p-3"
                              style={{ cursor: "pointer" }}
                            >
                              <i className="fa fa-search" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Phần danh mục sản phẩm */}
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <h4>Danh mục sản phẩm</h4>
                          <ul className="list-unstyled fruite-categorie">
                            <li>
                              <div className="d-flex justify-content-between fruite-name">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault(); // Ngăn việc reload trang
                                    resetProducts(); // Hàm để hiển thị tất cả sản phẩm
                                  }}
                                >
                                  Tất cả sản phẩm
                                </a>
                                <span>({totalProducts})</span>
                              </div>
                            </li>
                            {categories.map((category) => (
                              <li key={category.idCategory}>
                                <div className="d-flex justify-content-between fruite-name">
                                  <a href="#">
                                    <i className="fas fa-apple-alt me-2" />
                                    {category.nameCategory}
                                  </a>
                                  <span>
                                    ({category.subcategoriesResponses.length})
                                  </span>
                                </div>
                                <ul className="ms-4 list-unstyled subcategory-list">
                                  {category.subcategoriesResponses.map(
                                    (subcategory) => (
                                      <li key={subcategory.idSubcategory}>
                                        <div className="subcategory-item">
                                          <a
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault(); // Ngăn việc reload trang
                                              handleSubcategoryClick(
                                                subcategory.idSubcategory
                                              );
                                            }}
                                          >
                                            {subcategory.nameSubcategory}
                                          </a>
                                        </div>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="mb-3">
                          <h4>Lọc theo giá</h4>
                          <div className="d-flex">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Giá tối thiểu"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)} // Cập nhật minPrice
                            />
                            {/* <span className="mx-2">đến</span> */}
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Giá tối đa"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)} // Cập nhật maxPrice
                            />
                            <button
                              className="btn btn-primary ms-2"
                              onClick={handlePriceSearch}
                            >
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Phần lọc địa điểm */}
                      <div className="col-lg-12">
                        <h4>Lọc sản phẩm theo địa điểm</h4>
                        <FindAddress
                          type="province"
                          value={province}
                          setValue={setProvince}
                          options={provinces}
                          label="Chọn thành phố"
                        />
                        <FindAddress
                          type="district"
                          value={district}
                          setValue={setDistrict}
                          options={districts}
                          label="Chọn quận"
                        />
                        <FindAddress
                          type="ward"
                          value={ward}
                          setValue={setWard}
                          options={wards}
                          label="Chọn phường"
                        />

                        <input
                          type="text"
                          readOnly
                          className="form-control d-none"
                          value={address}
                          // style={styles.addressForm}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                    <div className="mb-4">
                      <h5 className="text-secondary">
                        Hiển thị{" "}
                        <span className="text-primary fw-bold">
                          {availableProducts.length}
                        </span>{" "}
                        sản phẩm
                      </h5>
                    </div>
                    <div className="row g-4 justify-content">
                      {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                          <div
                            key={product.idProduct}
                            className="col-md-6 col-lg-6 col-xl-3"
                          >
                            <div className="rounded position-relative fruite-item">
                              <Link to={`/product/${product.idProduct}`}>
                                <div className="fruite-img">
                                  <img
                                    src={product.imageProducts[0]}
                                    className="img-fluid w-100 rounded-top"
                                    alt={product.nameProduct}
                                    style={{
                                      height: "200px", // Fixed height for images
                                      objectFit: "cover", // Ensures the image scales correctly
                                    }}
                                  />
                                </div>
                                <div
                                  className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                                  style={{ top: 10, left: 10 }}
                                >
                                  {product.nameSubcategory}
                                </div>
                              </Link>

                              <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                <h4>{product.nameProduct}</h4>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                  <p className="text-dark fs-5 fw-bold mb-0">
                                    {Number(
                                      product.priceProduct
                                    ).toLocaleString()}{" "}
                                    đ/kg
                                  </p>

                                  {/* Kiểm tra xem sản phẩm có hết hạn hay không */}
                                  {product.statusProduct === "Hết hàng" ? (
                                    <button
                                      className="btn btn-danger rounded-pill px-3"
                                      disabled
                                    >
                                      Hết hàng
                                    </button>
                                  ) : (
                                    <button
                                      className="btn border border-secondary rounded-pill px-3 text-primary"
                                      onClick={() =>
                                        handleAddToCart(product.idProduct)
                                      }
                                    >
                                      <i className="fa fa-shopping-bag me-2 text-primary" />
                                      Thêm vào giỏ hàng
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center">
                          <h4>Không có sản phẩm nào</h4>
                        </div>
                      )}

                      <div className="col-12">
                        <div className="pagination d-flex justify-content-center mt-5">
                          <a
                            href="#"
                            className={`rounded ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                            onClick={() =>
                              currentPage > 1 && goToPage(currentPage - 1)
                            }
                          >
                            «
                          </a>
                          {Array.from({ length: totalPages }, (_, index) => (
                            <a
                              key={index + 1}
                              href="#"
                              className={`rounded ${
                                currentPage === index + 1 ? "active" : ""
                              }`}
                              onClick={() => goToPage(index + 1)}
                            >
                              {index + 1}
                            </a>
                          ))}
                          <a
                            href="#"
                            className="rounded"
                            onClick={() =>
                              currentPage < totalPages &&
                              goToPage(currentPage + 1)
                            }
                          >
                            »
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default ProductListPage;
