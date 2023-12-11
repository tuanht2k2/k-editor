package com.kma.wordprocessor.models;

import com.kma.wordprocessor.dto.KSheet.SheetUpdateDTO;
import com.kma.wordprocessor.dto.KWord.DocumentActionUpdateDTO;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Document(collection = "files")
public class File {

    @MongoId
    private String _id;

    private String ownerId;

    private String ownerName;

    private String parentFolderId;

    private String name;

    private String password;

    private String format;

    private String data;

    private String path;

    private Date createdAt;

    // for k-word
    private List<DocumentActionUpdateDTO> updateHistory;

    // for k-sheet
    private List<SheetUpdateDTO> sheetUpdateHistory;
}
