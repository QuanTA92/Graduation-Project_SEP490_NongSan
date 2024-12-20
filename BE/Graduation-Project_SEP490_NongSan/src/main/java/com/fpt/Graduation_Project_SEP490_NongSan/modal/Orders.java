package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne // Quan hệ nhiều - một với User
    @JoinColumn(name = "id_user") // Khóa ngoại đến bảng User
    private User user;

    private int amount_paid;

    private int admin_commission;

    private String status;

    private Date createDate;

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems;

    private String transferContent; // Used for transfer note content

//    private String withdrawalRequest;
}
