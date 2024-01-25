package com.kma.wordprocessor.dto.KLearning;

import com.kma.wordprocessor.models.KLearning.Class;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassesDTO {

    private List<Class> yourClasses;

    private List<Class> joinedClasses;

}
