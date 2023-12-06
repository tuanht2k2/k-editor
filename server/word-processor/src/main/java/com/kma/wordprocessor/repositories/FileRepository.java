package com.kma.wordprocessor.repositories;

import com.kma.wordprocessor.models.File;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends MongoRepository<File, String> {
    List<File> findByOwnerIdAndParentFolderId(String ownerId, String parentFolderId);

    List<File> findByOwnerIdAndParentFolderIdAndFormat(String ownerId, String parentFolderId, String format);
}
