package com.kma.wordprocessor.models;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ResponseObj {
    private String status;

    private String messsage;

    private Object data;
}
