package com.kma.wordprocessor.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class RegisterDTO {

    private String email;

    private String username;

    private String phoneNumber;

    private String password;

}
