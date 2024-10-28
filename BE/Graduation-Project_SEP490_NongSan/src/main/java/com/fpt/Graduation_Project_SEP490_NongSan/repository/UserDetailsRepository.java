package com.fpt.Graduation_Project_SEP490_NongSan.repository;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Integer> {
}
