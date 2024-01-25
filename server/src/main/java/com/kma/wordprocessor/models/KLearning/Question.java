package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "questions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Question {

    @MongoId
    private String _id;

    private String lessonId;

    private String content;

    public Question(String lessonId, String content) {
        this.lessonId = lessonId;
        this.content = content;
    }
}
