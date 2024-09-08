package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullname;

    private String email;

    // khong luu pw trong json
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Embedded
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    private USER_ROLE role = USER_ROLE.ROLE_TRADER;

    @OneToOne(mappedBy = "user")
    private HouseHoldRole houseHoldRole;

    @OneToOne(mappedBy = "user")
    private TraderRole traderRole;
}