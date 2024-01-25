package com.kma.wordprocessor.models.KLearning;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "lessons")
@NoArgsConstructor
@Setter
@Getter
public class Lesson {

    @MongoId
    private String _id;

    private String ownerId;

    private String classId;

    private String chapterId;

    private String name;

    private String description;

    private String type; // youtube video or exam

    private String mediaLink;

    private LessonMessenger messenger;

    // examination
    private boolean scoreShowed;

    private String coefficient; // - 0: is homework, - > 0: is exam

    private int timeInMinutes;

    // video lesson
    public Lesson(String ownerId, String classId, String chapterId, String name, String description, String type, String mediaLink) {
        this.ownerId = ownerId;
        this.classId = classId;
        this.chapterId = chapterId;
        this.name = name;
        this.description = description;
        this.type = type;
        this.mediaLink = mediaLink;
    }

    // examination


    public Lesson(String ownerId, String classId, String chapterId, String name, String type, boolean scoreShowed, String coefficient, int timeInMinutes) {
        this.ownerId = ownerId;
        this.classId = classId;
        this.chapterId = chapterId;
        this.name = name;
        this.type = type;
        this.scoreShowed = scoreShowed;
        this.coefficient = coefficient;
        this.timeInMinutes = timeInMinutes;
    }
}
