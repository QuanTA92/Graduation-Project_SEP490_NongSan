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
    private HouseHoldRoleRepository houseHoldRoleRepository;

    @Autowired
    private HouseHoldProductRepository houseHoldProductRepository;

    @Autowired
    private UserRepository userRepository;

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
            product.setStatus(productRequest.getStatus());
            product.setCreatedAt(new Date());
//            product.setUpdatedAt(new Date());
            product.setQuantity(productRequest.getQuantity());
            product.setCategories(categoriesRepository.findById(productRequest.getIdCategories()).orElse(null));
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
                // Lưu vào cơ sở dữ liệu
                product.getImageProducts().add(imageProduct); // Giả sử bạn đã thiết lập mối quan hệ trong Product
            }

            // Lấy ID hộ gia đình từ JWT
            int idHouseHold = getHouseHoldIdFromToken();

            // Tạo và lưu HouseholdProduct
            HouseHoldProduct houseHoldProduct = new HouseHoldProduct();
            houseHoldProduct.setProduct(product);
            houseHoldProduct.setHouseHoldRole(houseHoldRoleRepository.findById(idHouseHold).orElse(null));
            houseHoldProduct.setPrice(productRequest.getPrice());
            houseHoldProduct.setCreateDate(new Date());
            houseHoldProductRepository.save(houseHoldProduct);

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    private int getHouseHoldIdFromToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            String email = auth.getName();
            User user = userRepository.findByEmail(email);
            if (user != null && user.getHouseHoldRole() != null) {
                return user.getHouseHoldRole().getId(); // Trả về ID của hộ gia đình
            }
        }
        throw new RuntimeException("Could not retrieve household ID from token");
    }

    @Override
    public List<ProductResponse> getAllProduct() {
        List<Product> products = productRepository.findAll(); // Lấy danh sách sản phẩm từ repository
        List<ProductResponse> productResponses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = new ProductResponse();
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());
            response.setStatusProduct(product.getStatus());
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
            response.setQualityCheck(product.getQualityCheck());

            // Lấy tên danh mục
            response.setNameCategories(product.getCategories() != null ? product.getCategories().getName() : null);

            // Lấy giá từ HouseHoldProduct dựa trên id sản phẩm
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(String.valueOf(houseHoldProduct.getHouseHoldRole().getFullname()));
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
    @Transactional
    public boolean deleteProductById(int idProduct) {
        // Kiểm tra xem sản phẩm có tồn tại không
        if (productRepository.existsById((int) idProduct)) {
            // Xóa tất cả các hình ảnh liên quan đến sản phẩm
            List<ImageProduct> images = imageProductRepository.findByProductId((long) idProduct);
            imageProductRepository.deleteAll(images);

            // Xóa bản ghi trong HouseHoldProduct
            houseHoldProductRepository.deleteByProductId((long) idProduct);

            // Xóa sản phẩm
            productRepository.deleteById((int) idProduct);
            return true;
        }
        return false;
    }

    @Override
    public List<ProductResponse> getProductById(int idProduct) {
        Product product = productRepository.findById((int) idProduct).orElse(null);
        List<ProductResponse> productResponses = new ArrayList<>();

        if (product != null) {
            ProductResponse response = new ProductResponse();
            response.setIdProduct(String.valueOf(product.getId()));
            response.setNameProduct(product.getName());
            response.setDescriptionProduct(product.getDescription());
            response.setQuantityProduct(product.getQuantity());
            response.setStatusProduct(product.getStatus());
            response.setExpirationDate(product.getExpirationDate() != null ? product.getExpirationDate().toString() : null);
            response.setQualityCheck(product.getQualityCheck());

            // Lấy tên danh mục
            response.setNameCategories(product.getCategories() != null ? product.getCategories().getName() : null);

            // Lấy giá từ HouseHoldProduct dựa trên id sản phẩm
            HouseHoldProduct houseHoldProduct = houseHoldProductRepository.findByProductId(product.getId());
            if (houseHoldProduct != null) {
                response.setPriceProduct(String.valueOf(houseHoldProduct.getPrice()));
                response.setNameHouseHold(houseHoldProduct.getHouseHoldRole().getFullname());
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
            existingProduct.setStatus(productRequest.getStatus());
            existingProduct.setUpdatedAt(new Date());
            existingProduct.setQuantity(productRequest.getQuantity());
            existingProduct.setCategories(categoriesRepository.findById(productRequest.getIdCategories()).orElse(null));

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
//                existingHouseHoldProduct.setCreateDate(new Date()); // Cập nhật ngày mới
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

}

