package com.fpt.Graduation_Project_SEP490_NongSan.controller;

import com.fpt.Graduation_Project_SEP490_NongSan.config.JwtProvider;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.USER_ROLE;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.*;
import com.fpt.Graduation_Project_SEP490_NongSan.payload.response.AuthResponse;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.AdminRoleRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.HouseHoldRoleRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.TraderRoleRepository;
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

    @Autowired
    private HouseHoldRoleRepository houseHoldRoleRepository;

    @Autowired
    private TraderRoleRepository traderRoleRepository;

    @Autowired
    private AdminRoleRepository adminRoleRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) throws Exception {

        User isEmailExist = userRepository.findByEmail(user.getEmail());

        if (isEmailExist != null) {
            throw new Exception("Email Already Exists");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setFullname(user.getFullname());

        // Chuyển đổi số nguyên thành USER_ROLE enum
        USER_ROLE role = convertToUserRole(user.getRole().ordinal());
        newUser.setRole(role);

        User savedUser = userRepository.save(newUser);

        // Tạo và lưu đối tượng role tương ứng
        switch (role) {
            case ROLE_HOUSEHOLD:
                HouseHoldRole houseHoldRole = new HouseHoldRole();
                houseHoldRole.setUser(savedUser);
                houseHoldRole.setFullname(user.getFullname());
                houseHoldRole.setCreateDate(new Date());
                // Thiết lập các thuộc tính khác của houseHoldRole nếu cần
                houseHoldRoleRepository.save(houseHoldRole); // Lưu vào cơ sở dữ liệu
                break;
            case ROLE_TRADER:
                TraderRole traderRole = new TraderRole();
                traderRole.setCreateDate(new Date());
                traderRole.setUser(savedUser);
                // Thiết lập các thuộc tính khác của traderRole nếu cần
                traderRoleRepository.save(traderRole); // Lưu vào cơ sở dữ liệu
                break;
            case ROLE_ADMIN:
                AdminRole adminRole = new AdminRole();
                adminRole.setCreateDate(new Date());
                adminRole.setUser(savedUser);
                // Thiết lập các thuộc tính khác của adminRole nếu cần
                adminRoleRepository.save(adminRole); // Lưu vào cơ sở dữ liệu
                break;
        }

        Authentication auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                user.getPassword()
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Register Success");

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    // Phương thức chuyển đổi từ số nguyên thành USER_ROLE enum
    private USER_ROLE convertToUserRole(int roleId) {
        switch (roleId) {
            case 0:
                return USER_ROLE.ROLE_HOUSEHOLD;
            case 1:
                return USER_ROLE.ROLE_TRADER;
            case 2:
                return USER_ROLE.ROLE_ADMIN;
            default:
                throw new IllegalArgumentException("Invalid role id: " + roleId);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity <AuthResponse> login(@RequestBody User user) throws Exception {

        String userName = user.getEmail();
        String password = user.getPassword();

        Authentication auth = authenticate(userName, password);

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        User authUser = userRepository.findByEmail(userName);

        if (user.getTwoFactorAuth().isEnabled()){
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor auth is enabled");
            res.setTwoFactorAuthEnabled(true);
            String otp = OtpUtils.generateOTP();

            TwoFactorOTP oldTwoFactorOTP = twoFactorOtpService.findByUser(authUser.getId());
            if (oldTwoFactorOTP != null){
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

}
