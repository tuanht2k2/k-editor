package com.kma.wordprocessor.dto.KLearning;

import com.kma.wordprocessor.models.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class MemberOverviewDTO {

    private UserInfo member;

    private int totalOfExaminations;

    private int totalOfCompletedExaminations;

    private List<ExamOverviewDTO> examOverviews;

    private String cpa;

}
