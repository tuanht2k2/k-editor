package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.models.KLearning.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByChapterId(String chapterId);
}
