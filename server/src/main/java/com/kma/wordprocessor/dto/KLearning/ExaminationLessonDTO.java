package com.kma.wordprocessor.dto.KLearning;

import com.kma.wordprocessor.models.KLearning.Lesson;
import com.kma.wordprocessor.models.KLearning.LessonMessenger;
import com.kma.wordprocessor.models.KLearning.Question;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExaminationLessonDTO {

    private Lesson lesson;

    private Double score;

    private List<QuestionDTO> questions;

    private List<String> deletedQuestions = new ArrayList<String>();

    private List<String> deletedAnswers = new ArrayList<String>();

}
