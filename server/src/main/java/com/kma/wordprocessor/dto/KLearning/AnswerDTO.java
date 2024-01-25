package com.kma.wordprocessor.dto.KLearning;

import lombok.*;

@Data
@Setter
@Getter
public class AnswerDTO {

    private String _id;

    private String questionId;

    private String content;

    private boolean correct;

    public AnswerDTO() {
    }

    public AnswerDTO(String _id, String questionId, String content, boolean correct) {
        this._id = _id;
        this.questionId = questionId;
        this.content = content;
        this.correct = correct;
    }
}
