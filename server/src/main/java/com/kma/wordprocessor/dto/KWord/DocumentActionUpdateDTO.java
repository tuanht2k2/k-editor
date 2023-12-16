package com.kma.wordprocessor.dto.KWord;

import com.kma.wordprocessor.models.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class DocumentActionUpdateDTO {
    private String documentId;

    private UserInfo user;

    private String data;

    private Date time;
}
