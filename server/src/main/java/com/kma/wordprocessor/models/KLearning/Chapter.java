package com.kma.wordprocessor.models.KLearning;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "chapters")
public class Chapter {

    @MongoId
    private String _id;

    private String classId;

    private String name;

    private List<Lesson> lessonList;

//    private String lessonTotal;
//
//    private String lessonDurationTotal;

    public Chapter(String classId, String name) {
        this.classId = classId;
        this.name = name;
        this.lessonList = new ArrayList<Lesson>();
    }

    public Chapter(String classId, String name, List<Lesson> lessonList) {
        this.classId = classId;
        this.name = name;
        this.lessonList = lessonList;
    }
}
