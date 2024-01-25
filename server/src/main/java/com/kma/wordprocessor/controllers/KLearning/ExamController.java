package com.kma.wordprocessor.controllers.KLearning;

import com.kma.wordprocessor.dto.KLearning.ExaminationLessonDTO;
import com.kma.wordprocessor.models.KLearning.ExamScore;
import com.kma.wordprocessor.services.KLearning.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/examinations")
@CrossOrigin(origins = "*")
public class ExamController {
    @Autowired
    LessonService lessonService;

    @PostMapping(path = "submit&user_id={userId}")
    public ResponseEntity<?> submitExam (@RequestBody ExaminationLessonDTO examinationLessonDTO,@PathVariable String userId) {
        ExaminationLessonDTO returnedExaminationDTO = lessonService.submitExamination(examinationLessonDTO, userId);
        return returnedExaminationDTO == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) : new ResponseEntity<ExaminationLessonDTO>(returnedExaminationDTO, HttpStatus.OK);
    }

}
