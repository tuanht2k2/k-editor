package com.kma.wordprocessor.entities;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AuthResponse {

    private String username;

    private String token;

    private String authStatus;
}
