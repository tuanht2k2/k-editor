package com.kma.wordprocessor.dto.KSheet;

import com.kma.wordprocessor.models.UserInfo;
import lombok.Data;

import java.util.Date;

@Data
public class SheetUpdateDTO {
    private String sheetId;

    private UserInfo user;

    private String action;

    private Date time;
}
