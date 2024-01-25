package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.models.KLearning.ClassMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassMessageRepository extends MongoRepository<ClassMessage, String> {
    List<ClassMessage> findAllByClassId(String classId);
}
