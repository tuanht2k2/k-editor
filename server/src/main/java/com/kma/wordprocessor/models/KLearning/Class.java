package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
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

    private Date createdAt;

    private List<String> memberIds = new ArrayList<String>();

    private List<String> requests = new ArrayList<String>();

    private List<Chapter> chapterList = new ArrayList<Chapter>();

    public Class(String classname, String ownerId, Date createdAt) {
        this.classname = classname;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
    }
}
