package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.dto.KLearning.AnswerDTO;
import com.kma.wordprocessor.dto.KLearning.ExaminationLessonDTO;
import com.kma.wordprocessor.dto.KLearning.MemberOverviewDTO;
import com.kma.wordprocessor.dto.KLearning.QuestionDTO;
import com.kma.wordprocessor.models.KLearning.*;
import com.kma.wordprocessor.repositories.KLearning.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    @Autowired
    LessonRepository lessonRepository;

    @Autowired
    QuestionService questionService;

    @Autowired
    AnswerService answerService;

    @Autowired
    ExamScoreService examScoreService;

    public Object getLesson (String lessonId, String userId) {
        Optional<Lesson> optionalLesson = lessonRepository.findById(lessonId);
        if (optionalLesson.isEmpty()) return null;
        Lesson lesson = optionalLesson.get();
        if (lesson.getType().equals("video")) {
            return lesson;
        }
        ExaminationLessonDTO examinationLessonDTO = new ExaminationLessonDTO();
        examinationLessonDTO.setLesson(lesson);

        if (!userId.equals(lesson.getOwnerId())) {
            // Check whether the user has completed this test or not
            Double examScore = examScoreService.getScoreByLessonIdAndOwnerId(lessonId, userId);
            if (examScore != null) {
                examinationLessonDTO.setScore(examScore);
            }
        }

        String role = userId.equals(lesson.getOwnerId()) ? "admin" : "member";
        // query questions
        List<QuestionDTO> questions = questionService.getQuestionDTOs(lessonId, role);
        examinationLessonDTO.setQuestions(questions);
        return examinationLessonDTO;
    }

    public List<Lesson> getLessonList (String chapterId) {
        return lessonRepository.findByChapterId(chapterId);
    }

    public void createVideoLesson(Lesson lesson) {
            Lesson newLesson = new Lesson();
            newLesson.setOwnerId(lesson.getOwnerId());
            newLesson.setClassId(lesson.getClassId());
            newLesson.setChapterId(lesson.getChapterId());
            newLesson.setName(lesson.getName());
            newLesson.setType("video");
            newLesson.setMediaLink(lesson.getMediaLink());
            newLesson.setDescription(lesson.getDescription());
            newLesson.setMessenger(new LessonMessenger());
            lessonRepository.save(newLesson);
    }

    public boolean updateLesson (String lessonId, Lesson newLesson) {
        Optional<Lesson> optionalLesson = lessonRepository.findById(lessonId);
        if (optionalLesson.isEmpty()) return false;
        Lesson currentLesson = optionalLesson.get();
        currentLesson.setName(newLesson.getName());
        currentLesson.setMediaLink(newLesson.getMediaLink());
        currentLesson.setDescription(newLesson.getDescription());
        lessonRepository.save(currentLesson);
        return true;
    }

    // examination
    public void createExaminationLesson(ExaminationLessonDTO examinationLessonDTO) { // create or edit examination

        Lesson lesson = examinationLessonDTO.getLesson();

        Lesson createdLesson =  lessonRepository.save(lesson);

        questionService.deleteQuestions(examinationLessonDTO.getDeletedQuestions());
        answerService.deleteAnswers(examinationLessonDTO.getDeletedAnswers());

        for (int i = 0; i < examinationLessonDTO.getQuestions().size(); i++) {
            QuestionDTO questionDTO = examinationLessonDTO.getQuestions().get(i);
            Question createdQuestion = questionService.createQuestion(questionDTO.get_id(), createdLesson.get_id(), questionDTO.getContent());
            for (int j = 0; j < questionDTO.getAnswers().size(); j++) {
                AnswerDTO answerDTO = questionDTO.getAnswers().get(j);
                answerService.createAnswer(answerDTO.get_id(), createdQuestion.get_id(), answerDTO.getContent(), answerDTO.isCorrect());
            }
        }
    }

    public ExaminationLessonDTO submitExamination (ExaminationLessonDTO examinationLessonDTO, String userId) {
        if (examScoreService.getScoreByLessonIdAndOwnerId(examinationLessonDTO.getLesson().get_id(), userId) != null) {
            return null;
        }

        List<QuestionDTO> questions = examinationLessonDTO.getQuestions();
        double totalOfCorrectAnswer = 0.0;
        for (QuestionDTO question : questions) {
            List<AnswerDTO> answers = question.getAnswers();
            AnswerDTO selectedAnswer = answers.stream().filter(AnswerDTO::isCorrect).findFirst().orElse(null);

            if (selectedAnswer == null) continue;

            String correctAnswer = questionService.getCorrectAnswer(question.get_id());
            if (correctAnswer == null) continue;
            if (selectedAnswer.get_id().equals(correctAnswer)) totalOfCorrectAnswer++;
        }

        double score = Double.parseDouble(String.valueOf(totalOfCorrectAnswer * 10.00 / questions.size()));

        DecimalFormat decimalFormat = new DecimalFormat("#.##");

        String roundedScore = decimalFormat.format(score);

        double roundedDoubleScore = Double.parseDouble(roundedScore);

        ExamScore examScore = new ExamScore();
        examScore.setLessonId(examinationLessonDTO.getLesson().get_id());
        examScore.setOwnerId(userId);
        examScore.setScore(roundedDoubleScore);
        examScoreService.createScore(examScore);

        examinationLessonDTO.setScore(roundedDoubleScore);
        return (ExaminationLessonDTO) getLesson(examinationLessonDTO.getLesson().get_id(), userId);
    }

    public List<Lesson> getAllExamByClassId (String classId) {
        return lessonRepository.findAllByClassIdAndType(classId, "examination");
    }

    public void deleteLessonById (String lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    public void deleteAllLessonByChapterId (String chapterId) {
        lessonRepository.deleteAllByChapterId(chapterId);
    }
}
