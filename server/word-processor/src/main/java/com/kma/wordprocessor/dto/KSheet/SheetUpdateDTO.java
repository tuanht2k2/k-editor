package com.kma.wordprocessor.dto.KSheet;

import lombok.Data;

import java.util.Date;

@Data
public class SheetUpdateDTO {
    private String sheetId;

    private String userId;

    private String action;

    private Date time;
}
