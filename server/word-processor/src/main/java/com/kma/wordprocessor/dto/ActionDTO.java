package com.kma.wordprocessor.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ActionDTO {

    private String userId;

    private String data;

    private Date time;
}
