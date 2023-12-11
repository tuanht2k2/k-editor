package com.kma.wordprocessor.controllers;

import com.google.api.Http;
import com.kma.wordprocessor.dto.AuthFileDTO;
import com.kma.wordprocessor.dto.KWord.DocumentActionUpdateDTO;
import com.kma.wordprocessor.models.File;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.FileRepository;
import com.kma.wordprocessor.services.FileService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/files")
public class FileController {
    @Autowired
    FileService fileService;

    @Autowired
    FileRepository fileRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping(path = "/create")
    public ResponseEntity<String> createFile(@RequestBody File file) {
        if (!file.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(file.getPassword());
            file.setPassword(encodedPassword);
        }
        File newFile = fileService.createFile(file);
        file.set_id(newFile.get_id());
        fileRepository.save(file);
        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

    // auth
    @PostMapping(path = "/{id}")
    public ResponseEntity<?> getFileById (@PathVariable String id, @RequestBody AuthFileDTO authFileDTO) {
        if (!fileService.isCorrectPassword(id,authFileDTO.getFilePassword())) return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        File file = fileService.getFileById(id);
        return new ResponseEntity<File>(file,(file == null) ? HttpStatus.NOT_FOUND : HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/format={format}/check-file-existed")
    public ResponseEntity<?> checkFileExisted(@PathVariable String id, @PathVariable String format) {
        return fileService.isFileExisted(id, format) ? new ResponseEntity<>(null, HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/get-file-list/format={format}")
    public ResponseEntity<List<File>> getAllUserByIds (@RequestBody List<String> ids, @PathVariable String format) {
        return new ResponseEntity<List<File>>(fileService.getAllFileByIds(ids, format), HttpStatus.OK);
    }

    @PostMapping(path = "/txt/{fileId}/update")
    public ResponseEntity<String> updateTxtFile (@PathVariable String fileId,@RequestBody DocumentActionUpdateDTO txtFileUpdateDTO) {
       fileService.updateTxtFile(txtFileUpdateDTO);
       return new ResponseEntity<String>("OK", HttpStatus.OK);
    }


    // auth
    @PatchMapping(path = "/{fileId}/new-name={newName}")
    public ResponseEntity<String> editFileName(@PathVariable String fileId, @PathVariable String newName) {
        String editStt = fileService.editFileName(fileId, newName);
        return editStt.equals("OK") ? new ResponseEntity<String>("OK", HttpStatus.OK) : new ResponseEntity<String>("FAILED", HttpStatus.NOT_FOUND);
    }


    // auth
    @DeleteMapping(path = "{fileId}/delete")
    public ResponseEntity<String> deleteFileById(@PathVariable String fileId) {
        fileService.deleteFileById(fileId);
        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

}
