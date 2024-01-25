package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "scores")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ExamScore {

    @MongoId
    private String _id;

    private String ownerId;

    private String lessonId;

    private Double score;

}
