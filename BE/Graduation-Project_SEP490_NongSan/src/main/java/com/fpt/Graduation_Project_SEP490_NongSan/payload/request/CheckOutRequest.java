package com.fpt.Graduation_Project_SEP490_NongSan.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckOutRequest {

    private String transferContent; // Used to transfer note content

    private List<Integer> idCart;
}