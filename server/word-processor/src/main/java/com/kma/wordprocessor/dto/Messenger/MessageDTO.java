package com.kma.wordprocessor.dto.Messenger;

import com.kma.wordprocessor.models.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class MessageDTO {
    private UserInfo author;

    private String content;

    private Date time;

    private String type;
}
