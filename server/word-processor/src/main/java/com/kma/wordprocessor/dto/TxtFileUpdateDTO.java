package com.kma.wordprocessor.dto;

import lombok.Data;

import java.util.Date;

@Data
public class TxtFileUpdateDTO {
    private String userId;

    private String data;

    private Date time;
}
