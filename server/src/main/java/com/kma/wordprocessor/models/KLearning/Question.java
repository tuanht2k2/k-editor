package com.kma.wordprocessor.models.KLearning;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "questions")
public class Question {

    @MongoId
    private String _id;

    private String lessonId;

    private String content;

    private String level;

}
