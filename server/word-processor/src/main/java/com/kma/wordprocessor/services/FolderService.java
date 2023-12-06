package com.kma.wordprocessor.services;

import com.kma.wordprocessor.models.Folder;
import com.kma.wordprocessor.models.ResponseObj;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.FolderRepository;
import com.kma.wordprocessor.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FolderService {

    @Autowired
    FolderRepository folderRepository;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    FileService fileService;

    public String createFolder(@org.jetbrains.annotations.NotNull Folder folder) {

        Optional<UserInfo> optionalUser = userRepository.findById(folder.getOwnerId());

        if (optionalUser.isPresent()) {
            Folder newFolder = new Folder(folder.getOwnerId(), folder.getName(), folder.getParentId(), new Date());
            newFolder = folderRepository.save(newFolder);
            userService.createFolder(optionalUser.get(), newFolder.get_id());
            return "OK";
        }

        return "FAILED";
    }

    public void deleteFolderInUserById(String ownerId, String folderId){
        Query query = new Query(Criteria.where("_id").is(ownerId));
        Update  update = new Update().pull("folders", folderId);
        mongoTemplate.updateFirst(query, update, UserInfo.class);
        return;
    }

    public String deleteFolder(String folderId) {

        Optional<Folder> optionalFolder = folderRepository.findById(folderId);
        if (optionalFolder.isEmpty()) return "FAILED";

        Folder folder = optionalFolder.get();
        List<Folder> subFolders = getSubFolders(folder.getOwnerId(), folder.get_id());

        // delete folder
        folderRepository.deleteById(folder.get_id());
        deleteFolderInUserById(folder.getOwnerId(), folder.get_id()); // delete in users document

        //delete file
        fileService.deleteFileByParentFolderId(folder.get_id());

        if (subFolders.isEmpty()) return "OK";

        //delete all sub folders in folders document
        for (Folder subFolder : subFolders) {
            deleteFolder(subFolder.get_id());
        }

        return "OK";
    }


    public Optional<Folder> getFolder(String folderId) {

        return folderRepository.findById(folderId);
    }

    public List<Folder> getSubFolders(String ownerId,String folderId) {
        return folderRepository.findByOwnerIdAndParentId(ownerId,folderId);
    }

    public String editFolderName(String folderId, String newName) {
        Optional<Folder> optionalFolder = folderRepository.findById(folderId);
        if (optionalFolder.isPresent()) {
            Folder folder = optionalFolder.get();
            folder.setName(newName);
            folderRepository.save(folder);
            return "OK";
        }
        return "FAILED";
    }
}
