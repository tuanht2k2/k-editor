package com.kma.wordprocessor.dto.KLearning;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {

    private String _id;

    private String lessonId;

    private String content;

    private List<AnswerDTO> answers;

    public QuestionDTO(String lessonId, String content, List<AnswerDTO> answers) {
        this.lessonId = lessonId;
        this.content = content;
        this.answers = answers;
    }

    public QuestionDTO(String content, List<AnswerDTO> answers) {
        this.content = content;
        this.answers = answers;
    }
}
