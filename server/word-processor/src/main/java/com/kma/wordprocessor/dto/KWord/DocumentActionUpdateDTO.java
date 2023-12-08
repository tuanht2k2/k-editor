package com.kma.wordprocessor.dto.KWord;

import lombok.Data;

import java.util.Date;

@Data
public class DocumentActionUpdate {
    private String documentId;

    private String userId;

    private String data;

    private Date time;
}
