package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Document(collection = "classes")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Class {
    @MongoId
    private String _id;

    private String classname;

    private String ownerId;

    private String password;

    private Date createdAt;

    private List<String> memberIds;

    private List<Chapter> chapterList;

    public Class(String classname, String ownerId, String password, Date createdAt, List<String> memberIds, List<Chapter> chapterList) {
        this.classname = classname;
        this.ownerId = ownerId;
        this.password = password;
        this.createdAt = createdAt;
        this.memberIds = memberIds;
        this.chapterList = chapterList;
    }
}
