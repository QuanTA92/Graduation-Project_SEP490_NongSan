package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ProductRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ProductResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.*;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
    private CategoriesRepository categoriesRepository;

    @Autowired
    private HouseHoldProductRepository houseHoldProductRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Value("${root.folder}")
    private String rootFolder;

    @Autowired
    private ImageProductRepository imageProductRepository;

    @Override
    public boolean addProduct(ProductRequest productRequest) {
        try {
            // Tạo sản phẩm mới
            Product product = new Product();
            product.setName(productRequest.getProductName());
            product.setQualityCheck(productRequest.getQualityCheck());
            product.setDescription(productRequest.getProductDescription());
            product.setExpirationDate(productRequest.getExpirationDate());
            product.setCreatedAt(new Date());
            product.setQuantity(productRequest.getQuantity());
            product.setSubcategory(subcategoryRepository.findById(productRequest.getIdSubcategory()).orElse(null)); // Cập nhật ID subcategory
            productRepository.save(product);

            // Lấy ID của sản phẩm đã lưu
            Long productId = product.getId();

            // Lưu hình ảnh vào thư mục
            for (MultipartFile productImage : productRequest.getProductImage()) {
                String imagePath = rootFolder + File.separator + productImage.getOriginalFilename();
                productImage.transferTo(new File(imagePath));

                // Tạo đối tượng ImageProduct và lưu vào cơ sở dữ liệu
                ImageProduct imageProduct = new ImageProduct();
                imageProduct.setProduct(product);
                imageProduct.setUrlImage(imagePath); // Đường dẫn hình ảnh
                imageProduct.setCreateDate(new Date());
                product.getImageProducts().add(imageProduct); // Giả sử bạn đã thiết lập mối quan hệ trong Product
            }

            // Lấy ID người dùng từ JWT
            int idUser = getUserIdFromToken();

            // Tạo và lưu HouseHoldProduct
            HouseHoldProduct houseHoldProduct = new HouseHoldProduct();
            houseHoldProduct.setProduct(product);
            houseHoldProduct.setUser(userRepository.findById((long) idUser).orElse(null)); // Lấy user từ repository
            houseHoldProduct.setPrice(productRequest.getPrice());
            houseHoldProduct.setCreateDate(new Date());
            houseHoldProductRepository.save(houseHoldProduct);

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
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

            // Cập nhật các hình ảnh
            if (productRequest.getProductImage() != null && productRequest.getProductImage().length > 0) {
                // Lấy danh sách các hình ảnh cũ liên quan đến sản phẩm
                List<ImageProduct> oldImages = imageProductRepository.findByProductId(existingProduct.getId());

                // Xóa các hình ảnh cũ từ cơ sở dữ liệu và thư mục
                for (ImageProduct oldImage : oldImages) {
                    // Xóa file ảnh cũ khỏi thư mục
                    File oldImageFile = new File(oldImage.getUrlImage());
                    if (oldImageFile.exists()) {
                        boolean isDeleted = oldImageFile.delete(); // Xóa file
                        if (!isDeleted) {
                            System.out.println("Cannot delete image: " + oldImage.getUrlImage());
                        }
                    }
                }

                // Xóa các bản ghi trong database
                imageProductRepository.deleteAll(oldImages);

                // Thêm các hình ảnh mới
                for (MultipartFile productImage : productRequest.getProductImage()) {
                    String imagePath = rootFolder + File.separator + productImage.getOriginalFilename();
                    productImage.transferTo(new File(imagePath));

                    // Tạo đối tượng ImageProduct mới
                    ImageProduct newImageProduct = new ImageProduct();
                    newImageProduct.setProduct(existingProduct);
                    newImageProduct.setUrlImage(imagePath);
                    newImageProduct.setCreateDate(new Date());

                    existingProduct.getImageProducts().add(newImageProduct);
                }
            }

            // Cập nhật giá sản phẩm từ HouseHoldProduct
            HouseHoldProduct existingHouseHoldProduct = houseHoldProductRepository.findByProductId(existingProduct.getId());
            if (existingHouseHoldProduct != null) {
                existingHouseHoldProduct.setPrice(productRequest.getPrice());
                existingHouseHoldProduct.setCreateDate(new Date()); // Cập nhật ngày mới
                houseHoldProductRepository.save(existingHouseHoldProduct);
            }

            // Lưu thay đổi sản phẩm
            productRepository.save(existingProduct);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
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

            // Lấy subcategory name
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá và tên hộ gia đình từ HouseHoldProduct
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname()); // Lấy tên từ user
            }

            // Lấy danh sách hình ảnh
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getUrlImage)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            // Thêm response vào danh sách
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

            // Lấy tên subcategory
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá và tên hộ gia đình từ HouseHoldProduct
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname()); // Lấy tên từ user
            }

            // Lấy danh sách hình ảnh
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getUrlImage)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            // Thêm response vào danh sách
            productResponses.add(response);
        }

        return productResponses;
    }

    @Override
    public List<ProductResponse> getProductBySubcategory(int idSubcategory) {
        // Lấy danh sách sản phẩm theo id danh mục phụ
        List<Product> products = productRepository.findBySubcategoryId(idSubcategory);
        List<ProductResponse> productResponses = new ArrayList<>();

        // Duyệt qua danh sách sản phẩm và chuyển thành ProductResponse
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

            // Lấy tên danh mục phụ (Subcategory)
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá từ HouseholdProduct dựa trên id sản phẩm
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname());
            }

            // Lấy danh sách hình ảnh từ ImageProduct
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getUrlImage)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            productResponses.add(response);
        }

        // Trả về danh sách các ProductResponse
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

            // Lấy tên subcategory
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Lấy giá và tên hộ gia đình từ HouseHoldProduct
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getUser().getFullname()); // Lấy tên từ user
            }

            // Lấy danh sách hình ảnh
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getUrlImage)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

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

            // Lấy danh sách hình ảnh
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getUrlImage)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

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

            // Lấy tên danh mục phụ (Subcategory)
            if (product.getSubcategory() != null) {
                response.setNameSubcategory(product.getSubcategory().getName());
            }

            // Giá của sản phẩm từ HouseHoldProduct
            response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));

            // Tên của hộ gia đình
            response.setNameHouseHold(houseHoldProduct.getUser().getFullname());

            // Lấy danh sách các đường dẫn hình ảnh từ ImageProduct
            List<String> imageUrls = product.getImageProducts().stream()
                    .map(ImageProduct::getUrlImage)
                    .collect(Collectors.toList());
            response.setImageProducts(imageUrls);

            productResponses.add(response);
        }

        // Trả về danh sách các ProductResponse
        return productResponses;
    }




}
