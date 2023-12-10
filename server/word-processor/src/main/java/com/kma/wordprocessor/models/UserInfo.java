package com.kma.wordprocessor.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "users")
public class UserInfo {

    @MongoId
    private String _id;

    private String username;

    private String email;

    private String phoneNumber;

    private String profileImage;

    private String roles;

    private String password;

    @Field("folders")
    private List<String> folders;

    private List<String> recentFiles;

    public UserInfo(String username, String email, String phoneNumber,String password, String roles) {
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.roles = roles;
    }
}
