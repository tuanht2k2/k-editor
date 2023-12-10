package com.kma.wordprocessor.dto;

import lombok.Data;

import java.util.List;

@Data
public class MovedFolderAndFileDTO {

    private String from;

    private List<String> folders;

    private List<String> files;

}
