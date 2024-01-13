package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.models.KLearning.Lesson;
import com.kma.wordprocessor.models.KLearning.LessonMessenger;
import com.kma.wordprocessor.repositories.KLearning.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    @Autowired
    LessonRepository lessonRepository;

    public Lesson getLesson (String lessonId) {
        Optional<Lesson> optionalLesson = lessonRepository.findById(lessonId);
        return optionalLesson.orElse(null);
    }

    public List<Lesson> getLessonList (String chapterId) {
        return lessonRepository.findByChapterId(chapterId);
    }

    public void createLesson(String type, Lesson lesson) {
        Lesson newLesson = new Lesson();
        if (type.equals("video")) {
            newLesson.setOwnerId(lesson.getOwnerId());
            newLesson.setClassId(lesson.getClassId());
            newLesson.setChapterId(lesson.getChapterId());
            newLesson.setName(lesson.getName());
            newLesson.setType("video");
            newLesson.setMediaLink(lesson.getMediaLink());
            newLesson.setDescription(lesson.getDescription());
            newLesson.setMessenger(new LessonMessenger());
        } else {

        }
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

}
