package com.kma.wordprocessor.models.KLearning;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "answers")
@NoArgsConstructor
@Setter
@Getter
public class Answer {

    @MongoId
    private String _id;

    private String lessonId;

    private String content;

    private boolean isCorrect;

    public Answer(String lessonId, String content, boolean isCorrect) {
        this.lessonId = lessonId;
        this.content = content;
        this.isCorrect = isCorrect;
    }
}
