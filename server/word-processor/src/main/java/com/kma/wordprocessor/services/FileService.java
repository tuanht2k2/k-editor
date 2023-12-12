package com.kma.wordprocessor.services;

import com.kma.wordprocessor.dto.KSheet.SheetUpdateDTO;
import com.kma.wordprocessor.dto.KSheet.SheetUpdateGroupDTO;
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
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    PasswordEncoder passwordEncoder;

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

    public boolean isFileExisted(String fileId, String format) {
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isEmpty()) return false;
        File file = optionalFile.get();
        return file.getFormat().equals(format);
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

    // check password
    public boolean isCorrectPassword(String fileId, String rawPassword) {
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isEmpty()) return true;
        File file = optionalFile.get();
        String password = file.getPassword();
        if (password.isEmpty() || passwordEncoder.matches(rawPassword, password)) return true;
        return false;
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

    // when delete folder, we need to delete all subs file
    public void deleteFileByParentFolderId(String parentFolderId) {

        Query getFileIdQuery = new Query(Criteria.where("parentFolderId").is(parentFolderId));
        List<File> files = mongoTemplate.find(getFileIdQuery, File.class); // get file id by parent folder id
        List<String> fileIdList =  files.stream().map(File::get_id).collect(Collectors.toList());

        Query findFileIdInFileList = new Query(Criteria.where("files").in(fileIdList));
        Update update = new Update().pull("files", Query.query(Criteria.where("$in").is(fileIdList)));

        Query query = new Query(Criteria.where("parentFolderId").is(parentFolderId));
        mongoTemplate.remove(query, "files"); // delete in files document
    }

    // update when user edited txt file
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

    // update when user edited xlsx file
    public List<SheetUpdateGroupDTO> updateSheetFile(SheetUpdateDTO sheetUpdateDTO) {
        Optional<File> optionalSheet = fileRepository.findById(sheetUpdateDTO.getSheetId());
        if (optionalSheet.isEmpty()) return null;

        File sheet = optionalSheet.get();
        List<SheetUpdateGroupDTO> sheetUpdateHistory = sheet.getSheetUpdateHistory() == null ? new ArrayList<SheetUpdateGroupDTO>() : sheet.getSheetUpdateHistory();

        List<String> newUpdates = new ArrayList<String>();

        if (sheetUpdateHistory.isEmpty()) {
            // update list, contains updateArgsObj
            newUpdates.add(sheetUpdateDTO.getAction());
            SheetUpdateGroupDTO newSheetUpdateGroup = new SheetUpdateGroupDTO(sheetUpdateDTO.getSheetId(),sheetUpdateDTO.getUserId(), newUpdates, sheetUpdateDTO.getTime());
            sheetUpdateHistory.add(newSheetUpdateGroup);
        } else {
            SheetUpdateGroupDTO lastUpdate = sheetUpdateHistory.get(sheetUpdateHistory.size()-1);
            if (lastUpdate.getUserId().equals(sheetUpdateDTO.getUserId())) {
                List<String> lastUpdateActions = lastUpdate.getActions();
                lastUpdateActions.add(sheetUpdateDTO.getAction());
                lastUpdate.setActions(lastUpdateActions);
                lastUpdate.setTime(sheetUpdateDTO.getTime());
                sheetUpdateHistory.set(sheetUpdateHistory.size()-1, lastUpdate);
            } else {
                newUpdates.add(sheetUpdateDTO.getAction());
                SheetUpdateGroupDTO newSheetUpdateGroup = new SheetUpdateGroupDTO(sheetUpdateDTO.getSheetId(),sheetUpdateDTO.getUserId(), newUpdates, sheetUpdateDTO.getTime());
                sheetUpdateHistory.add(newSheetUpdateGroup);
            }
        }
        sheet.setSheetUpdateHistory(sheetUpdateHistory);
        fileRepository.save(sheet);
        return sheetUpdateHistory;
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
