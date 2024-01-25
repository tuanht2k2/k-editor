package com.kma.wordprocessor.repositories.KLearning;

import com.kma.wordprocessor.dto.KLearning.AnswerDTO;
import com.kma.wordprocessor.models.KLearning.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface AnswerRepository extends MongoRepository<Answer, String> {
    @Query(value = "{ 'questionId' : ?0 }", fields = "{ '_id' : 1, 'questionId' : 1, 'content' : 1}")
    List<AnswerDTO> findAllByQuestionIdExcludeCorrect(String questionId, Class<AnswerDTO> type); // get answerDTO ( remove isCorrect field)

    @Query(value = "{ 'questionId' : ?0 }", fields = "{ '_id' : 1, 'questionId' : 1, 'content' : 1, 'correct' : 1}")
    List<AnswerDTO> findAllByQuestionIdIncludeCorrect(String questionId, Class<AnswerDTO> type);

    Answer findByQuestionIdAndCorrect(String questionId, boolean b);
}
