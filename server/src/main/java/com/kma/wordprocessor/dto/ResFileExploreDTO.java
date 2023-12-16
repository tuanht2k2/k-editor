package com.kma.wordprocessor.dto;

import com.kma.wordprocessor.models.File;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ResFileExploreDTO {
    private ResFolderDTO folders;

    private List<File> files;
}
