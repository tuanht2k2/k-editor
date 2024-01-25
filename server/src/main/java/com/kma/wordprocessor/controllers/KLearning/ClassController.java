package com.kma.wordprocessor.controllers.KLearning;

import com.kma.wordprocessor.dto.KLearning.*;
import com.kma.wordprocessor.models.KLearning.Class;
import com.kma.wordprocessor.models.KLearning.ClassMessage;
import com.kma.wordprocessor.models.KLearning.Lesson;
import com.kma.wordprocessor.services.KLearning.ChapterService;
import com.kma.wordprocessor.services.KLearning.ClassMessageService;
import com.kma.wordprocessor.services.KLearning.ClassService;
import com.kma.wordprocessor.services.KLearning.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Autowired
    ClassMessageService classMessageService;

    @GetMapping(path = "{id}")
    public ResponseEntity<?> getOneClass (@PathVariable String id) {
        Class classData = classService.getOneClass(id);
        return classData == null ? new ResponseEntity<>(null, HttpStatus.NOT_FOUND) : new ResponseEntity<Class>(classData, HttpStatus.OK);
    }

    @GetMapping(path = "user={userId}/all-classes")
    public ResponseEntity<ClassesDTO> getClasses (@PathVariable String userId) {
        return new ResponseEntity<ClassesDTO>(classService.getClasses(userId), HttpStatus.OK);
    }

    @GetMapping(path = "{id}/all-chapters")
    public ResponseEntity<?> getAllChapters (@PathVariable String id) {
        if (classService.getOneClass(id) == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Class>(classService.getChapters(id), HttpStatus.OK);
    }

    @GetMapping(path = "/{classId}/lessons/{lessonId}&user_id={userId}")
    public ResponseEntity<?> getLesson (@PathVariable String lessonId, @PathVariable String userId){
        Object lesson = lessonService.getLesson(lessonId, userId);
        return lesson == null ? new ResponseEntity<>(null, HttpStatus.NOT_FOUND) : new ResponseEntity<Object>(lesson, HttpStatus.OK);
    }

    @GetMapping(path = "/{classId}/students")
    public ResponseEntity<?> getMemebers (@PathVariable String classId) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "{classId}/create-chapter/name={chapterName}")
    public ResponseEntity<?> createChapter (@PathVariable String classId, @PathVariable String chapterName) {
        if (classService.getOneClass(classId) == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        chapterService.createChapter(classId, chapterName);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    // create lesson
    @PostMapping(path = "{classId}/create-video-lesson")
    public ResponseEntity<?> createLesson (@PathVariable String classId, @RequestBody Lesson newLesson) {

        if (classService.getOneClass(classId) == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        lessonService.createVideoLesson(newLesson);

        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping(path = "{classId}/examination-lesson-editor")
    public ResponseEntity<?> createExaminationLesson (@PathVariable String classId, @RequestBody ExaminationLessonDTO examinationLessonDTO) {

        if (classService.getOneClass(classId) == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        lessonService.createExaminationLesson(examinationLessonDTO);

        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @DeleteMapping(path = "{classId}/lessons/{lessonId}/delete")
    public void deleteLesson (@PathVariable String classId, @PathVariable String lessonId) {
        lessonService.deleteLessonById(lessonId);
    }

    @PostMapping(path = "create")
    public ResponseEntity<String> createClass(@RequestBody Class newClass) {
        return classService.createClass(newClass.getClassname(), newClass.getOwnerId()) ? new ResponseEntity<String>("OK", HttpStatus.OK) : new ResponseEntity<String>("OK", HttpStatus.BAD_REQUEST);
    }

    // get members and requests
    @GetMapping(path = "{classId}/members")
    public ResponseEntity<?> getMembers (@PathVariable String classId) {
        MemberDataDTO memberDataDTO = classService.getMembers(classId);
        return memberDataDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<MemberDataDTO>(memberDataDTO, HttpStatus.OK);
    }

    // request to join class
    @PostMapping(path = "/join")
    public ResponseEntity<?> requestToJoinClass (@RequestBody MemberRequestDTO memberRequestDTO) {
        return classService.manageMember(memberRequestDTO) != null ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    // accept or reject request
    @PostMapping(path = "/add-member")
    public ResponseEntity<?> addMember (@RequestBody MemberRequestDTO memberRequestDTO) {
        MemberDataDTO memberDataDTO = classService.manageMember(memberRequestDTO);
        return memberDataDTO != null ? new ResponseEntity<MemberDataDTO>(memberDataDTO,HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "/remove-request")
    public ResponseEntity<?> removeRequest (@RequestBody MemberRequestDTO memberRequestDTO) {
        MemberDataDTO memberDataDTO = classService.manageMember(memberRequestDTO);
        return memberDataDTO != null ? new ResponseEntity<MemberDataDTO>(memberDataDTO,HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(path = "/remove-member")
    public ResponseEntity<?> removeMember (@RequestBody MemberRequestDTO memberRequestDTO) {
        MemberDataDTO memberDataDTO = classService.manageMember(memberRequestDTO);
        return memberDataDTO != null ? new ResponseEntity<MemberDataDTO>(memberDataDTO,HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PatchMapping(path = "/{classId}/lessons/{lessonId}/update")
    public ResponseEntity<?> updateLesson (@PathVariable String lessonId,@RequestBody Lesson lesson)   {
        return lessonService.updateLesson(lessonId, lesson) ? new ResponseEntity<>(null, HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    // overview
    @GetMapping(path = "/{classId}/overview/member_id={userId}")
    public ResponseEntity<?> getMemberOverview (@PathVariable String classId, @PathVariable String userId) {
        MemberOverviewDTO memberOverviewDTO = classService.getMemberOverview(classId,userId);
        return memberOverviewDTO == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<MemberOverviewDTO>(memberOverviewDTO, HttpStatus.OK);
    }

    // messenger
    @GetMapping(path = "/{classId}/messages")
    public ResponseEntity<?> getMessages (@PathVariable String classId) {
        return new ResponseEntity<List<ClassMessage>>(classMessageService.getAllMessagesByClassId(classId), HttpStatus.OK);
    }
}
