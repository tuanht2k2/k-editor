package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.dto.KLearning.QuestionDTO;
import com.kma.wordprocessor.models.KLearning.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<QuestionDTO> findAllByLessonId(String lessonId, Class<QuestionDTO> type);
}
