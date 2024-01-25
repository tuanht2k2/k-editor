package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.dto.KLearning.AnswerDTO;
import com.kma.wordprocessor.models.KLearning.Answer;
import com.kma.wordprocessor.repositories.KLearning.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerService {

    @Autowired
    AnswerRepository answerRepository;

    public Answer createAnswer(String answerId, String questionId, String content, boolean isCorrect) {
        Answer answer = answerId == null ? new Answer(questionId, content, isCorrect) : new Answer(answerId, questionId, content, isCorrect);
        return answerRepository.save(answer);
    }

    public List<AnswerDTO> getAnswerDTOs (String questionId, String role) {
        return role.equals("admin") ? answerRepository.findAllByQuestionIdIncludeCorrect(questionId, AnswerDTO.class) : answerRepository.findAllByQuestionIdExcludeCorrect(questionId, AnswerDTO.class);
    }

    public String getCorrectAnswer (String questionId) {
      Answer answer = answerRepository.findByQuestionIdAndCorrect(questionId, true);
      return (answer == null) ? "" : answer.get_id();
    }

    public void deleteAnswers (List<String> answers) {
        answerRepository.deleteAllById(answers);
    }

}
