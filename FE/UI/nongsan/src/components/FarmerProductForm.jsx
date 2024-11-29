import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ProductService from "../services/ProductService";
import axios from "axios";
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
  apiGetPublicWard,
} from "../services/address";
import SellectAddress from "../components/SellectAddress";
const FarmerProductForm = ({ initialData = {}, onSave }) => {
  // Add address-related fields to the initial state
  const [formData, setFormData] = useState({
    productName: initialData?.productName || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
    status: initialData?.status || "Còn hàng",
    productImage: initialData?.productImage || [], // Cập nhật để chứa mảng ảnh
    productDescription: initialData?.productDescription || "",
    idSubcategory: initialData?.idSubcategory || "",
    specificAddress: initialData?.specificAddress || "",
    ward: initialData?.ward || "",
    district: initialData?.district || "",
    city: initialData?.city || "",
    expirationDate: initialData?.expirationDate || "",
    qualityCheck: initialData?.qualityCheck || "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]); // Danh sách categories
  const [errors, setErrors] = useState({});
  const { idProduct } = useParams();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [specificAddress, setSpecificAddress] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [reset, setReset] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(true);

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

    // Update the address fields in formData
    setFormData({
      ...formData,
      specificAddress, // Ensure specific address is set
      ward, // Make sure ward is set
      district, // Make sure district is set
      city: province, // Set city as province
    });
  };

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
    updateAddressValue();
  }, [specificAddress, ward, district, province]);

  useEffect(() => {
    // Lấy danh sách categories và subcategories từ API
    ProductService.listCategoriesAndSubcategories()
      .then((response) => {
        setCategories(response.data); // Lưu danh sách categories
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách loại sản phẩm:", error);
      });

    // Gọi API để lấy danh sách tỉnh thành
    // axios
    //   .get(`${host}?depth=1`)
    //   .then((response) => setProvinces(response.data));

    // Nếu là chỉnh sửa, lấy thông tin sản phẩm
    if (idProduct) {
      ProductService.getProductById(idProduct)
        .then((response) => {
          const data = response.data;
          setFormData({
            productName: data.nameProduct || "",
            price: data.priceProduct || "",
            quantity: data.quantityProduct || "",
            status: data.statusProduct || "Còn hàng",
            productImage: data.imageProducts || [], // Cập nhật với mảng ảnh
            productDescription: data.descriptionProduct || "",
            idSubcategory: data.idSubcategory || "",
            specificAddress: data.specificAddress || "",
            ward: data.ward || "",
            district: data.district || "",
            city: data.city || "", // Lưu tên thành phố
          });
          // // Lấy danh sách quận huyện khi đã có tỉnh thành
          // if (data.city) {
          //   axios
          //     .get(`${host}p/${data.city}?depth=2`)
          //     .then((response) => setDistricts(response.data.districts));
          // }

          // // Lấy danh sách phường xã khi đã có quận huyện
          // if (data.district) {
          //   axios
          //     .get(`${host}d/${data.district}?depth=2`)
          //     .then((response) => setWards(response.data.wards));
          // }
        })
        .catch((error) => {
          console.error("Lỗi khi tải thông tin sản phẩm:", error);
        });
    }
  }, [idProduct]); // Chạy lại khi idProduct thay đổi
  // Add address validation in the validateForm function
  function validateForm() {
    const errorsCopy = {};
    if (!formData.productName.trim())
      errorsCopy.productName = "Tên sản phẩm bắt buộc";
    if (!formData.price.trim()) errorsCopy.price = "Giá bắt buộc";
    if (!String(formData.quantity).trim())
      errorsCopy.quantity = "Số lượng bắt buộc";
    if (formData.productImage.length === 0) errorsCopy.productImage = "Ảnh sản phẩm là bắt buộc";
    if (!formData.productDescription.trim())
      errorsCopy.productDescription = "Mô tả bắt buộc";
    if (!selectedCategory) errorsCopy.category = "Loại sản phẩm bắt buộc";
    if (!formData.idSubcategory.trim())
      errorsCopy.idSubcategory = "Nhóm sản phẩm bắt buộc";
    if (!formData.specificAddress.trim())
      errorsCopy.specificAddress = "Địa chỉ cụ thể bắt buộc";
    if (!formData.ward.trim()) errorsCopy.ward = "Phường/xã bắt buộc";
    if (!formData.district.trim()) errorsCopy.district = "Quận/huyện bắt buộc";
    if (!formData.city.trim()) errorsCopy.city = "Thành phố bắt buộc";
    if (!formData.expirationDate.trim())
      errorsCopy.expirationDate = "Ngày hết hạn bắt buộc";
    if (!formData.qualityCheck.trim())
      errorsCopy.qualityCheck = "Chất lượng sản phẩm bắt buộc";

    setErrors(errorsCopy);
    return Object.keys(errorsCopy).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const updatedImages = [...formData.productImage];
    for (let i = 0; i < files.length; i++) {
      if (files[i] instanceof File) {
        updatedImages.push(files[i]);
      }
    }
    setFormData({ ...formData, productImage: updatedImages });
  };
  

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCategory(selectedId);
    setFormData({ ...formData, idSubcategory: "" }); // Reset subcategory khi thay đổi category
  };

  // Update handleSubmit to include address fields in the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Lấy tên các địa lý từ ID
    const wardName = wards?.find(
      (item) => item.ward_id === formData.ward
    )?.ward_name;
    const districtName = districts?.find(
      (item) => item.district_id === formData.district
    )?.district_name;
    const cityName = provinces?.find(
      (item) => item.province_id === formData.city
    )?.province_name;

    const formDataWithImage = new FormData();
    formDataWithImage.append("productName", formData.productName);
    formDataWithImage.append("productDescription", formData.productDescription);
    formDataWithImage.append("price", formData.price);
    formDataWithImage.append("quantity", formData.quantity);
    formDataWithImage.append("status", formData.status);
    formDataWithImage.append("idSubcategory", formData.idSubcategory);
    formDataWithImage.append("specificAddress", formData.specificAddress);
    formDataWithImage.append("ward", wardName || formData.ward); // Nếu không tìm được tên thì dùng ID
    formDataWithImage.append("district", districtName || formData.district);
    formDataWithImage.append("city", cityName || formData.city);
    formDataWithImage.append("expirationDate", formData.expirationDate);
    formDataWithImage.append("qualityCheck", formData.qualityCheck);

    formData.productImage.forEach((file) => formDataWithImage.append("productImage", file));


    const url = idProduct
      ? `http://localhost:8080/api/product/update/${idProduct}`
      : "http://localhost:8080/api/product/add";

    try {
      const response = await fetch(url, {
        method: idProduct ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataWithImage,
      });

      if (response.ok) {
        if (onSave) onSave(); // Call onSave if provided
        navigate("/productmanager");
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  const styles = {
    formContainer: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      display: "grid",
      gridTemplateColumns: "1fr",  // Keep the form as a single column for simplicity
      gap: "20px",
      backgroundColor: "#F5F8F2",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
      gridColumn: "span 2",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#4B752A",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
    },
    uploadContainer: {
      padding: "10px",
      border: "1px dashed #ddd",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "200px",
      textAlign: "center",
      fontSize: "14px",
      color: "#666",
      flexDirection: "column",
      gridColumn: "span 2",
      overflow: "hidden", // Prevents image overflow
    },
    imagePreviewContainer: {
      display: "flex",
      flexWrap: "wrap", // Allows images to wrap to the next line
      gap: "10px", // Spacing between images
      justifyContent: "flex-start", // Align images to the left
      marginTop: "10px", // Margin between input and image preview
    },
    imagePreview: {
      width: "100px", // Set width for image container
      height: "100px", // Set height for image container
      borderRadius: "4px",
      objectFit: "cover", // Ensures the image fits within the fixed dimensions without distortion
    },
    submitButton: {
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      gridColumn: "span 2",
    },
    addressForm: {
      padding: "10px",
      backgroundColor: "#e5e7eb",
      color: "black",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      gridColumn: "span 2",
    },
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>
        {idProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </h2>
      <div style={styles.uploadContainer}>
      <label>Ảnh sản phẩm</label>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      {formData.productImage && formData.productImage.length > 0 && (
        <div style={styles.imagePreviewContainer}>
          {formData.productImage.map((image, index) => (
            <div key={index}>
              {image && image instanceof File && (
                <img
                  src={URL.createObjectURL(image)}
                  alt={`product-image-${index}`}
                  style={styles.imagePreview}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {errors.productImage && <p style={{ color: "red" }}>{errors.productImage}</p>}
    </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Tên Sản Phẩm *</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {errors.productName && (
          <p style={{ color: "red" }}>{errors.productName}</p>
        )}
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Mô tả</label>
        <input
          type="text"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.productDescription && (
          <p style={{ color: "red" }}>{errors.productDescription}</p>
        )}
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Giá (VND) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Số Lượng *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {errors.quantity && <p style={{ color: "red" }}>{errors.quantity}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Ngày hết hạn *</label>
        <input
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]} // Giới hạn ngày quá khứ
          style={styles.input}
          required
        />
        {errors.expirationDate && (
          <p style={{ color: "red" }}>{errors.expirationDate}</p>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Chất lượng sản phẩm *</label>
        <input
          type="text"
          name="qualityCheck"
          value={formData.qualityCheck}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {errors.qualityCheck && (
          <p style={{ color: "red" }}>{errors.qualityCheck}</p>
        )}
      </div>

      {/* Address */}
      <div style={styles.formGroup}>
        <SellectAddress
          type="province"
          value={province}
          setValue={(value) => {
            setProvince(value); // Chắc chắn cập nhật state
            setFormData({ ...formData, city: value }); // Update city (province)
          }}
          options={provinces}
          label="Province/City(Tỉnh)"
        />
        {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
      </div>

      <div style={styles.formGroup}>
        <SellectAddress
          reset={reset}
          type="district"
          value={district}
          setValue={(value) => {
            setDistrict(value); // Cập nhật state district
            setFormData({ ...formData, district: value }); // Cập nhật district trong formData
          }}
          options={districts}
          label="District(Quận)"
        />
        {errors.district && <p style={{ color: "red" }}>{errors.district}</p>}
      </div>

      <div style={styles.formGroup}>
        <SellectAddress
          reset={reset}
          type="ward"
          value={ward}
          setValue={(value) => {
            setWard(value); // Cập nhật state ward
            setFormData({ ...formData, ward: value }); // Cập nhật ward trong formData
          }}
          options={wards}
          label="Wards(phường)"
        />
        {errors.ward && <p style={{ color: "red" }}>{errors.ward}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Địa chỉ cụ thể *</label>
        <input
          type="text"
          name="specificAddress"
          value={formData.specificAddress}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {errors.specificAddress && (
          <p style={{ color: "red" }}>{errors.specificAddress}</p>
        )}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Loại Sản Phẩm *</label>
        <select
          name="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={styles.input}
        >
          <option value="">-- Chọn loại sản phẩm --</option>
          {categories.map((category) => (
            <option key={category.idCategory} value={category.idCategory}>
              {category.nameCategory}
            </option>
          ))}
        </select>
        {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Nhóm Sản Phẩm *</label>
        <select
          name="idSubcategory"
          value={formData.idSubcategory}
          onChange={handleChange}
          style={styles.input}
          disabled={!selectedCategory} // Disable khi chưa chọn category
        >
          <option value="">-- Chọn nhóm sản phẩm --</option>
          {categories
            .find(
              (category) => category.idCategory === Number(selectedCategory)
            )
            ?.subcategoriesResponses.map((subcategory) => (
              <option
                key={subcategory.idSubcategory}
                value={subcategory.idSubcategory}
              >
                {subcategory.nameSubcategory}
              </option>
            ))}
        </select>
        {errors.idSubcategory && (
          <p style={{ color: "red" }}>{errors.idSubcategory}</p>
        )}
      </div>
      <input
        type="text"
        readOnly
        className="form-control"
        value={address}
        style={styles.addressForm}
      />
      <button type="submit" style={styles.submitButton} onClick={handleSubmit}>
        {idProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
      </button>
      <Link
        to="/productmanager"
        style={styles.submitButton}
        className="text-center"
      >
        Quay lại
      </Link>
    </div>
  );
};

export default FarmerProductForm;
