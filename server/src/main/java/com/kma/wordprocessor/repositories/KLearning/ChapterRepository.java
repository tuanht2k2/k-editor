package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.models.KLearning.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByClassId(String classId);
}
