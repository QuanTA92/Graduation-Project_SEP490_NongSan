package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.config.JwtProvider;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.request.AuthRequest;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.AuthResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.service.imp.CustomerUserDetailsService;
import com.fpt.Graduation_Project_SEP490_NongSan.service.imp.EmailService;
import com.fpt.Graduation_Project_SEP490_NongSan.service.TwoFactorOtpService;
import com.fpt.Graduation_Project_SEP490_NongSan.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private TwoFactorOtpService twoFactorOtpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest authRequest) throws Exception {
        // Kiểm tra xem email đã tồn tại chưa
        User existingUser = userRepository.findByEmail(authRequest.getEmail());
        if (existingUser != null) {
            throw new Exception("Email Already Exists");
        }

        // Tạo người dùng mới
        User newUser = new User();
        newUser.setEmail(authRequest.getEmail());
        newUser.setPassword(authRequest.getPassword());
        newUser.setFullname(authRequest.getFullname());
        newUser.setCreateDate(new Date());

        // Lấy role từ AuthRequest và thiết lập cho người dùng mới
        Role role = new Role();
        role.setId(Integer.parseInt(authRequest.getRole())); // Chuyển đổi chuỗi thành số nguyên
        newUser.setRole(role);

        // Lưu người dùng mới vào cơ sở dữ liệu
        User savedUser = userRepository.save(newUser);

        // Xác thực và tạo JWT
        Authentication auth = new UsernamePasswordAuthenticationToken(
                newUser.getEmail(),
                newUser.getPassword()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwt = JwtProvider.generateToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Register Success");

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) throws Exception {
        String userName = authRequest.getEmail();
        String password = authRequest.getPassword();

        Authentication auth = authenticate(userName, password);

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        User authUser = userRepository.findByEmail(userName);

        if (authUser.getTwoFactorAuth() != null && authUser.getTwoFactorAuth().isEnabled()) {
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor auth is enabled");
            res.setTwoFactorAuthEnabled(true);
            String otp = OtpUtils.generateOTP();

            TwoFactorOTP oldTwoFactorOTP = twoFactorOtpService.findByUser(authUser.getId());
            if (oldTwoFactorOTP != null) {
                twoFactorOtpService.deleteTwoFactorOtp(oldTwoFactorOTP);
            }

            TwoFactorOTP newTwoFactorOTP = twoFactorOtpService.createTwoFactorOtp(authUser, otp, jwt);
            emailService.sendVerificationOtpEmail(userName, otp);

            res.setSeesion(newTwoFactorOTP.getId());

            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Login Success");

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }


    private Authentication authenticate(String userName, String password) {

        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(userName);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");

        }
        if (!password.equals(userDetails.getPassword())) {

            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @PostMapping("/two-factor/otp/{otp}")
    public ResponseEntity<AuthResponse> verifySigninOtp(
            @PathVariable String otp,
            @RequestParam String id) throws Exception {

        TwoFactorOTP twoFactorOTP = twoFactorOtpService.findById(id);

        if (twoFactorOtpService.verifyTwoFactorOtp(twoFactorOTP, otp)) {
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor authentication verify");
            res.setTwoFactorAuthEnabled(true);
            res.setJwt(twoFactorOTP.getJwt());

            return new ResponseEntity<>(res, HttpStatus.OK);
        }
        throw new Exception("Invalid otp");
    }

    @GetMapping("/role")
    public ResponseEntity<Map<String, Object>> getUserRole(@RequestHeader("Authorization") String token) {
        try {
            // Lấy email từ token
            String email = JwtProvider.getEmailFromToken(token);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
            }

            // Xác định vai trò của người dùng
            Role role = user.getRole();
            Map<String, Object> response = new HashMap<>();
            response.put("role", role.getName()); // Lấy tên vai trò từ đối tượng Role

            // Lấy ID của vai trò
            response.put("roleId", role.getId());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error processing token"), HttpStatus.BAD_REQUEST);
        }
    }


}

