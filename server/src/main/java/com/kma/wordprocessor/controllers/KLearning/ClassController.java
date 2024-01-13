package com.kma.wordprocessor.controllers.KLearning;

import com.google.api.Http;
import com.kma.wordprocessor.models.KLearning.Chapter;
import com.kma.wordprocessor.models.KLearning.Class;
import com.kma.wordprocessor.models.KLearning.Lesson;
import com.kma.wordprocessor.services.KLearning.ChapterService;
import com.kma.wordprocessor.services.KLearning.ClassService;
import com.kma.wordprocessor.services.KLearning.LessonService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping(path = "api/classes")
@CrossOrigin(origins = "*")
public class ClassController {

    @Autowired
    ClassService classService;

    @Autowired
    ChapterService chapterService;

    @Autowired
    LessonService lessonService;

    @GetMapping(path = "{id}")
    public ResponseEntity<?> getOneClass (@PathVariable String id) {
        Class classData = classService.getOneClass(id);
        return classData == null ? new ResponseEntity<>(null, HttpStatus.NOT_FOUND) : new ResponseEntity<Class>(classData, HttpStatus.OK);
    }

    @GetMapping(path = "user={userId}/all-classes/role={role}")
    public ResponseEntity<List<Class>> getClasses (@PathVariable String userId, @PathVariable String role) {
        return new ResponseEntity<List<Class>>(classService.getClasses(userId, role), HttpStatus.OK);
    }

    @GetMapping(path = "{id}/all-chapters")
    public ResponseEntity<?> getAllChapters (@PathVariable String id) {
        if (classService.getOneClass(id) == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Class>(classService.getChapters(id), HttpStatus.OK);
    }

    @GetMapping(path = "/{classId}/lessons/{lessonId}")
    public ResponseEntity<?> getLesson (@PathVariable String lessonId){
        Lesson lesson = lessonService.getLesson(lessonId);
        return lesson == null ? new ResponseEntity<>(null, HttpStatus.NOT_FOUND) : new ResponseEntity<Lesson>(lesson, HttpStatus.OK);
    }

    @PostMapping(path = "{classId}/create-chapter/name={chapterName}")
    public ResponseEntity<?> createChapter (@PathVariable String classId, @PathVariable String chapterName) {
        if (classService.getOneClass(classId) == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        chapterService.createChapter(classId, chapterName);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping(path = "{classId}/create-lesson&type={type}")
    public ResponseEntity<?> createLesson (@PathVariable String classId, @PathVariable String type,@RequestBody Lesson newLesson) {

        if (classService.getOneClass(classId) == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        lessonService.createLesson(type, newLesson);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping(path = "create/user={ownerId}/classname={classname}")
    public ResponseEntity<String> createClass(@PathVariable String ownerId, @PathVariable String classname, @RequestBody String rawPassword) {
        return classService.createClass(classname, ownerId, rawPassword) ? new ResponseEntity<String>("OK", HttpStatus.OK) : new ResponseEntity<String>("OK", HttpStatus.BAD_REQUEST);
    }

    @PatchMapping(path = "/{classId}/lessons/{lessonId}/update")
    public ResponseEntity<?> updateLesson (@PathVariable String lessonId,@RequestBody Lesson lesson)   {
        return lessonService.updateLesson(lessonId, lesson) ? new ResponseEntity<>(null, HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

}
