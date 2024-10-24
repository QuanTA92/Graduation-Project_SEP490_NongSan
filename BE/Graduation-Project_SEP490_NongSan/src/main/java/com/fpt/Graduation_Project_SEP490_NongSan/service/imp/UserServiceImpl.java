package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.config.JwtProvider;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.TwoFactorAuth;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.UserDetails;
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

            // Cập nhật thông tin chi tiết người dùng
            if (user.getUserDetails() != null) {
                UserDetails userDetails = user.getUserDetails();
                userDetails.setPhone(userRequest.getPhone());
                userDetails.setAddress(userRequest.getAddress());
                userDetails.setDescription(userRequest.getDescription());
            } else {
                // Nếu không có UserDetails, có thể tạo mới (nếu cần)
                UserDetails newUserDetails = new UserDetails();
                newUserDetails.setPhone(userRequest.getPhone());
                newUserDetails.setAddress(userRequest.getAddress());
                newUserDetails.setDescription(userRequest.getDescription());
                newUserDetails.setUser(user); // Thiết lập quan hệ 1-1 với User
                user.setUserDetails(newUserDetails);
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
        if (user.getUserDetails() != null) { // Kiểm tra UserDetails
            userResponse.setPhone(user.getUserDetails().getPhone());
            userResponse.setAddress(user.getUserDetails().getAddress());
            userResponse.setDescription(user.getUserDetails().getDescription());
        }
        return userResponse;
    }





}
