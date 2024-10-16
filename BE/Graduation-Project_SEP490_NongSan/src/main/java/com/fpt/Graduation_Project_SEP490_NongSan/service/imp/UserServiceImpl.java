package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.config.JwtProvider;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.TwoFactorAuth;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.UserRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.UserResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserProfileByJWT(String jwt) throws Exception {

        String email = JwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new Exception("User not found");
        }
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new Exception("User not found");
        }

        return user;
    }

    @Override
    public User findUserById(Long userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new Exception("User not found");

        }
        return user.get();
    }

    @Override
    public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user) {
        TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

        twoFactorAuth.setEnabled(true);
        twoFactorAuth.setSendTo(verificationType);
        user.setTwoFactorAuth(twoFactorAuth);

        return userRepository.save(user);
    }


    @Override
    public User updatePassword(User user, String newPassword) {

        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    @Override
    public boolean updateUser(String jwt, UserRequest userRequest) {
        try {
            // Trích xuất email từ JWT
            String email = JwtProvider.getEmailFromToken(jwt);

            // Tìm kiếm người dùng trong cơ sở dữ liệu
            User user = userRepository.findByEmail(email);

            if (user == null) {
                throw new Exception("User not found");
            }

            // Cập nhật thông tin người dùng từ UserRequest
            user.setFullname(userRequest.getFullName());

            // Cập nhật các thông tin trong các vai trò
            if (user.getHouseHoldRole() != null) {
                user.getHouseHoldRole().setFullname(userRequest.getFullName());
                user.getHouseHoldRole().setPhone(userRequest.getPhone());

                user.getHouseHoldRole().setAddress(userRequest.getAddress());
                user.getHouseHoldRole().setDescription(userRequest.getDescription());
                user.getHouseHoldRole().setTaxId(userRequest.getTaxId());
            } else if (user.getTraderRole() != null) {
                user.getHouseHoldRole().setFullname(userRequest.getFullName());
                user.getHouseHoldRole().setPhone(userRequest.getPhone());

                user.getTraderRole().setAddress(userRequest.getAddress());
                user.getTraderRole().setDescription(userRequest.getDescription());
                user.getTraderRole().setTaxId(userRequest.getTaxId());
            } else if (user.getAdminRole() != null) {
                user.getHouseHoldRole().setFullname(userRequest.getFullName());
                user.getHouseHoldRole().setPhone(userRequest.getPhone());

                user.getAdminRole().setAddress(userRequest.getAddress());
                user.getAdminRole().setDescription(userRequest.getDescription());
                // Admin không có taxId, nhưng nếu cần, bạn có thể xử lý thêm
            }

            // Lưu người dùng đã cập nhật vào cơ sở dữ liệu
            userRepository.save(user);
            return true; // Cập nhật thành công
        } catch (Exception e) {
            // Xử lý ngoại lệ nếu có
            e.printStackTrace();
            return false; // Cập nhật không thành công
        }
    }



    @Override
    public UserResponse findUsersProfileByJWT(String jwt) throws Exception {

        // Trích xuất email từ JWT
        String email = JwtProvider.getEmailFromToken(jwt);

        // Tìm kiếm người dùng trong cơ sở dữ liệu bằng email
        User user = userRepository.findByEmail(email);

        // Nếu không tìm thấy người dùng, ném ra ngoại lệ
        if (user == null) {
            throw new Exception("User not found");
        }

        // Tạo đối tượng UserResponse để trả về thông tin cần thiết
        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFullname());

        // Kiểm tra và gán thông tin từ các vai trò tương ứng
        if (user.getHouseHoldRole() != null) {
            userResponse.setPhone(user.getHouseHoldRole().getPhone());
            userResponse.setAddress(user.getHouseHoldRole().getAddress());
            userResponse.setDescription(user.getHouseHoldRole().getDescription());
            userResponse.setTaxId(user.getHouseHoldRole().getTaxId());
        } else if (user.getTraderRole() != null) {
            userResponse.setPhone(user.getTraderRole().getPhone());
            userResponse.setAddress(user.getTraderRole().getAddress());
            userResponse.setDescription(user.getTraderRole().getDescription());
            userResponse.setTaxId(user.getTraderRole().getTaxId());
        } else if (user.getAdminRole() != null) {
            userResponse.setPhone(user.getAdminRole().getPhone());
            userResponse.setAddress(user.getAdminRole().getAddress());
            userResponse.setDescription(user.getAdminRole().getDescription());
            // Admin không có taxId, nhưng nếu cần, bạn có thể xử lý thêm
        }

        return userResponse;
    }




}
