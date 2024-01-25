package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.models.KLearning.ExamScore;
import com.kma.wordprocessor.repositories.KLearning.ExamScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ExamScoreService {

    @Autowired
    ExamScoreRepository examScoreRepository;

    public void createScore (ExamScore examScore) {
        examScoreRepository.save(examScore);
    }

    public void deleteScore (String examScoreId) {
        examScoreRepository.deleteById(examScoreId);
    }

    public ExamScore getScore (String examScoreId) {
        Optional<ExamScore> optionalExamScore = examScoreRepository.findById(examScoreId);
        return optionalExamScore.orElse(null);
    }

    public Double getScoreByLessonIdAndOwnerId (String lessonId, String ownerId) {
        ExamScore examScore = examScoreRepository.findByLessonIdAndOwnerId(lessonId, ownerId);
        return (examScore != null) ? examScore.getScore() : null;
    }

    public ExamScore getExamScoreByLessonIdAndOwnerId (String lessonId, String ownerId) {
        return examScoreRepository.findByLessonIdAndOwnerId(lessonId, ownerId);
    }

}
