package com.kma.wordprocessor.dto.KSheet;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class SheetUpdateGroupDTO {
    private String sheetId;

    private String userId;

    private List<String> actions;

    private Date time;
}
