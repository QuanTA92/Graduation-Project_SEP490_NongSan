package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.domain.USER_ROLE;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }

        List<GrantedAuthority> authorityList = new ArrayList<>();

        // Gán quyền dựa trên vai trò của người dùng
        if (user.getRole() != null) {
            // Nếu role là ROLE_HOUSEHOLD
            if (user.getRole() == USER_ROLE.ROLE_HOUSEHOLD) {
                authorityList.add(new SimpleGrantedAuthority("ROLE_HOUSEHOLD"));
            }
            // Nếu role là ROLE_TRADER
            else if (user.getRole() == USER_ROLE.ROLE_TRADER) {
                authorityList.add(new SimpleGrantedAuthority("ROLE_TRADER"));
            }
            // Nếu role là ROLE_ADMIN
            else if (user.getRole() == USER_ROLE.ROLE_ADMIN) {
                authorityList.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            }
        }

        // Trả về UserDetails với danh sách quyền đã gán
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorityList
        );
    }
}
