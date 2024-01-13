package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "lesson_messengers")
@AllArgsConstructor
@Getter
@Setter
public class LessonMessenger {

    @MongoId
    private String _id;

    private String lessonId;

    private List<LessonMessage> messageList;

    public LessonMessenger() {
        this.messageList = new ArrayList<LessonMessage>();
    }
}
