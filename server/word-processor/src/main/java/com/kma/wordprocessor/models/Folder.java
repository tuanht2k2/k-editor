package com.kma.wordprocessor.models;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Document(collection = "folders")
public class Folder {

    @MongoId
    private String _id;

    private String ownerId;

    private String name;

    private String parentId;

    private Date createAt;

    private List<String> files;

    public Folder(String ownerId, String name, String parentId, Date createAt) {
        this.ownerId = ownerId;
        this.name = name;
        this.parentId = parentId;
        this.createAt = createAt;
    }
}
