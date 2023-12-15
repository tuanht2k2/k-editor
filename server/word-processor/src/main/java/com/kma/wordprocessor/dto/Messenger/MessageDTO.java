package com.kma.wordprocessor.dto.Messenger;

import com.kma.wordprocessor.models.UserInfo;
import lombok.Data;
import org.springframework.security.core.userdetails.User;

import java.util.Date;

@Data
public class MessageDTO {
    private UserInfo user;

    private String content;

    private Date time;

    private String type;
}
