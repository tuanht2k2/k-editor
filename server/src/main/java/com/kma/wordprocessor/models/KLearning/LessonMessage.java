package com.kma.wordprocessor.models.KLearning;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;

@Document(collection = "lesson_messages")
public class LessonMessage {

    @MongoId
    private String _id;

    private String classId;

    private String ownerId;

    private String content;

    private Date time;

}
