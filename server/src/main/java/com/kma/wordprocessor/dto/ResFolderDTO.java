package com.kma.wordprocessor.dto;


import com.kma.wordprocessor.models.Folder;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ResFolderDTO {

    private Folder folder;

    private List<Folder> subFolders;

}
