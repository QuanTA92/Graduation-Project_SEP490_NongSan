package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.exception.FuncErrorException;
import com.fpt.Graduation_Project_SEP490_NongSan.exception.NotFoundException;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.CloudinaryResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.*;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.FileUploadUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private HouseHoldProductRepository houseHoldProductRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private ImageProductRepository imageProductRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PriceMonitoringRepository priceMonitoringRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public boolean addProduct(ProductRequest productRequest) {
        try {
            // Lấy subcategory
            Subcategory subcategory = subcategoryRepository.findById(productRequest.getIdSubcategory())
                    .orElseThrow(() -> new RuntimeException("Subcategory not found"));

            List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByProductSubcategory(subcategory);

            // Tính giá trung bình từ bảng HouseHoldProduct
            double averagePrice = houseHoldProducts.stream()
                    .mapToDouble(HouseHoldProduct::getPrice)
                    .average()
                    .orElse(0.0); // Nếu không có sản phẩm, trả về 0

            // Khai báo giá tối thiểu và tối đa
            double minPrice = averagePrice * 0.85;
            double maxPrice = averagePrice * 1.15;

            // Kiểm tra nếu là sản phẩm đầu tiên thuộc subcategory
            if (!houseHoldProducts.isEmpty()) {
                double userPrice = productRequest.getPrice();
                if (userPrice < minPrice || userPrice > maxPrice) {
                    throw new RuntimeException(String.format("Price must be within %d and %d", (int) minPrice, (int) maxPrice));
                }
            }

            // Tạo sản phẩm mới
            Product product = new Product();
            product.setName(productRequest.getProductName());
            product.setQualityCheck(productRequest.getQualityCheck());
            product.setDescription(productRequest.getProductDescription());
            product.setExpirationDate(productRequest.getExpirationDate());
            product.setCreatedAt(new Date());
            product.setQuantity(productRequest.getQuantity());
            product.setSubcategory(subcategory);

            // Tạo địa chỉ
            Address address = new Address();
            address.setSpecificAddress(productRequest.getSpecificAddress());
            address.setWard(productRequest.getWard());
            address.setDistrict(productRequest.getDistrict());
            address.setCity(productRequest.getCity());
            address.setCreateDate(new Date());
            addressRepository.save(address);

            product.setAddress(address);

            // Lưu sản phẩm vào cơ sở dữ liệu
            productRepository.save(product);

            // Lưu hình ảnh vào thư mục
            for (MultipartFile productImage : productRequest.getProductImage()) {
                // Kiểm tra nếu file được phép upload
                FileUploadUtil.assertAllowed(productImage, FileUploadUtil.IMAGE_PATTERN);

                // Tạo tên file và upload lên Cloudinary
                final String fileName = FileUploadUtil.getFileName(productImage.getOriginalFilename());
                final CloudinaryResponse response = cloudinaryService.uploadFile(productImage, fileName);

                // Tạo đối tượng ImageProduct và thiết lập các thuộc tính
                ImageProduct imageProduct = new ImageProduct();
                imageProduct.setProduct(product);
                imageProduct.setCloudinaryImageId(response.getPublicId()); // Lưu public ID từ Cloudinary
                imageProduct.setImageUrl(response.getUrl()); // Lưu URL từ Cloudinary
                imageProduct.setCreateDate(new Date()); // Thiết lập ngày tạo
                product.getImageProducts().add(imageProduct); // Thêm vào danh sách hình ảnh của sản phẩm
            }

            // Lấy ID người dùng từ JWT
            int idUser = getUserIdFromToken();

            // Tạo và lưu HouseHoldProduct
            HouseHoldProduct houseHoldProduct = new HouseHoldProduct();
            houseHoldProduct.setProduct(product);
            houseHoldProduct.setUser(userRepository.findById((long) idUser).orElse(null));
            houseHoldProduct.setPrice((int) productRequest.getPrice());
            houseHoldProduct.setCreateDate(new Date());
            houseHoldProductRepository.save(houseHoldProduct);

            // Gọi phương thức cập nhật PriceMonitoring
            updatePriceMonitoring(productRequest, subcategory);

            return true;
        } catch (RuntimeException e) {
            // Ghi lại ngoại lệ chi tiết
            e.printStackTrace(); // In ra thông tin chi tiết ra console
            throw new FuncErrorException("Failed to add product: " + e.getMessage());
        }
    }

    private void updatePriceMonitoring(ProductRequest productRequest, Subcategory subcategory) {
        PriceMonitoring priceMonitoring = priceMonitoringRepository.findBySubcategory(subcategory);
        double newPrice = productRequest.getPrice();

        if (priceMonitoring == null) {
            // Nếu chưa có bản ghi nào, tạo mới
            priceMonitoring = new PriceMonitoring();
            priceMonitoring.setSubcategory(subcategory);
            priceMonitoring.setMaxPrice(newPrice);
            priceMonitoring.setMinPrice(newPrice);
            priceMonitoring.setCreateDate(new Date());
            priceMonitoringRepository.save(priceMonitoring);
        } else {
            // Nếu đã có, cập nhật max và min
            if (newPrice > priceMonitoring.getMaxPrice()) {
                priceMonitoring.setMaxPrice(newPrice);
            }
            if (newPrice < priceMonitoring.getMinPrice()) {
                priceMonitoring.setMinPrice(newPrice);
            }
            priceMonitoring.setUpdateDate(new Date());
            priceMonitoringRepository.save(priceMonitoring);
        }

        // Cập nhật lại min và max cho lần tiếp theo
        double newAveragePrice = houseHoldProductRepository.findByProductSubcategory(subcategory).stream()
                .mapToDouble(HouseHoldProduct::getPrice)
                .average()
                .orElse(0.0);

        priceMonitoring.setMinPrice(newAveragePrice * 0.85);
        priceMonitoring.setMaxPrice(newAveragePrice * 1.15);
        priceMonitoringRepository.save(priceMonitoring);
    }

    private int getUserIdFromToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return Math.toIntExact(user.getId()); // Trả về ID của người dùng
            }
        }
        throw new RuntimeException("Could not retrieve user ID from token");
    }

    @Override
    public boolean updateProduct(int idProduct, ProductRequest productRequest) {
        try {
            // Kiểm tra xem sản phẩm có tồn tại không
            Product existingProduct = productRepository.findById(idProduct).orElse(null);
            if (existingProduct == null) {
                return false; // Sản phẩm không tồn tại
            }

            // Cập nhật thông tin sản phẩm
            existingProduct.setName(productRequest.getProductName());
            existingProduct.setQualityCheck(productRequest.getQualityCheck());
            existingProduct.setDescription(productRequest.getProductDescription());
            existingProduct.setExpirationDate(productRequest.getExpirationDate());
            existingProduct.setUpdatedAt(new Date());
            existingProduct.setQuantity(productRequest.getQuantity());
            existingProduct.setSubcategory(subcategoryRepository.findById(productRequest.getIdSubcategory()).orElse(null)); // Cập nhật ID subcategory

            // Cập nhật địa chỉ cho sản phẩm
            Address address = new Address();
            address.setSpecificAddress(productRequest.getSpecificAddress());
            address.setWard(productRequest.getWard());
            address.setDistrict(productRequest.getDistrict());
            address.setCity(productRequest.getCity());
            address.setCreateDate(new Date());

            // Lưu hoặc cập nhật địa chỉ
            Address existingAddress = existingProduct.getAddress();
            if (existingAddress != null) {
                existingAddress.setSpecificAddress(address.getSpecificAddress());
                existingAddress.setWard(address.getWard());
                existingAddress.setDistrict(address.getDistrict());
                existingAddress.setCity(address.getCity());
                addressRepository.save(existingAddress); // Cập nhật địa chỉ đã tồn tại
            } else {
                addressRepository.save(address); // Lưu địa chỉ mới
                existingProduct.setAddress(address); // Gán địa chỉ mới cho sản phẩm
            }

            // Cập nhật các hình ảnh


            // Cập nhật giá sản phẩm từ HouseHoldProduct
            HouseHoldProduct existingHouseHoldProduct = houseHoldProductRepository.findByProductId(existingProduct.getId());
            if (existingHouseHoldProduct != null) {
                // Tính toán giá trung bình từ các HouseHoldProduct thuộc cùng subcategory
                List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByProductSubcategory(existingProduct.getSubcategory());
                double averagePrice = houseHoldProducts.stream()
                        .mapToDouble(HouseHoldProduct::getPrice)
                        .average()
                        .orElse(0.0);

                // Khai báo giá tối thiểu và tối đa
                double minPrice = averagePrice * 0.85;
                double maxPrice = averagePrice * 1.15;

                // Kiểm tra giá người dùng nhập vào
                double userPrice = productRequest.getPrice();
                if (userPrice < minPrice || userPrice > maxPrice) {
                    throw new RuntimeException(String.format("Price must be within %d and %d", (int) minPrice, (int) maxPrice));
                }

                // Cập nhật giá và ngày tạo
                existingHouseHoldProduct.setPrice((int) productRequest.getPrice());
                existingHouseHoldProduct.setCreateDate(new Date()); // Cập nhật ngày mới
                houseHoldProductRepository.save(existingHouseHoldProduct);

                // Cập nhật PriceMonitoring
                updatePriceMonitoring(existingProduct.getSubcategory(), userPrice);
            }

            if (productRequest.getProductImage() != null && productRequest.getProductImage().length > 0) {
                // Lấy danh sách các hình ảnh cũ liên quan đến sản phẩm
                List<ImageProduct> oldImages = imageProductRepository.findByProductId(existingProduct.getId());

                // Xóa các hình ảnh cũ từ cơ sở dữ liệu và thư mục
                for (ImageProduct oldImage : oldImages) {
                    // Xóa file ảnh cũ khỏi thư mục
                    // Xóa khỏi Cloudinary
                    cloudinaryService.deleteFile(oldImage.getCloudinaryImageId()); // Thêm vào phương thức xóa trong CloudinaryService

                    // Xóa bản ghi trong cơ sở dữ liệu
                    imageProductRepository.delete(oldImage);
                }

                // Thêm các hình ảnh mới
                for (MultipartFile productImage : productRequest.getProductImage()) {
                    // Upload hình ảnh lên Cloudinary
                    String fileName = FileUploadUtil.getFileName(productImage.getOriginalFilename());
                    CloudinaryResponse response = cloudinaryService.uploadFile(productImage, fileName);

                    // Tạo đối tượng ImageProduct mới
                    ImageProduct newImageProduct = new ImageProduct();
                    newImageProduct.setProduct(existingProduct);
                    newImageProduct.setCloudinaryImageId(response.getPublicId());
                    newImageProduct.setImageUrl(response.getUrl());
                    newImageProduct.setCreateDate(new Date());

                    existingProduct.getImageProducts().add(newImageProduct);
                }
            }

            // Lưu thay đổi sản phẩm
            productRepository.save(existingProduct);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            throw new FuncErrorException("Failed to update product: " + e.getMessage());
        }
    }

    private void updatePriceMonitoring(Subcategory subcategory, double newPrice) {
        PriceMonitoring priceMonitoring = priceMonitoringRepository.findBySubcategory(subcategory);

        if (priceMonitoring == null) {
            // Nếu chưa có bản ghi nào, tạo mới
            priceMonitoring = new PriceMonitoring();
            priceMonitoring.setSubcategory(subcategory);
            priceMonitoring.setMaxPrice(newPrice);
            priceMonitoring.setMinPrice(newPrice);
            priceMonitoring.setCreateDate(new Date());
            priceMonitoringRepository.save(priceMonitoring);
        } else {
            // Nếu đã có, cập nhật max và min
            if (newPrice > priceMonitoring.getMaxPrice()) {
                priceMonitoring.setMaxPrice(newPrice);
            }
            if (newPrice < priceMonitoring.getMinPrice()) {
                priceMonitoring.setMinPrice(newPrice);
            }
            priceMonitoring.setUpdateDate(new Date());
            priceMonitoringRepository.save(priceMonitoring);
        }

        // Cập nhật lại min và max cho lần tiếp theo
        double newAveragePrice = houseHoldProductRepository.findByProductSubcategory(subcategory).stream()
                .mapToDouble(HouseHoldProduct::getPrice)
                .average()
                .orElse(0.0);

        priceMonitoring.setMinPrice(newAveragePrice * 0.85);
        priceMonitoring.setMaxPrice(newAveragePrice * 1.15);
        priceMonitoringRepository.save(priceMonitoring);
    }

    @Override
    @Transactional
    public boolean deleteProductById(int idProduct) {
        // Kiểm tra xem sản phẩm có tồn tại không
        if (productRepository.existsById((int) idProduct)) {
            // Xóa tất cả các hình ảnh liên quan đến sản phẩm
            List<ImageProduct> images = imageProductRepository.findByProductId((long) idProduct);
            imageProductRepository.deleteAll(images);

            // Xóa bản ghi trong HouseHoldProduct
            houseHoldProductRepository.deleteByProductId(idProduct);

            // Xóa sản phẩm
            productRepository.deleteById((int) idProduct);
            return true;
        }
        return false;
    }

    @Override
    public List<ProductResponse> getAllProduct() {
        List<Product> products = productRepository.findAll(); // Lấy danh sách sản phẩm từ repository
        List<ProductResponse> productResponses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = new ProductResponse();

            // Set các thuộc tính cho ProductResponse
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());
            response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
            response.setQualityCheck(product.getQualityCheck());
            response.setCreateDate(product.getCreatedAt());
            response.setUpdateDate(product.getUpdatedAt());

            // Lấy subcategory name
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá và tên hộ gia đình từ HouseHoldProduct
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
                response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));
            }

            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            if (product.getAddress() != null) {
                response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
            }

            productResponses.add(response);
        }
        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductById(int idProduct) {
        // Lấy sản phẩm từ repository
        Product product = productRepository.findById((int) idProduct).orElse(null);
        List<ProductResponse> productResponses = new ArrayList<>();

        if (product != null) {
            ProductResponse response = new ProductResponse();

            // Set các thuộc tính của sản phẩm
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());
            response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
            response.setQualityCheck(product.getQualityCheck());
            response.setCreateDate(product.getCreatedAt());
            response.setUpdateDate(product.getUpdatedAt());

            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá và tên hộ gia đình từ HouseHoldProduct
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
                response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));// Lấy tên từ user
            }

            // Lấy danh sách hình ảnh
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            // Thêm địa chỉ vào response
            if (product.getAddress() != null) {
                response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
            }

            // Thêm response vào danh sách
            productResponses.add(response);
        }

        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductBySubcategory(int idSubcategory) {
        List<Product> products = productRepository.findBySubcategoryId(idSubcategory);
        List<ProductResponse> productResponses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = new ProductResponse();

            // Thiết lập thông tin cho ProductResponse
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());

            // Xác định trạng thái dựa vào số lượng
            response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");

            // Thiết lập ngày hết hạn nếu có
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);

            // Chất lượng kiểm tra
            response.setQualityCheck(product.getQualityCheck());
            response.setCreateDate(product.getCreatedAt());
            response.setUpdateDate(product.getUpdatedAt());


            // Lấy tên danh mục phụ (Subcategory)
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá từ HouseholdProduct dựa trên id sản phẩm
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
                response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));
            }

            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            if (product.getAddress() != null) {
                response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
            }

            productResponses.add(response);
        }
        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductByName(String productName) {
        // Lấy danh sách sản phẩm theo tên chứa chuỗi productName
        List<Product> products = productRepository.findByNameContaining(productName);
        List<ProductResponse> productResponses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = new ProductResponse();

            // Set các thuộc tính của sản phẩm
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());

            // Kiểm tra số lượng để đặt status
            response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");

            // Set ngày hết hạn và kiểm tra chất lượng
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
            response.setQualityCheck(product.getQualityCheck());
            response.setCreateDate(product.getCreatedAt());
            response.setUpdateDate(product.getUpdatedAt());

            // Lấy tên subcategory
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá và tên hộ gia đình từ HouseHoldProduct
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname()); // Lấy tên từ user
                response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));
            }

            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            if (product.getAddress() != null) {
                response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
            }
            productResponses.add(response);
        }
        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductByPrice(double minPrice, double maxPrice) {
        // Lấy danh sách HouseholdProduct theo khoảng giá
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByPriceBetween(minPrice, maxPrice);
        List<ProductResponse> productResponses = new ArrayList<>();

        for (HouseHoldProduct houseHoldProduct : houseHoldProducts) {
            Product product = houseHoldProduct.getProduct();
            ProductResponse response = new ProductResponse();

            // Set các thuộc tính của sản phẩm
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());
            response.setCreateDate(product.getCreatedAt());
            response.setUpdateDate(product.getUpdatedAt());

            // Kiểm tra số lượng để đặt status
            response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");

            // Set ngày hết hạn và kiểm tra chất lượng
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
            response.setQualityCheck(product.getQualityCheck());

            // Lấy tên subcategory
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Đặt giá từ HouseholdProduct
            response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
            response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
            response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));

            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            if (product.getAddress() != null) {
                response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
            }
            productResponses.add(response);
        }
        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductByHouseHold(int idHouseHold) {
        // Truy vấn các sản phẩm của hộ gia đình theo idHouseHold
        List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByUserId(idHouseHold);
        List<ProductResponse> productResponses = new ArrayList<>();

        // Duyệt qua danh sách các sản phẩm và chuyển thành ProductResponse
        for (HouseHoldProduct houseHoldProduct : houseHoldProducts) {
            Product product = houseHoldProduct.getProduct();
            ProductResponse response = new ProductResponse();

            // Thiết lập thông tin cho ProductResponse
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());

            // Xác định trạng thái dựa vào số lượng
            response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");

            // Thiết lập ngày hết hạn
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);

            // Chất lượng kiểm tra
            response.setQualityCheck(product.getQualityCheck());
            response.setCreateDate(product.getCreatedAt());
            response.setUpdateDate(product.getUpdatedAt());

            // Lấy tên danh mục phụ (Subcategory)
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Giá của sản phẩm từ HouseHoldProduct
            response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));

            // Tên của hộ gia đình
            response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
            response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));

            // Lấy danh sách các đường dẫn hình ảnh từ ImageProduct
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            if (product.getAddress() != null) {
                response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
            }
            productResponses.add(response);
        }
        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductByAddress(String cityProduct, String districtProduct, String wardProduct, String specificAddressProduct) {
        List<ProductResponse> productResponses = new ArrayList<>();

        List<Product> products = productRepository.findAll(); // Lấy tất cả sản phẩm từ repository

        for (Product product : products) {
            boolean matches = true;

            if (cityProduct != null && !cityProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getCity().equalsIgnoreCase(cityProduct)) {
                    matches = false;
                }
            }

            if (matches && districtProduct != null && !districtProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getDistrict().equalsIgnoreCase(districtProduct)) {
                    matches = false;
                }
            }

            if (matches && wardProduct != null && !wardProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getWard().equalsIgnoreCase(wardProduct)) {
                    matches = false;
                }
            }

            if (matches && specificAddressProduct != null && !specificAddressProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getSpecificAddress().equalsIgnoreCase(specificAddressProduct)) {
                    matches = false;
                }
            }

            if (matches) {
                ProductResponse response = new ProductResponse();
                response.setIdProduct(String.valueOf(product.getId()));
                response.setNameProduct(product.getName());
                response.setDescriptionProduct(product.getDescription());
                response.setQuantityProduct(product.getQuantity());
                response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");
                response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
                response.setQualityCheck(product.getQualityCheck());
                response.setCreateDate(product.getCreatedAt());
                response.setUpdateDate(product.getUpdatedAt());

                // Lấy subcategory name
                if (product.getSubcategory() != null) {
                    response.setNameSubcategory(product.getSubcategory().getName());
                }

                // Lấy giá và tên hộ gia đình từ HouseHoldProduct
                HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
                if (houseHoldProduct != null) {
                    response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                    response.setNameHouseHold(houseHoldProduct.getUser().getFullname()); // Lấy tên từ user
                    response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));
                }

                // Lấy danh sách hình ảnh
                List<String> imageUrls = product.getImageProducts().stream()
                        .map(ImageProduct::getImageUrl)
                        .collect(Collectors.toList());
                response.setImageProducts(imageUrls);

                // Thêm địa chỉ vào response
                if (product.getAddress() != null) {
                    response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                    response.setWardProduct(product.getAddress().getWard());
                    response.setDistrictProduct(product.getAddress().getDistrict());
                    response.setCityProduct(product.getAddress().getCity());
                }
                productResponses.add(response);
            }
        }
        return productResponses;
    }

    @Override
    @Transactional
    public void uploadImage(final Integer id, final MultipartFile file) {
        final Product product = this.productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        // Check if the file is allowed
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

        // Generate the file name and upload the file
        final String fileName = FileUploadUtil.getFileName(file.getOriginalFilename());
        final CloudinaryResponse response = this.cloudinaryService.uploadFile(file, fileName);

        // Create a new ImageProduct object and set its properties
        ImageProduct imageProduct = new ImageProduct();
        imageProduct.setCloudinaryImageId(response.getPublicId());
        imageProduct.setImageUrl(response.getUrl());
        imageProduct.setCreateDate(new Date()); // Set the creation date

        product.getImageProducts().add(imageProduct);

        imageProduct.setProduct(product);

        this.productRepository.save(product);
    }

    @Override
    public List<ProductResponse> getProductsBySubcategoryAndPriceRange(int idSubcategory, double minPrice, double maxPrice) {
        // Fetch products belonging to the specified subcategory
        List<Product> products = productRepository.findBySubcategoryId(idSubcategory);

        List<ProductResponse> productResponses = new ArrayList<>();

        // Iterate through each product and filter by household price range
        for (Product product : products) {
            // Retrieve all HouseholdProducts related to the current product
            List<HouseHoldProduct> houseHoldProducts = houseHoldProductRepository.findByProduct(product);

            // Check if there are any HouseHoldProducts for this product
            if (houseHoldProducts != null && !houseHoldProducts.isEmpty()) {
                for (HouseHoldProduct houseHoldProduct : houseHoldProducts) {
                    double price = houseHoldProduct.getPrice();

                    // Check if the price is within the specified range
                    if (price >= minPrice && price <= maxPrice) {
                        ProductResponse response = new ProductResponse();

                        // Set product details
                        response.setIdProduct(String.valueOf(product.getId()));
                        response.setNameProduct(product.getName());
                        response.setDescriptionProduct(product.getDescription());
                        response.setQuantityProduct(product.getQuantity());
                        response.setCreateDate(product.getCreatedAt());
                        response.setUpdateDate(product.getUpdatedAt());

                        // Set status based on quantity
                        response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");

                        // Set expiration date and quality check
                        response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
                        response.setQualityCheck(product.getQualityCheck());

                        // Set subcategory name
                        if (product.getSubcategory() != null) {
                            response.setNameSubcategory(product.getSubcategory().getName());
                        }

                        // Set price and householder info
                        response.setPriceProduct(String.valueOf(price)); // Set price from HouseholdProduct
                        response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
                        response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));

                        // Set image URLs
                        List<String> imageUrls = product.getImageProducts().stream()
                                .map(ImageProduct::getImageUrl)
                                .collect(Collectors.toList());
                        response.setImageProducts(imageUrls);

                        // Set address details
                        if (product.getAddress() != null) {
                            response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                            response.setWardProduct(product.getAddress().getWard() != null ? product.getAddress().getWard() : null);
                            response.setDistrictProduct(product.getAddress().getDistrict() != null ? product.getAddress().getDistrict() : null);
                            response.setCityProduct(product.getAddress().getCity() != null ? product.getAddress().getCity() : null);
                        }

                        // Add to the response list
                        productResponses.add(response);
                    }
                }
            }
        }

        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductsBySubcategoryAndAddress(int idSubcategory, String cityProduct, String districtProduct, String wardProduct, String specificAddressProduct) {
        List<ProductResponse> productResponses = new ArrayList<>();

        // Lấy tất cả sản phẩm thuộc danh mục phụ
        List<Product> products = productRepository.findBySubcategoryId(idSubcategory); // Phương thức này cần có trong repository

        for (Product product : products) {
            boolean matches = true;

            // Kiểm tra từng điều kiện địa chỉ
            if (cityProduct != null && !cityProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getCity().equalsIgnoreCase(cityProduct)) {
                    matches = false;
                }
            }

            if (matches && districtProduct != null && !districtProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getDistrict().equalsIgnoreCase(districtProduct)) {
                    matches = false;
                }
            }

            if (matches && wardProduct != null && !wardProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getWard().equalsIgnoreCase(wardProduct)) {
                    matches = false;
                }
            }

            if (matches && specificAddressProduct != null && !specificAddressProduct.isEmpty()) {
                if (product.getAddress() == null || !product.getAddress().getSpecificAddress().equalsIgnoreCase(specificAddressProduct)) {
                    matches = false;
                }
            }

            // Nếu sản phẩm phù hợp với tất cả điều kiện
            if (matches) {
                ProductResponse response = new ProductResponse();
                response.setIdProduct(String.valueOf(product.getId()));
                response.setNameProduct(product.getName());
                response.setDescriptionProduct(product.getDescription());
                response.setQuantityProduct(product.getQuantity());
                response.setStatusProduct(product.getQuantity() > 0 ? "Còn hàng" : "Hết hàng");
                response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
                response.setQualityCheck(product.getQualityCheck());
                response.setCreateDate(product.getCreatedAt());
                response.setUpdateDate(product.getUpdatedAt());

                // Lấy tên danh mục phụ
                if (product.getSubcategory() != null) {
                    response.setNameSubcategory(product.getSubcategory().getName());
                }

                // Lấy giá và tên hộ gia đình từ HouseHoldProduct
                HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
                if (houseHoldProduct != null) {
                    response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                    response.setNameHouseHold(houseHoldProduct.getUser().getFullname()); // Lấy tên từ user
                    response.setIdHouseHold(Math.toIntExact(houseHoldProduct.getUser().getId()));
                }

                // Lấy danh sách hình ảnh
                List<String> imageUrls = product.getImageProducts().stream()
                        .map(ImageProduct::getImageUrl)
                        .collect(Collectors.toList());
                response.setImageProducts(imageUrls);

                // Thêm địa chỉ vào response
                if (product.getAddress() != null) {
                    response.setSpecificAddressProduct(product.getAddress().getSpecificAddress());
                    response.setWardProduct(product.getAddress().getWard());
                    response.setDistrictProduct(product.getAddress().getDistrict());
                    response.setCityProduct(product.getAddress().getCity());
                }
                productResponses.add(response);
            }
        }
        return productResponses;
    }

}
