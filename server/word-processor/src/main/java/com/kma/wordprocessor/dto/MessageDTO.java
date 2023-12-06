package com.kma.wordprocessor.dto;

import com.kma.wordprocessor.models.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class MessageDTO {
    private UserInfo author;

    private String content;

    private Date time;
}
