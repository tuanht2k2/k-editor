package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.dto.KLearning.AnswerDTO;
import com.kma.wordprocessor.dto.KLearning.QuestionDTO;
import com.kma.wordprocessor.models.KLearning.Answer;
import com.kma.wordprocessor.models.KLearning.Question;
import com.kma.wordprocessor.repositories.KLearning.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    AnswerService answerService;

    public Question createQuestion (String questionId, String lessonId, String content) {

        Question question = questionId != null ? new Question(questionId, lessonId, content) : new Question(lessonId, content);
        return questionRepository.save(question);
    }

    public List<QuestionDTO> getQuestionDTOs (String lessonId, String role) {
        List<QuestionDTO> questionDTOs = questionRepository.findAllByLessonId(lessonId, QuestionDTO.class);
        for (QuestionDTO questionDTO : questionDTOs) {
            List<AnswerDTO> answerDTOs = answerService.getAnswerDTOs(questionDTO.get_id(), role);
            questionDTO.setAnswers(answerDTOs);
        }
        return questionDTOs;
    }

    public String getCorrectAnswer(String questionId) {
        return answerService.getCorrectAnswer(questionId);
    }

    public void deleteQuestions (List<String> questions) {
        System.out.println(questions.size());
        questionRepository.deleteAllById(questions);
    }

}
