package com.kma.wordprocessor.repositories;

import com.kma.wordprocessor.models.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
    List<Folder> findByOwnerIdAndParentId(String ownerId,String folderParentId);
}
