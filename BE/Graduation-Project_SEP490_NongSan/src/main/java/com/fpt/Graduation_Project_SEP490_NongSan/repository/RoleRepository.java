package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    // Thêm phương thức tìm kiếm vai trò theo tên
    Role findByName(String name);

    Role findById(int id); // thêm phương thức này nếu chưa có

}
