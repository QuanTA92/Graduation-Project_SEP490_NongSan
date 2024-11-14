package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.domain.ForgotPasswordToken;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.VerificationType;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.VerificationCode;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ForgotPasswordTokenRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.ResetPasswordRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.UserRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.ApiResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.AuthResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.UserResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.service.imp.EmailService;
import com.fpt.Graduation_Project_SEP490_NongSan.service.ForgotPasswordService;
import com.fpt.Graduation_Project_SEP490_NongSan.service.UserService;
import com.fpt.Graduation_Project_SEP490_NongSan.service.VerificationCodeService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;
    private String jwt;

    @GetMapping("/api/users/profile")
    public ResponseEntity<UserResponse> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {

        // Lấy thông tin người dùng từ JWT và trả về dưới dạng UserResponse
        UserResponse userResponse = userService.findUsersProfileByJWT(jwt);

        // Trả về đối tượng UserResponse với mã phản hồi OK (200)
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    // goi otp de cai dat xac thuc khi dang nhap
    @PostMapping("/api/users/verification/{verificationType}/send-otp")
    public ResponseEntity<String> sendVerificationOtp(
            @RequestHeader("Authorization") String jwt,
            @PathVariable VerificationType verificationType) throws Exception {

        User user = userService.findUserProfileByJWT(jwt);

        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        if (verificationCode == null) {
            verificationCode = verificationCodeService.sendVerificationCode(user, verificationType);
        }

        if (verificationType.equals(VerificationType.EMAIL)) {
            emailService.sendVerificationOtpEmail(user.getEmail(), verificationCode.getOtp());
        }

        return new ResponseEntity<>("Verification otp sent successfully", HttpStatus.OK);
    }

    // nhap otp de xac thuc 2 khi dang nhap
    @PatchMapping("/api/users/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<ApiResponse> enableTwoFactorAuthentication(
            @PathVariable String otp,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // Tìm thông tin người dùng từ JWT
        User user = userService.findUserProfileByJWT(jwt);

        // Lấy mã xác thực của người dùng
        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());

        // Lấy số điện thoại hoặc email để gửi OTP
        String sendTo = verificationCode.getVerificationType().equals(VerificationType.EMAIL) ?
                verificationCode.getEmail() : verificationCode.getMobile();

        // Kiểm tra OTP có chính xác không
        boolean isVerified = verificationCode.getOtp().equals(otp);
        if (isVerified) {
            // Kích hoạt 2FA cho người dùng
            userService.enableTwoFactorAuthentication(verificationCode.getVerificationType(), sendTo, user);

            // Xóa mã xác thực sau khi thành công
            verificationCodeService.deleteVerificationCodeById(verificationCode);

            // Tạo đối tượng ApiResponse với thông báo thành công
            ApiResponse response = new ApiResponse();
            response.setMessage("Two-factor authentication enabled successfully");

            // Trả về phản hồi với mã trạng thái OK
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        // Nếu OTP sai, ném ngoại lệ
        throw new Exception("Wrong OTP");
    }

    // goi otp de resetPassword
    @PostMapping("/auth/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) throws Exception {

        User user = userService.findUserByEmail(req.getSendTo());

        String otp = OtpUtils.generateOTP();
        UUID uuid = UUID.randomUUID();
        String id = uuid.toString();

        ForgotPasswordToken token = forgotPasswordService.findByUser(user.getId());

        if (token == null) {
            token = forgotPasswordService.createToken(user, id, otp, req.getVerificationType(), req.getSendTo());
        }

        if (req.getVerificationType().equals(VerificationType.EMAIL)){
            emailService.sendVerificationOtpEmail(user.getEmail(), token.getOtp());
        }

        AuthResponse response = new AuthResponse();
        response.setSeesion(token.getId());
        response.setMessage("Password reset otp sent successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // resetPassword
    @PatchMapping("/auth/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String id,
            @RequestBody ResetPasswordRequest req
//            ,@RequestHeader("Authorization") String jwt
    ) throws Exception {

        ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findById(id);

        boolean isVerified = forgotPasswordToken.getOtp().equals(req.getOtp());

        if (isVerified) {
            userService.updatePassword(forgotPasswordToken.getUser(), req.getPassword());

            ApiResponse res = new ApiResponse();
            res.setMessage("Password update successfully");
            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }
        throw new Exception("Wrong otp");
    }

    @PostMapping("/api/users/update")
    public ResponseEntity<String> updateUser(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserRequest userRequest) {

        boolean isUpdated = userService.updateUser(jwt, userRequest);

        if (isUpdated) {
            return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to update user", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/api/users/get/all")
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestHeader("Authorization") String jwt) {
        try {
            List<UserResponse> users = userService.getAllUsers(jwt);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get details of a specific user by email
    @GetMapping("/api/users/get/details")
    public ResponseEntity<UserResponse> getUserDetails(@RequestHeader("Authorization") String jwt, @RequestParam String email) {
        try {
            List<UserResponse> userDetails = userService.getDetailsUsers(jwt, email);
            if (userDetails.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(userDetails.get(0), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
