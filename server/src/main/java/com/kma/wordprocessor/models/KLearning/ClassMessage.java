package com.kma.wordprocessor.models.KLearning;

import com.kma.wordprocessor.models.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;

@Document(collection = "class_messages")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ClassMessage {
    @MongoId
    private String _id;

    private String classId;

    private UserInfo user;

    private String content;

    private Date time;

}
