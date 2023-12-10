package com.kma.wordprocessor.services;

import com.kma.wordprocessor.dto.KSheet.SheetUpdateDTO;
import com.kma.wordprocessor.dto.KWord.DocumentActionUpdateDTO;
import com.kma.wordprocessor.models.File;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.FileRepository;
import com.kma.wordprocessor.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Autowired
    FileRepository fileRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public File getFileById(String fileId){
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isPresent()) {
            return optionalFile.get();
        }
        return null;
    };

    public File createFile (File file) {
        return fileRepository.save(file);
    }

    public List<File> getSubFiles (String ownerId ,String parentFolderId, String format) {
        if (format.equals("any")) {
            List<File> subFiles = fileRepository.findByOwnerIdAndParentFolderId(ownerId,parentFolderId);
            for (File file : subFiles) {
                Optional<UserInfo> optionalUser = userRepository.findById(file.getOwnerId());
                if (optionalUser.isPresent()) {
                    file.setOwnerName(optionalUser.get().getUsername());
                }
            }
            return subFiles;
        }

        List<File> subFiles = fileRepository.findByOwnerIdAndParentFolderIdAndFormat(ownerId,parentFolderId,format);
        for (File file : subFiles) {
            Optional<UserInfo> optionalUser = userRepository.findById(file.getOwnerId());
            if (optionalUser.isPresent()) {
                file.setOwnerName(optionalUser.get().getUsername());
            }
        }
        return subFiles;
    }

    public List<File> getAllFileByIds(List<String> ids, String format) {
        List<File> fileList = format.equals("any") ? fileRepository.findAllById(ids) :fileRepository.findAllBy_idInAndFormat(ids, format);

        for (File file : fileList) {
            Optional<UserInfo> optionalUser = userRepository.findById(file.getOwnerId());
            if (optionalUser.isPresent()) {
                file.setOwnerName(optionalUser.get().getUsername());
            }
        }

        return fileList;
    }

    public void moveFile(String fileId, String newParentFolderId){
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isEmpty()) return;
        File file = optionalFile.get();
        file.setParentFolderId(newParentFolderId);
        fileRepository.save(file);
        return;
    }

    public void moveListFile(List<String> fileIds, String newParentFolderId) {
        for (String fileId : fileIds) {
            moveFile(fileId, newParentFolderId);
        }
    }

    public void deleteFileById(String fileId){
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isPresent()){
            File file = optionalFile.get();
            fileRepository.deleteById(fileId);
        }
    }

    public void deleteFileByParentFolderId(String parentFolderId) {

        Query getFileIdQuery = new Query(Criteria.where("parentFolderId").is(parentFolderId));
        List<File> files = mongoTemplate.find(getFileIdQuery, File.class); // get file id by parent folder id
        List<String> fileIdList =  files.stream().map(File::get_id).collect(Collectors.toList());

        Query findFileIdInFileList = new Query(Criteria.where("files").in(fileIdList));
        Update update = new Update().pull("files", Query.query(Criteria.where("$in").is(fileIdList)));

        Query query = new Query(Criteria.where("parentFolderId").is(parentFolderId));
        mongoTemplate.remove(query, "files"); // delete in files document
    }

    public void updateTxtFile (DocumentActionUpdateDTO txtDocumentActionUpdateDTO) {
        Optional<File> optionalFile = fileRepository.findById(txtDocumentActionUpdateDTO.getDocumentId());
        if (!optionalFile.isPresent()) return;
        File file = optionalFile.get();
        file.setData(txtDocumentActionUpdateDTO.getData());

        List<DocumentActionUpdateDTO> updateHistory = file.getUpdateHistory() == null ? new ArrayList<DocumentActionUpdateDTO>() : file.getUpdateHistory();
        if (updateHistory.isEmpty()) {
            updateHistory.add(txtDocumentActionUpdateDTO);
        } else {
            DocumentActionUpdateDTO lastUpdate = updateHistory.get(updateHistory.size() - 1);
            if (lastUpdate.getData().equals(txtDocumentActionUpdateDTO.getData())) {return;}
            if (lastUpdate.getUserId().equals(txtDocumentActionUpdateDTO.getUserId())) {
                updateHistory.set(updateHistory.size() - 1, txtDocumentActionUpdateDTO);
            } else {
                updateHistory.add(txtDocumentActionUpdateDTO);
            }
        }
        file.setUpdateHistory(updateHistory);
        fileRepository.save(file);
    }

    public void updateSheetFile(SheetUpdateDTO sheetUpdateDTO) {
        Optional<File> optionalSheet = fileRepository.findById(sheetUpdateDTO.getSheetId());
        if (!optionalSheet.isPresent()) return;

        File sheet = optionalSheet.get();
        List<SheetUpdateDTO> sheetUpdateHistory = sheet.getSheetUpdateHistory() == null ? new ArrayList<SheetUpdateDTO>() : sheet.getSheetUpdateHistory();
        sheetUpdateHistory.add(sheetUpdateDTO);
        sheet.setSheetUpdateHistory(sheetUpdateHistory);
        fileRepository.save(sheet);
    }

    public String editFileName(String fileId, String newName) {
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isPresent()) {
            File file = optionalFile.get();
            file.setName(newName);
            fileRepository.save(file);
            return "OK";
        }
        return "FAILED";
    }
}
