package com.fpt.Graduation_Project_SEP490_NongSan.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloudinaryResponse {

    private String publicId;

    private String url;
}
