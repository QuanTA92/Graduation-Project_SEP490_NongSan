package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fpt.Graduation_Project_SEP490_NongSan.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullname;

    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Embedded
    private TwoFactorAuth twoFactorAuth = new TwoFactorAuth();

    @Enumerated(EnumType.STRING)
    private USER_ROLE role;

    @OneToOne(mappedBy = "user")
    @JsonManagedReference
    private HouseHoldRole houseHoldRole;

    @OneToOne(mappedBy = "user")
    @JsonManagedReference
    private TraderRole traderRole;

    @OneToOne(mappedBy = "user")
    @JsonManagedReference
    private AdminRole adminRole;

}