package com.kma.wordprocessor.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {

    private UserInfo author;

    private String content;

//    private Date timeStamp;

}
