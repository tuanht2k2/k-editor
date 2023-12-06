package com.kma.wordprocessor.dto;

import lombok.Data;

@Data
public class AuthResDTO {

    private String accessToken;
    private String tokenType = "Bearer ";

    public AuthResDTO(String accessToken) {
        this.accessToken = accessToken;
    }

}
