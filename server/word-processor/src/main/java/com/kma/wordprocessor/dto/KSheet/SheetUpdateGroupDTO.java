package com.kma.wordprocessor.dto.KSheet;

import com.kma.wordprocessor.models.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class SheetUpdateGroupDTO {
    private String sheetId;

    private UserInfo user;

    private List<String> actions;

    private Date time;
}
