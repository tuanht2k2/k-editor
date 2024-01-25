package com.kma.wordprocessor.dto.KLearning;

import com.kma.wordprocessor.models.KLearning.ExamScore;
import com.kma.wordprocessor.models.KLearning.Lesson;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ExamOverviewDTO {

    private Lesson lesson;

    private ExamScore score;

}
