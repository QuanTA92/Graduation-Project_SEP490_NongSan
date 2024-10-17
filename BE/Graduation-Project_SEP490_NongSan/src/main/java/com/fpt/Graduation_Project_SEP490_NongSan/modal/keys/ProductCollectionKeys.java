package com.fpt.Graduation_Project_SEP490_NongSan.modal.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class ProductCollectionKeys implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "id_product")
    private Long idProduct;

    @Column(name = "id_collectionPoint")
    private int idCollectionPoint;

    public ProductCollectionKeys(){
    }

    public ProductCollectionKeys(Long idProduct, int idCollectionPoint){
        this.idProduct = idProduct;
        this.idCollectionPoint = idCollectionPoint;

    }
}
