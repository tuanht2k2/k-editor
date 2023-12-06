package com.kma.wordprocessor.controllers;

import com.kma.wordprocessor.dto.TxtFileUpdateDTO;
import com.kma.wordprocessor.models.File;
import com.kma.wordprocessor.repositories.FileRepository;
import com.kma.wordprocessor.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/files")
public class FileController {
    @Autowired
    FileService fileService;

    @Autowired
    FileRepository fileRepository;

    @PostMapping(path = "create")
    public ResponseEntity<String> createFile(@RequestBody File file) {
        File newFile = fileService.createFile(file);
        file.set_id(newFile.get_id());
        fileRepository.save(file);
        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<File> getFileById (@PathVariable String id) {
        File file = fileService.getFileById(id);
        return  new ResponseEntity<File>(file,(file == null) ? HttpStatus.NOT_FOUND : HttpStatus.OK);
    }

    // with txt file
    @PostMapping(path = "/txt/{fileId}/update")
    public ResponseEntity<String> updateTxtFile (@PathVariable String fileId,@RequestBody TxtFileUpdateDTO txtFileUpdateDTO) {
       fileService.updateTxtFile(fileId, txtFileUpdateDTO);
       return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

}
