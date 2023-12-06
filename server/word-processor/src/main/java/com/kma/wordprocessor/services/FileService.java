package com.kma.wordprocessor.services;

import com.kma.wordprocessor.dto.TxtFileUpdateDTO;
import com.kma.wordprocessor.models.File;
import com.kma.wordprocessor.models.ResponseObj;
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
import java.util.Date;
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

    public void deleteFileById(String fileId){

        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (optionalFile.isPresent()){
            File file = optionalFile.get();
            fileRepository.deleteById(fileId);

            // delete file in users document
            Query query = new Query(Criteria.where("_id").is(file.getOwnerId()));
            Update update = new Update().pull("files", file.get_id());
            mongoTemplate.updateFirst(query, update, UserInfo.class);
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

    public void updateTxtFile (String fileId,TxtFileUpdateDTO newTxtFileUpdateDTO) {
        Optional<File> optionalFile = fileRepository.findById(fileId);
        if (!optionalFile.isPresent()) return;
        File file = optionalFile.get();
        file.setData(newTxtFileUpdateDTO.getData());

        List<TxtFileUpdateDTO> updateHistory = file.getUpdateHistory() == null ? new ArrayList<TxtFileUpdateDTO>() : file.getUpdateHistory();
        if (updateHistory.isEmpty()) {
            updateHistory.add(newTxtFileUpdateDTO);
        } else {
            TxtFileUpdateDTO lastUpdate = updateHistory.get(updateHistory.size() - 1);
            if (lastUpdate.getData().equals(newTxtFileUpdateDTO.getData())) {return;}
            if (lastUpdate.getUserId().equals(newTxtFileUpdateDTO.getUserId())) {
                updateHistory.set(updateHistory.size() - 1, newTxtFileUpdateDTO);
            } else {
                updateHistory.add(newTxtFileUpdateDTO);
            }
        }
        file.setUpdateHistory(updateHistory);
        fileRepository.save(file);
    }
}
