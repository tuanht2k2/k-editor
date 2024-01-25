package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.models.KLearning.ExamScore;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExamScoreRepository extends MongoRepository<ExamScore, String> {
    ExamScore findByLessonIdAndOwnerId(String lessonId, String ownerId);
}
