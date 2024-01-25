package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.checkerframework.checker.units.qual.A;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "answers")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Answer {

    @MongoId
    private String _id;

    private String questionId;

    private String content;

    private boolean correct;

    public Answer(String questionId, String content, boolean correct) {
        this.questionId = questionId;
        this.content = content;
        this.correct = correct;
    }
}
