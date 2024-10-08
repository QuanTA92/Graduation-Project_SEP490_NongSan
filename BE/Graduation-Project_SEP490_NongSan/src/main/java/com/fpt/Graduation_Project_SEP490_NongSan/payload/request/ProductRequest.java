package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class ProductRequest {

    private String productName;

    private MultipartFile[] productImage;

    private String productDescription;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date expirationDate;

    private String status;

    private Date createDate;

    private Date updateDate;

    private String qualityCheck;

    private int quantity;

    private int idCategories;

    private double price;

    private int idHouseHold;
}
