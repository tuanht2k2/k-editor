package com.kma.wordprocessor.controllers;

import com.kma.wordprocessor.dto.ResFileExploreDTO;
import com.kma.wordprocessor.dto.ResFolderDTO;
import com.kma.wordprocessor.models.File;
import com.kma.wordprocessor.models.Folder;
import com.kma.wordprocessor.services.FileService;
import com.kma.wordprocessor.services.FolderService;
import com.kma.wordprocessor.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/folders")
public class FolderController {

    @Autowired
    FolderService folderService;

    @Autowired
    FileService fileService;

    @Autowired
    UserService userService;

    @PostMapping(path = "/create")
    public ResponseEntity<String> createFolder(@RequestBody Folder folder) {
        String createFolderStatus = folderService.createFolder(folder);
        return createFolderStatus.equals("OK") ? new ResponseEntity<String>("Create folder successfully!", HttpStatus.OK) : new ResponseEntity<String>("Create folder failure!", HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(path = "/delete/{folderId}")
    public ResponseEntity<String> deleteFolder(@PathVariable String folderId) {
        String deleteStatus = folderService.deleteFolder(folderId);
        return deleteStatus.equals("OK") ? new ResponseEntity<String>("Delete folder successfully!", HttpStatus.OK) : new ResponseEntity<String>("Delete folder failure!", HttpStatus.NOT_FOUND);
    }

    @GetMapping(path = "/userid={userId}&folderid={folderId}&fileformat={fileFormat}")
    public ResponseEntity<?> getFolderData(@PathVariable String userId, @PathVariable String folderId, @PathVariable String fileFormat) {

        Optional<Folder> optionalFolder = folderService.getFolder(folderId);

        if (optionalFolder.isPresent() || folderId.equals("root")) {
            // get all sub folders
            Folder folder = optionalFolder.isPresent() ? optionalFolder.get() : null;
            ResFolderDTO resFolderDTO = new ResFolderDTO(folder, folderService.getSubFolders(userId, folderId));

            // get all sub files
            List<File> subFiles = fileService.getSubFiles(userId, folderId, fileFormat);

            ResFileExploreDTO resFileExploreDTO = new ResFileExploreDTO(resFolderDTO, subFiles);

            return new ResponseEntity<ResFileExploreDTO>(resFileExploreDTO, HttpStatus.OK);
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PatchMapping(path = "/{folderId}/new-name={newName}")
    public ResponseEntity<String> editFolderName(@PathVariable String folderId, @PathVariable String newName) {
        String editStt = folderService.editFolderName(folderId, newName);
        return editStt.equals("OK") ? new ResponseEntity<String>("OK", HttpStatus.OK) : new ResponseEntity<String>("FAILED", HttpStatus.NOT_FOUND);
    }
}
