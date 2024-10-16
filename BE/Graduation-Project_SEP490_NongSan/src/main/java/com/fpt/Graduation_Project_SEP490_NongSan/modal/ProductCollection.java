package com.fpt.Graduation_Project_SEP490_NongSan.modal;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.keys.ProductCollectionKeys;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class ProductCollection {

    @EmbeddedId
    private ProductCollectionKeys productCollectionKeys;

    private Date timeProductCollection;

    private int quantity;

    private int packingCode;

    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "id_product", insertable = false, updatable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "id_collectionPoint", insertable = false, updatable = false)
    private CollectionPoint collectionPoint;

}
