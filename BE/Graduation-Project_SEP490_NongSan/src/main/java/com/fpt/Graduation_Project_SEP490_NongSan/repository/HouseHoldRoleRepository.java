package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.HouseHoldRole;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HouseHoldRoleRepository extends JpaRepository<HouseHoldRole, Integer> {

    HouseHoldRole findByUser(User user);
}
