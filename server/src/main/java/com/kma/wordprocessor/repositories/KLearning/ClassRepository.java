package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.models.KLearning.Class;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends MongoRepository<Class, String> {
    boolean existsByClassnameAndOwnerId(String classname, String ownerId);

    List<Class> findByOwnerId(String ownerId);

    List<Class> findAllByOwnerId(String ownerId);

    List<Class> findAllByMemberIdsContains(String ownerId);
}
